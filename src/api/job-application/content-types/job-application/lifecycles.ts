import _ from "lodash";
import { emailTemplate } from "./email-template";

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
      const compiledSubject = _.template(emailTemplate.subject)({ applicant });
      const compiledText = _.template(emailTemplate.text)({ applicant });
      const compiledHtml = _.template(emailTemplate.html)({ applicant });

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
};
