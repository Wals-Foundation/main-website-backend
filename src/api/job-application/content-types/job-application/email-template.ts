import _ from "lodash";

export const applicationReceivedEmailTemplate = {
  subject: 'Thanks for applying, <%= applicant.name %>!',
  text: `Hi <%= applicant.name %>,

We have received your application for the <%= applicant.position %> position.

Warm regards,
WALS Foundation Team`,
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application Received</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Manrope", Arial, Helvetica, sans-serif;
        background-color: #f7f9ff;
        color: #181c20;
      }
      a { text-decoration: none; }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #009EE2;
        color: #FFFFFF !important;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        font-family: "Manrope", Arial, sans-serif;
      }
      .btn:hover { background-color: #95cdf7; }
      .title { font-family: "ManropeSemiBold", Arial, sans-serif; font-size: 32px; line-height: 40px; margin: 0 0 16px 0; color: #181c20; }
      .subtitle { font-family: "ManropeMedium", Arial, sans-serif; font-size: 16px; line-height: 24px; text-transform: uppercase; letter-spacing: 1px; color: #009EE2; margin: 0 0 24px 0; }
      .paragraph { font-family: "ManropeRegular", Arial, sans-serif; font-size: 16px; line-height: 28px; margin: 0 0 16px 0; color: #181c20; }
      .footer { font-family: "ManropeRegular", Arial, sans-serif; font-size: 12px; line-height: 18px; color: #6b7280; text-align: center; padding: 24px; }
      .logo { width: 200px; height: auto; margin-bottom: 12px; display: block; }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 24px 12px">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 6px; overflow: hidden;">
            <!-- Header / Logo -->
            <tr>
              <td align="center" style="padding: 32px 24px 16px 24px;">
                <img src="<%= applicant.logoUrl %>" alt="WALS Foundation Logo" class="logo" />
                <p class="subtitle"><em>Everyone Can Help</em></p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px 24px;">
                <h1 class="title">Hi <%= applicant.name %>,</h1>
                <p class="paragraph">
                  We have received your application for the <strong><%= applicant.position %></strong> position.
                </p>
                <p class="paragraph">
                  We will review your application carefully and contact you shortly.
                </p>

                <% if (applicant.ctaUrl) { %>
                <p style="text-align: center; margin: 32px 0 0 0;">
                  <a href="<%= applicant.ctaUrl %>" class="btn"><%= applicant.ctaText %></a>
                </p>
                <% } %>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <p>We Are Liberating Societies Foundation</p>
                <p>Building transparent, effective, and efficient systems to end extreme poverty.</p>
                <p>© <%= applicant.year %> WALS Foundation • All rights reserved</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
};

export const initialInterviewTemplate = {
  subject: 'Interview Invitation – WALS Foundation',
  text: `Hi <%= applicant.name %>,

Thank you for applying to WALS Foundation.

We would like to invite you to an initial interview as the next step in our recruitment process. Please use the link below to select a time that works best for you.

Interview link:
<%= interview.link %>

Before your interview, we'd like to invite you to learn more about our organisation and mission:
https://docs.google.com/document/d/1X5_vG81aMaV-NYQAnv6a1-Ey0fmazfHlTNoHMYpLKaA

Warm regards,
WALS Foundation Team`,
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interview Invitation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Manrope", Arial, Helvetica, sans-serif;
        background-color: #f7f9ff;
        color: #181c20;
      }
      a { text-decoration: none; }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #009EE2;
        color: #FFFFFF !important;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        font-family: "Manrope", Arial, sans-serif;
      }
      .btn:hover { background-color: #95cdf7; }
      .title { font-family: "ManropeSemiBold", Arial, sans-serif; font-size: 32px; line-height: 40px; margin: 0 0 16px 0; }
      .subtitle { font-family: "ManropeMedium", Arial, sans-serif; font-size: 16px; line-height: 24px; text-transform: uppercase; letter-spacing: 1px; color: #009EE2; margin: 0 0 24px 0; }
      .paragraph { font-family: "ManropeRegular", Arial, sans-serif; font-size: 16px; line-height: 28px; margin: 0 0 16px 0; }
      .footer { font-family: "ManropeRegular", Arial, sans-serif; font-size: 12px; line-height: 18px; color: #6b7280; text-align: center; padding: 24px; }
      .logo { width: 200px; height: auto; margin-bottom: 12px; display: block; }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 24px 12px">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 6px;">
            <tr>
              <td align="center" style="padding: 32px 24px 16px 24px;">
                <img src="<%= applicant.logoUrl %>" class="logo" />
                <p class="subtitle"><em>Everyone Can Help</em></p>
              </td>
            </tr>

            <tr>
              <td style="padding: 32px 24px;">
                <h1 class="title">Hi <%= applicant.name %>,</h1>
                <p class="paragraph">
                  Thank you for your application. We are pleased to invite you to an initial interview with WALS Foundation.
                </p>
                <p class="paragraph">
                  Please select a suitable time using the link below:
                </p>

                <p style="text-align:center; margin-top:32px;">
                  <a href="<%= interview.link %>" class="btn">Choose Interview Time</a>
                </p>

                <p class="paragraph" style="margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                  Before your interview, we'd like to invite you to learn more about our organisation and mission:
                </p>

                <p style="text-align:center; margin-top:16px;">
                  <a href="https://docs.google.com/document/d/1X5_vG81aMaV-NYQAnv6a1-Ey0fmazfHlTNoHMYpLKaA" class="btn">Learn About WALS</a>
                </p>
              </td>
            </tr>

            <tr>
              <td class="footer">
                <p>We Are Liberating Societies Foundation</p>
                <p>Building transparent, effective, and efficient systems to end extreme poverty.</p>
                <p>© <%= applicant.year %> WALS Foundation</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
};

export const finalInterviewTemplate = {
  subject: 'Final Interview Invitation – WALS Foundation',
  text: `Hi <%= applicant.name %>,

Congratulations on progressing to the final stage of our recruitment process.

You are invited to a final interview with members of the WALS Foundation Board & Patrons. Please select a suitable time using the link below.

Interview link:
<%= interview.link %>

Warm regards,
WALS Foundation Team`,
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interview Invitation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Manrope", Arial, Helvetica, sans-serif;
        background-color: #f7f9ff;
        color: #181c20;
      }
      a { text-decoration: none; }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #009EE2;
        color: #FFFFFF !important;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        font-family: "Manrope", Arial, sans-serif;
      }
      .btn:hover { background-color: #95cdf7; }
      .title { font-family: "ManropeSemiBold", Arial, sans-serif; font-size: 32px; line-height: 40px; margin: 0 0 16px 0; }
      .subtitle { font-family: "ManropeMedium", Arial, sans-serif; font-size: 16px; line-height: 24px; text-transform: uppercase; letter-spacing: 1px; color: #009EE2; margin: 0 0 24px 0; }
      .paragraph { font-family: "ManropeRegular", Arial, sans-serif; font-size: 16px; line-height: 28px; margin: 0 0 16px 0; }
      .footer { font-family: "ManropeRegular", Arial, sans-serif; font-size: 12px; line-height: 18px; color: #6b7280; text-align: center; padding: 24px; }
      .logo { width: 200px; height: auto; margin-bottom: 12px; display: block; }
    </style>
  </head>
  <body>
    <table width="100%">
      <tr>
        <td align="center" style="padding:24px">
          <table width="600" style="background:#fff;border-radius:6px">
            <tr>
              <td align="center" style="padding:32px 24px 16px">
                <img src="<%= applicant.logoUrl %>" class="logo" />
                <p class="subtitle"><em>Everyone Can Help</em></p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 24px">
                <h1 class="title">Hi <%= applicant.name %>,</h1>
                <p class="paragraph">
                  Congratulations on being shortlisted for the final interview stage.
                </p>
                <p class="paragraph">
                  This interview will be with members of the WALS Foundation Board & Patrons.
                </p>

                <p style="text-align:center;margin-top:32px">
                  <a href="<%= interview.link %>" class="btn">Choose Interview Time</a>
                </p>
              </td>
            </tr>

            <tr>
              <td class="footer">
                <p>We Are Liberating Societies Foundation</p>
                <p>Building transparent, effective, and efficient systems to end extreme poverty.</p>
                <p>© <%= applicant.year %> WALS Foundation</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
};

export const updatedInterviewLinkTemplate = {
  subject: 'Updated Interview Scheduling Link – WALS Foundation',
  text: `Hi <%= applicant.name %>,

Please note that your interview scheduling link has been updated.

Use the new link below to select a suitable time:
<%= interview.link %>

Warm regards,
WALS Foundation Team`,
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interview Invitation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Manrope", Arial, Helvetica, sans-serif;
        background-color: #f7f9ff;
        color: #181c20;
      }
      a { text-decoration: none; }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #009EE2;
        color: #FFFFFF !important;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        font-family: "Manrope", Arial, sans-serif;
      }
      .btn:hover { background-color: #95cdf7; }
      .title { font-family: "ManropeSemiBold", Arial, sans-serif; font-size: 32px; line-height: 40px; margin: 0 0 16px 0; }
      .subtitle { font-family: "ManropeMedium", Arial, sans-serif; font-size: 16px; line-height: 24px; text-transform: uppercase; letter-spacing: 1px; color: #009EE2; margin: 0 0 24px 0; }
      .paragraph { font-family: "ManropeRegular", Arial, sans-serif; font-size: 16px; line-height: 28px; margin: 0 0 16px 0; }
      .footer { font-family: "ManropeRegular", Arial, sans-serif; font-size: 12px; line-height: 18px; color: #6b7280; text-align: center; padding: 24px; }
      .logo { width: 200px; height: auto; margin-bottom: 12px; display: block; }
    </style>
  </head>
  <body>
    <table width="100%">
      <tr>
        <td align="center" style="padding:24px">
          <table width="600" style="background:#fff;border-radius:6px">
            <tr>
              <td align="center" style="padding:32px 24px 16px">
                <img src="<%= applicant.logoUrl %>" class="logo" />
                <p class="subtitle"><em>Everyone Can Help</em></p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 24px">
                <h1 class="title">Hi <%= applicant.name %>,</h1>
                <p class="paragraph">
                  There has been an update to your interview scheduling link.
                </p>
                <p class="paragraph">
                  Please use the new link below to select a suitable time.
                </p>

                <p style="text-align:center;margin-top:32px">
                  <a href="<%= interview.link %>" class="btn">View Updated Schedule</a>
                </p>
              </td>
            </tr>

            <tr>
              <td class="footer">
                <p>We Are Liberating Societies Foundation</p>
                <p>Building transparent, effective, and efficient systems to end extreme poverty.</p>
                <p>© <%= applicant.year %> WALS Foundation</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
};

export const rejectedTemplate = {
  subject: 'Update on Your Application – WALS Foundation',
  text: `Hi <%= applicant.name %>,

Thank you for taking the time to apply for the <%= applicant.position %> role at WALS Foundation.

After careful consideration, we regret to inform you that we will not be progressing with your application further at this time.

We received a strong number of applications and this was not an easy decision.

We truly appreciate your interest in WALS Foundation and wish you the very best in your future work.

Warm regards,
WALS Foundation Team`,
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application Update</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Manrope", Arial, Helvetica, sans-serif;
        background-color: #f7f9ff;
        color: #181c20;
      }
      a { text-decoration: none; }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #009EE2;
        color: #FFFFFF !important;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        font-family: "Manrope", Arial, sans-serif;
      }
      .btn:hover { background-color: #95cdf7; }
      .title { font-family: "ManropeSemiBold", Arial, sans-serif; font-size: 32px; line-height: 40px; margin: 0 0 16px 0; color: #181c20; }
      .subtitle { font-family: "ManropeMedium", Arial, sans-serif; font-size: 16px; line-height: 24px; text-transform: uppercase; letter-spacing: 1px; color: #009EE2; margin: 0 0 24px 0; }
      .paragraph { font-family: "ManropeRegular", Arial, sans-serif; font-size: 16px; line-height: 28px; margin: 0 0 16px 0; color: #181c20; }
      .footer { font-family: "ManropeRegular", Arial, sans-serif; font-size: 12px; line-height: 18px; color: #6b7280; text-align: center; padding: 24px; }
      .logo { width: 200px; height: auto; margin-bottom: 12px; display: block; }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 24px 12px">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 6px; overflow: hidden;">
            <!-- Header / Logo -->
            <tr>
              <td align="center" style="padding: 32px 24px 16px 24px;">
                <img src="<%= applicant.logoUrl %>" alt="WALS Foundation Logo" class="logo" />
                <p class="subtitle"><em>Everyone Can Help</em></p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px 24px;">
                <h1 class="title">Hi <%= applicant.name %>,</h1>
                <p class="paragraph">
                  Thank you for taking the time to apply for the <strong><%= applicant.position %></strong> role at WALS Foundation.
                </p>
                <p class="paragraph">
                  After careful consideration, we regret to inform you that we will not be progressing with your application further at this time.
                </p>
                <p class="paragraph">
                  We received a strong number of applications and this was not an easy decision.
                </p>
                <p class="paragraph">
                  We truly appreciate your interest in WALS Foundation and wish you the very best in your future work.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <p>We Are Liberating Societies Foundation</p>
                <p>Building transparent, effective, and efficient systems to end extreme poverty.</p>
                <p>© <%= applicant.year %> WALS Foundation • All rights reserved</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
};

export const rejectedWithFeedbackTemplate = {
  subject: 'Update on Your Application – WALS Foundation',
  text: `Hi <%= applicant.name %>,

Thank you again for your interest in the <%= applicant.position %> role at WALS Foundation.

After careful review, we will not be progressing with your application further.

If you would find it helpful, we would be happy to offer brief feedback on your application. If you would like this, you can book a short feedback call using the link below:

<%= applicant.feedbackLink %>

Warm regards,
WALS Foundation Team`,
  html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application Update</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Manrope", Arial, Helvetica, sans-serif;
        background-color: #f7f9ff;
        color: #181c20;
      }
      a { text-decoration: none; }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #009EE2;
        color: #FFFFFF !important;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        font-family: "Manrope", Arial, sans-serif;
      }
      .btn:hover { background-color: #95cdf7; }
      .title { font-family: "ManropeSemiBold", Arial, sans-serif; font-size: 32px; line-height: 40px; margin: 0 0 16px 0; color: #181c20; }
      .subtitle { font-family: "ManropeMedium", Arial, sans-serif; font-size: 16px; line-height: 24px; text-transform: uppercase; letter-spacing: 1px; color: #009EE2; margin: 0 0 24px 0; }
      .paragraph { font-family: "ManropeRegular", Arial, sans-serif; font-size: 16px; line-height: 28px; margin: 0 0 16px 0; color: #181c20; }
      .footer { font-family: "ManropeRegular", Arial, sans-serif; font-size: 12px; line-height: 18px; color: #6b7280; text-align: center; padding: 24px; }
      .logo { width: 200px; height: auto; margin-bottom: 12px; display: block; }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 24px 12px">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 6px; overflow: hidden;">
            <!-- Header / Logo -->
            <tr>
              <td align="center" style="padding: 32px 24px 16px 24px;">
                <img src="<%= applicant.logoUrl %>" alt="WALS Foundation Logo" class="logo" />
                <p class="subtitle"><em>Everyone Can Help</em></p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px 24px;">
                <h1 class="title">Hi <%= applicant.name %>,</h1>
                <p class="paragraph">
                  Thank you again for your interest in the <strong><%= applicant.position %></strong> role at WALS Foundation.
                </p>
                <p class="paragraph">
                  After careful review, we will not be progressing with your application further.
                </p>
                <p class="paragraph">
                  If you would find it helpful, we would be happy to offer brief feedback on your application.
                </p>

                <p style="text-align: center; margin: 32px 0 0 0;">
                  <a href="<%= applicant.feedbackLink %>" class="btn">Book a Feedback Call</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <p>We Are Liberating Societies Foundation</p>
                <p>Building transparent, effective, and efficient systems to end extreme poverty.</p>
                <p>© <%= applicant.year %> WALS Foundation • All rights reserved</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
};