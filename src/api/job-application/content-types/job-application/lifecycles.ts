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

      // Send email
      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: recipient?.email,
          subject: compiledSubject,
          text: compiledText,
          html: compiledHtml,
        });

      strapi.log.info("Job application email sent to:", recipient);
    } catch (err) {
      strapi.log.error("Error sending job application email", err);
    }
  },
};
