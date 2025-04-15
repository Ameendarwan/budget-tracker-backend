import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Your App Name" <no-reply@yourapp.com>',
    to,
    subject: "Reset Your Password",
    html: `<p>Click the link below to reset your password:</p><a href="${link}">${link}</a>`,
  });
};
