import nodemailer from 'nodemailer';
import mailConfig from '../config/mail.js';
 
async function createNewUser(to) {
  try {
    const config = await mailConfig();
 
    const transporter = nodemailer.createTransport(config);
 
    const info = await transporter.sendMail({
      from: 'noreplay@alexandria.com',
      to,
      subject: 'Conta criada na Alexandria!',
      text: `Conta criada com sucesso.\n\nAcesse o site para acessar a biblioteca de produtos.`,
      html: `<h1>Conta criada com sucesso.</h1><p>Acesse o site para acessar a biblioteca de produtos.</p>`,
    });
 
    if (process.env.NODE_ENV === 'development') {
      console.log(`Email enviado:
        ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    throw new Error(`Falha ao enviar email: ${err.message}`);
  }
}

async function produtoAdicionadoCarrinho(to, produto, usuario) {
  try {
    const config = await mailConfig();

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreplay@alexandria.com',
      to,
      subject: 'Produto adicionado ao carrinho!',
      text: `O usuário ${usuario} adicionou ao carrinho o produto:

Nome: ${produto.nome || 'N/D'}
ID: ${produto.id_prod}
Tipo: ${produto.tipo || 'N/D'}
`,
      html: `
        <h1>Produto adicionado ao carrinho!</h1>
        <p><strong>Usuário:</strong> ${usuario}</p>
        <p><strong>Produto:</strong> ${produto.nome || 'N/D'}</p>
        <p><strong>ID:</strong> ${produto.id_prod}</p>
        <p><strong>Tipo:</strong> ${produto.tipo || 'N/D'}</p>
      `
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`Email enviado:
        ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;

  } catch (err) {
    console.error('Erro ao enviar email:', err);
    throw new Error(`Falha ao enviar email: ${err.message}`);
  }
}

export default {
  createNewUser,
  produtoAdicionadoCarrinho
};