import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
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

export async function sendWelcomeEmail(email: string, name: string) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_SEND_TOKEN!,
  });

  const sentFrom = new Sender(
    "test@trial-neqvygme7p840p7w.mlsender.net",
    "Support Cassini"
  );
  const recipients = [new Recipient(email, name)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Bem vindo")
    .setText("Bem vindoo!!");

  await mailerSend.email.send(emailParams);
}

export async function sendAuthEmail(email: string, name: string) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_SEND_TOKEN!,
  });

  const sentFrom = new Sender(
    "test@trial-neqvygme7p840p7w.mlsender.net",
    "Support Cassini"
  );
  const recipients = [new Recipient(email, name)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Auth")
    .setTemplateId("0p7kx4x63yv49yjr");

  await mailerSend.email.send(emailParams);
}
