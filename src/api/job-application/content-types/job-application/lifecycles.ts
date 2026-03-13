import _ from "lodash";
import {
  applicationReceivedEmailTemplate,
  finalInterviewTemplate,
  initialInterviewTemplate,
  updatedInterviewLinkTemplate,
  rejectedTemplate,
  rejectedWithFeedbackTemplate
} from "./email-template";

export default {

  async afterCreate(event) {
    const recipient = event.params?.data;

    if (!recipient?.email) {
      strapi.log.warn("No recipient email found for job application");
      return;
    }

    try {

      const emailConfig = await strapi.config.get("plugin.email") as any;

      const applicant = {
        name: recipient?.fullName,
        position: "Programme & Operations Manager",
        logoUrl: emailConfig?.providerOptions?.emailLogoUrl,
        year: new Date().getFullYear(),
      };

      const compiledSubject = _.template(applicationReceivedEmailTemplate.subject)({ applicant });
      const compiledText = _.template(applicationReceivedEmailTemplate.text)({ applicant });
      const compiledHtml = _.template(applicationReceivedEmailTemplate.html)({ applicant });

      const walsServer = process.env.WALS_API_SERVER || "";

      if (!walsServer) {
        strapi.log.warn("WALS_API_SERVER not configured");
        return;
      }

      const sendEndpoint = `${walsServer.replace(/\/$/, "")}/send-email`;

      const payload = {
        to: recipient.email,
        subject: compiledSubject,
        from: emailConfig?.providerOptions?.emailFrom || "no-reply@walsfoundation.org",
        from_name: emailConfig?.providerOptions?.emailFromName || "WALS Foundation",
        text: compiledText,
        html: compiledHtml,
      };

      const res = await fetch(sendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const bodyText = await res.text().catch(() => null);
        throw new Error(`Failed to send email: ${res.status} ${bodyText ?? ""}`);
      }

      strapi.log.info(`Application received email sent to ${recipient.email}`);

    } catch (err) {
      strapi.log.error("Error sending application email", err);
    }
  },



  async afterUpdate(event) {

    const { result } = event;

    const {
      id,
      stage,
      email,
      fullName,
      interviewLink,
      lastSentInterviewLink,
      emailSentFor,
      feedbackLink
    } = result;

    if (!email) {
      strapi.log.warn("Job application updated but no email found");
      return;
    }

    const interviewStages = ["initial_interview", "final_interview"];

    let template = null;
    let isUpdatedLinkEmail = false;


    if (emailSentFor !== stage) {

      if (stage === "initial_interview") {
        if (!interviewLink) return;
        template = initialInterviewTemplate;
      }

      else if (stage === "final_interview") {
        if (!interviewLink) return;
        template = finalInterviewTemplate;
      }

      else if (stage === "rejected") {
        template = rejectedTemplate;
      }

      else if (stage === "rejected_with_feedback") {
        template = rejectedWithFeedbackTemplate;
      }

    }


    else if (
      interviewStages.includes(stage) &&
      interviewLink &&
      interviewLink !== lastSentInterviewLink
    ) {
      template = updatedInterviewLinkTemplate;
      isUpdatedLinkEmail = true;
    }

    else {
      return;
    }



    try {

      const emailConfig = await strapi.config.get("plugin.email") as any;

      const applicant = {
        name: fullName,
        position: "Programme & Operations Manager",
        logoUrl: emailConfig?.providerOptions?.emailLogoUrl,
        year: new Date().getFullYear(),
        feedbackLink
      };

      const interview = {
        stage,
        link: interviewLink
      };

      const compiledSubject = _.template(template.subject)({ applicant, interview });

      const compiledText = _.template(template.text)({
        applicant,
        interview
      });

      const compiledHtml = _.template(template.html)({
        applicant,
        interview
      });

      const walsServer = process.env.WALS_API_SERVER || "";

      if (!walsServer) {
        strapi.log.warn("WALS_API_SERVER not configured");
        return;
      }

      const sendEndpoint = `${walsServer.replace(/\/$/, "")}/send-email`;

      const payload = {
        to: email,
        subject: compiledSubject,
        from: emailConfig?.providerOptions?.emailFrom || "no-reply@walsfoundation.org",
        from_name: emailConfig?.providerOptions?.emailFromName || "WALS Foundation",
        text: compiledText,
        html: compiledHtml,
      };

      const res = await fetch(sendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const bodyText = await res.text().catch(() => null);
        throw new Error(`Failed to send email: ${res.status} ${bodyText ?? ""}`);
      }


      const updateData: any = {};

      if (!isUpdatedLinkEmail) {
        updateData.emailSentFor = stage;
      }

      if (interviewLink) {
        updateData.lastSentInterviewLink = interviewLink;
      }

      if (Object.keys(updateData).length > 0) {
        await strapi.entityService.update(
          "api::job-application.job-application",
          id,
          { data: updateData }
        );
      }


      strapi.log.info(`Stage email sent (${stage}) to ${email}`);

    }

    catch (err) {

      strapi.log.error(
        "Error sending stage email",
        err
      );

    }

  }

};