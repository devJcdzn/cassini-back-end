import nodemailer from "nodemailer";
import { env } from "../env";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

interface IMail {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail({ to, subject, text }: IMail) {
  await transporter.sendMail({
    from: "test@mail.com",
    to,
    subject,
    html: text,
  });
}
