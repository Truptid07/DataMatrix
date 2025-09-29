import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  try {
    // Check if email credentials are properly configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === 'dummy@example.com') {
      console.log('📧 Email not configured. Skipping email send.');
      console.log(`Would have sent: ${subject} to ${to}`);
      return { success: false, message: 'Email not configured' };
    }

    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DataMatrix" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('📧 Email send failed:', error.message);
    return { success: false, message: error.message };
  }
};

export default sendEmail;