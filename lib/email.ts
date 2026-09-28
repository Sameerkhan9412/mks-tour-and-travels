import nodemailer from 'nodemailer';

interface SendQuoteEmailParams {
  name: string;
  email: string;
  phoneNumber: string;
  category?: string;
  packageName?: string;
  travelDate?: string;
  travelersCount?: number;
  message?: string;
}

// Create reusable transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  // Return null if credentials are not configured
  if (!user || !pass) {
    return null;
  }

  // Optimize for Gmail service if using Google SMTP
  if (host.includes('gmail') || user.endsWith('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send quotation emails:
 * 1. Admin notification email (sent to SMTP_USER from .env)
 * 2. Customer confirmation copy email
 */
export async function sendQuoteEmails(params: SendQuoteEmailParams): Promise<{
  adminSent: boolean;
  customerSent: boolean;
  error?: string;
}> {
  const {
    name,
    email,
    phoneNumber,
    category = 'General Inquiry',
    packageName = 'Custom Tour Plan',
    travelDate = 'To be decided',
    travelersCount = 1,
    message = 'No additional notes provided',
  } = params;

  // The admin notification email is sent directly to SMTP_USER from .env
  const adminEmail = process.env.SMTP_USER || process.env.ADMIN_EMAIL || 'info@mskholidays.com';
  const fromEmail = `"MSK Holiday's" <${process.env.SMTP_USER || 'no-reply@mskholidays.com'}>`;

  const transporter = getTransporter();

  // If no SMTP configured, log to console for development verification
  if (!transporter) {
    console.log('\n======================================================');
    console.log('📧 [EMAIL SIMULATION - SMTP not configured]');
    console.log(`To Admin: ${adminEmail}`);
    console.log(`To Customer: ${email}`);
    console.log(`Tour Plan: ${packageName} (${category})`);
    console.log(`Customer: ${name} | Phone: ${phoneNumber}`);
    console.log(`Travel Date: ${travelDate} | Travelers: ${travelersCount}`);
    console.log(`Message: ${message}`);
    console.log('======================================================\n');

    return { adminSent: true, customerSent: true };
  }

  // 1. Admin Email HTML
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Tour Quote Request</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
        .header { background: #0B3B78; padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0 0 8px; font-size: 22px; font-weight: 800; }
        .header p { margin: 0; font-size: 13px; opacity: 0.85; }
        .badge { display: inline-block; background: #fef3c7; color: #b45309; font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px; }
        .content { padding: 24px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .detail-label { font-weight: 600; color: #64748b; }
        .detail-val { font-weight: 700; color: #0f172a; text-align: right; }
        .notes-box { background: #f8fafc; border-left: 4px solid #0B3B78; padding: 14px; margin-top: 16px; border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.5; color: #334155; }
        .btn { display: inline-block; background: #0B3B78; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge">New Quote Request</span>
          <h1>MSK Holiday's Admin Alert</h1>
          <p>A customer has requested a personalized quotation</p>
        </div>
        <div class="content">
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 600; font-size: 13px;">Selected Tour Plan:</td>
              <td style="color: #0B3B78; font-weight: 800; font-size: 14px; text-align: right;">${packageName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 600; font-size: 13px;">Category / Region:</td>
              <td style="color: #0f172a; font-weight: 700; font-size: 13px; text-transform: capitalize; text-align: right;">${category}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 600; font-size: 13px;">Customer Name:</td>
              <td style="color: #0f172a; font-weight: 700; font-size: 13px; text-align: right;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 600; font-size: 13px;">Customer Email:</td>
              <td style="color: #0f172a; font-weight: 700; font-size: 13px; text-align: right;"><a href="mailto:${email}" style="color: #0B3B78;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 600; font-size: 13px;">Phone / WhatsApp:</td>
              <td style="color: #0f172a; font-weight: 700; font-size: 13px; text-align: right;"><a href="tel:${phoneNumber}" style="color: #0B3B78;">${phoneNumber}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 600; font-size: 13px;">Travel Date:</td>
              <td style="color: #0f172a; font-weight: 700; font-size: 13px; text-align: right;">${travelDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 600; font-size: 13px;">Travelers Count:</td>
              <td style="color: #0f172a; font-weight: 700; font-size: 13px; text-align: right;">${travelersCount} Person(s)</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <strong style="font-size: 13px; color: #475569;">Customer Requirements / Message:</strong>
            <div class="notes-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${email}?subject=Quotation for ${encodeURIComponent(packageName)} - MSK Holidays" class="btn">
              Reply to Customer Directly
            </a>
          </div>
        </div>
        <div class="footer">
          Received via MSK Holiday's Website Quotation Engine • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Customer Copy Email HTML
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Quote Request - MSK Holiday's</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
        .header { background: #0B3B78; padding: 28px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0 0 8px; font-size: 22px; font-weight: 800; }
        .header p { margin: 0; font-size: 13px; opacity: 0.9; }
        .badge { display: inline-block; background: #10b981; color: #ffffff; font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px; }
        .content { padding: 28px 24px; }
        .summary-box { background: #f8fafc; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #e2e8f0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge">Quotation Request Received</span>
          <h1>Thank You, ${name}!</h1>
          <p>We've received your inquiry and are crafting the best tour itinerary for you.</p>
        </div>
        <div class="content">
          <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-top: 0;">
            Dear <strong>${name}</strong>,<br><br>
            Thank you for reaching out to <strong>MSK Holiday's</strong>. Here is a copy of the details you submitted for your customized quotation:
          </p>

          <div class="summary-box">
            <h3 style="margin: 0 0 12px; font-size: 15px; color: #0B3B78; font-weight: 800;">
              Your Trip Request Summary
            </h3>
            <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="color: #64748b; font-weight: 600;">Tour Plan:</td>
                <td style="color: #0f172a; font-weight: 800; text-align: right;">${packageName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="color: #64748b; font-weight: 600;">Region / Category:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right; text-transform: capitalize;">${category}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="color: #64748b; font-weight: 600;">Preferred Travel Date:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">${travelDate}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="color: #64748b; font-weight: 600;">Number of Guests:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">${travelersCount} Person(s)</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 600; vertical-align: top; padding-top: 8px;">Your Message:</td>
                <td style="color: #334155; font-style: italic; text-align: right; padding-top: 8px;">${message}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; border-radius: 12px; padding: 16px; border: 1px solid #bfdbfe; font-size: 13px; color: #1e40af; line-height: 1.5;">
            <strong>What happens next?</strong><br>
            Our dedicated tour specialist will review your preferences and share a personalized day-wise itinerary along with our best competitive quotation via email and WhatsApp within <strong>few hours</strong>.
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Need immediate assistance?</p>
            <p style="font-size: 15px; font-weight: 800; color: #0B3B78; margin: 0;">
              Call or WhatsApp: +91 98765 43210 / +91 98054 00248
            </p>
          </div>
        </div>

        <div class="footer">
          <strong>MSK Holiday's (India Tours Only)</strong><br>
          102, Royal Plaza Building, Mumbai, MH - 400001, India<br>
          <a href="mailto:info@mskholidays.com" style="color: #0B3B78;">info@mskholidays.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  let adminSent = false;
  let customerSent = false;
  let errorMsg = '';

  // Send to Admin
  try {
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `New Tour Quote: ${packageName} - ${name}`,
      html: adminHtml,
    });
    adminSent = true;
  } catch (err: any) {
    console.error('Failed to send admin quotation email:', err);
    errorMsg += `Admin send error: ${err.message}. `;
  }

  // Send Copy to Customer
  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `Your Tour Quote Request - ${packageName} | MSK Holiday's`,
      html: customerHtml,
    });
    customerSent = true;
  } catch (err: any) {
    console.error('Failed to send customer copy email:', err);
    errorMsg += `Customer copy error: ${err.message}. `;
  }

  return {
    adminSent,
    customerSent,
    error: errorMsg || undefined,
  };
}
