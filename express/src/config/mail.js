import nodemailer from 'nodemailer';

export default async function mailConfig() {
  if (process.env.NODE_ENV === 'development') {
    // usa conta de teste ethereal em dev
    const testAccount = await nodemailer.createTestAccount();
    return {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    };
  }

  // produção: ler do env e validar
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('Configuração de e-mail incompleta. Defina MAIL_HOST, MAIL_USER e MAIL_PASS.');
  }

  return {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  };
}