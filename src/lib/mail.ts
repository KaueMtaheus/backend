// Importando o módulo nodemailer para enviar e-mails
import nodemailer from 'nodemailer'

export async function getMailClient() {
    // Criando uma conta de teste no nodemailer
    const account = await nodemailer.createTestAccount()


// Configurando o transporte de e-mail usando a conta de teste
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass,
        }
    })

    return transporter
    
}