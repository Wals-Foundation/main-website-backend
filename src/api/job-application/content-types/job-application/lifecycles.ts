import _ from "lodash";
import { applicationReceivedEmailTemplate, finalInterviewTemplate, initialInterviewTemplate, updatedInterviewLinkTemplate } from "./email-template";
import { log } from "console";

export default {
  async afterCreate(event) {
    const recipient = event.params?.data;

    if (!recipient?.email) {
      strapi.log.warn('No recipient email found for job application');
      return;
    }

    try {

      const emailConfig = await strapi.config.get('plugin.email') as any;

      const applicant = {
        name: recipient?.fullName,
        position: "Programme & Operations Manager",
        logoUrl: emailConfig?.providerOptions?.emailLogoUrl,
        year: new Date().getFullYear(),
      };

      // Compile templates using Lodash
      const compiledSubject = _.template(applicationReceivedEmailTemplate.subject)({ applicant });
      const compiledText = _.template(applicationReceivedEmailTemplate.text)({ applicant });
      const compiledHtml = _.template(applicationReceivedEmailTemplate.html)({ applicant });

      // Send email via WALS API endpoint
      const walsServer = process.env.WALS_API_SERVER || '';
      if (!walsServer) {
        strapi.log.warn('WALS_API_SERVER not configured; skipping sending job application email');
      } else {
        const sendEndpoint = `${walsServer.replace(/\/$/, '')}/send-email`;
        const payload = {
          to: recipient?.email,
          subject: compiledSubject,
          from: emailConfig?.providerOptions?.emailFrom || 'no-reply@walsfoundation.org',
          from_name: emailConfig?.providerOptions?.emailFromName || 'WALS Foundation',
          text: compiledText,
          html: compiledHtml,
        };

        const res = await fetch(sendEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const bodyText = await res.text().catch(() => null);
          throw new Error(`Failed to send email via WALS API: ${res.status} ${res.statusText} ${bodyText ?? ''}`);
        }

        strapi.log.info(`Job application email queued via WALS API to ${recipient?.email}`);
      }

      strapi.log.info("Job application email sent to:", recipient);
    } catch (err) {
      strapi.log.error("Error sending job application email", err);
    }
  },
  async afterUpdate(event) {
    const { result } = event;

    const {
      stage,
      interviewLink,
      lastSentInterviewLink,
      interviewEmailSentAt,
      email,
      fullName,
    } = result;

    // Only care about interview stages
    if (!['initial_interview', 'final_interview'].includes(stage)) {
      return;
    }

    // Must have recipient
    if (!email) {
      strapi.log.warn('Job application updated but no email found');
      return;
    }

    // Do nothing if interview link not yet set
    if (!interviewLink) {
      return;
    }

    // If we already sent an email for this stage and the link hasn't changed, skip
    if (interviewEmailSentAt && interviewLink === lastSentInterviewLink) {
      return;
    }

    const template =
        stage === 'initial_interview'
          ? initialInterviewTemplate
          : finalInterviewTemplate;

    try {
      const emailConfig = await strapi.config.get('plugin.email') as any;
      const compiledSubject = _.template(template.subject)({
        applicant: { name: fullName },
        interview: { stage },
      });
      const compiledText = _.template(template.text)({
        applicant: { name: fullName },
        interview: { stage, link: interviewLink },
      });
      const compiledHtml = _.template(template.html)({
        applicant: { name: fullName,logoUrl: emailConfig?.providerOptions?.emailLogoUrl },
        interview: { stage, link: interviewLink },
      });

      // Send email via WALS API endpoint
      const walsServer = process.env.WALS_API_SERVER || '';
      if (!walsServer) {
        strapi.log.warn('WALS_API_SERVER not configured; skipping sending job application email');
      } else {
        const sendEndpoint = `${walsServer.replace(/\/$/, '')}/send-email`;
        const payload = {
          to: email,
          subject: compiledSubject,
          from: emailConfig?.providerOptions?.emailFrom || 'no-reply@walsfoundation.org',
          from_name: emailConfig?.providerOptions?.emailFromName || 'WALS Foundation',
          text: compiledText,
          html: compiledHtml,
        };

        const res = await fetch(sendEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const bodyText = await res.text().catch(() => null);
          throw new Error(`Failed to send email via WALS API: ${res.status} ${res.statusText} ${bodyText ?? ''}`);
        }
      }

      // Persist email metadata to avoid duplicates
      await strapi.entityService.update(
        'api::job-application.job-application',
        result.id,
        {
          data: {
            interviewEmailSentAt:
              interviewEmailSentAt ?? new Date().toISOString(),
            lastSentInterviewLink: interviewLink,
          },
        }
      );

      strapi.log.info(
        `Interview email sent (${stage}) to ${email}`
      );
    } catch (err) {
      strapi.log.error(
        'Error sending interview email',
        err
      );
    }
  }
};
