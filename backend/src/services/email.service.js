import nodemailer from "nodemailer";

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Plantilla HTML para el email
const getTicketEmailTemplate = (ticket, sharedBy) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .ticket-info {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .ticket-info p {
          margin: 8px 0;
        }
        .label {
          font-weight: bold;
          color: #4b5563;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          margin: 4px 0;
        }
        .status-open { background-color: #fef3c7; color: #92400e; }
        .status-assigned { background-color: #dbeafe; color: #1e40af; }
        .status-in_progress { background-color: #e9d5ff; color: #6b21a8; }
        .status-closed { background-color: #d1fae5; color: #065f46; }
        .priority-low { background-color: #f3f4f6; color: #374151; }
        .priority-medium { background-color: #fef3c7; color: #92400e; }
        .priority-high { background-color: #fed7aa; color: #9a3412; }
        .priority-urgent { background-color: #fecaca; color: #991b1b; }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎫 ServiceDesk AI - Ticket Shared</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p><strong>${sharedBy.name}</strong> (${sharedBy.email}) has shared a ticket with you:</p>
          
          <div class="ticket-info">
            <h2 style="margin-top: 0;">${ticket.title}</h2>
            <p><span class="label">Status:</span> <span class="badge status-${ticket.status}">${ticket.status}</span></p>
            <p><span class="label">Priority:</span> <span class="badge priority-${ticket.priority}">${ticket.priority}</span></p>
            <p><span class="label">Description:</span></p>
            <p style="white-space: pre-wrap;">${ticket.description}</p>
            
            ${ticket.office ? `<p><span class="label">Office:</span> ${ticket.office.name}</p>` : ''}
            ${ticket.workstation ? `<p><span class="label">Workstation:</span> ${ticket.workstation}</p>` : ''}
            ${ticket.assignedTo ? `<p><span class="label">Assigned to:</span> ${ticket.assignedTo.name}</p>` : ''}
            
            <p><span class="label">Created:</span> ${new Date(ticket.createdAt).toLocaleString()}</p>
            <p><span class="label">Created by:</span> ${ticket.user.name} (${ticket.user.email})</p>
          </div>

          ${ticket.media && ticket.media.length > 0 ? `
            <p><span class="label">Attachments:</span> ${ticket.media.length} file(s)</p>
          ` : ''}

          <center>
            <a href="${process.env.APP_URL}/tickets/${ticket._id}" class="button">
              View Ticket Details
            </a>
          </center>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            This is an automated message from ServiceDesk AI. Please do not reply to this email.
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ServiceDesk AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendTicketEmail = async (ticket, recipientEmails, sharedBy) => {
  try {
    console.log("📧 Sending ticket email to:", recipientEmails);

    const emailHtml = getTicketEmailTemplate(ticket, sharedBy);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipientEmails.join(", "),
      subject: `Ticket Shared: ${ticket.title}`,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent:", info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      recipients: recipientEmails,
    };
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error(`Failed to send email: ${err.message}`);
  }
};

// Verificar configuración de email
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email configuration is valid");
    return true;
  } catch (err) {
    console.error("❌ Email configuration error:", err);
    return false;
  }
};