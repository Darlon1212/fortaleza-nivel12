import nodemailer from 'nodemailer'

// Configuração do transportador de email
const createTransporter = () => {
  // Você pode usar Gmail, SendGrid, Mailgun, etc.
  // Exemplo com Gmail (configure as variáveis de ambiente)
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password para Gmail
    },
  })

  // Exemplo com SMTP genérico
  // return nodemailer.createTransporter({
  //   host: process.env.SMTP_HOST,
  //   port: parseInt(process.env.SMTP_PORT || '587'),
  //   secure: false,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // })
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export const enviarEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
}

export const enviarEmailsEmMassa = async (
  emails: string[],
  subject: string,
  htmlContent: string,
  onProgress?: (enviados: number, total: number) => void
): Promise<{ sucessos: number; erros: number; detalhes: Array<{ email: string; sucesso: boolean; erro?: string }> }> => {
  const resultados = {
    sucessos: 0,
    erros: 0,
    detalhes: [] as Array<{ email: string; sucesso: boolean; erro?: string }>
  }

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i]
    
    try {
      const sucesso = await enviarEmail({
        to: email,
        subject,
        html: htmlContent
      })

      if (sucesso) {
        resultados.sucessos++
        resultados.detalhes.push({ email, sucesso: true })
      } else {
        resultados.erros++
        resultados.detalhes.push({ email, sucesso: false, erro: 'Falha no envio' })
      }
    } catch (error) {
      resultados.erros++
      resultados.detalhes.push({ 
        email, 
        sucesso: false, 
        erro: error instanceof Error ? error.message : 'Erro desconhecido' 
      })
    }

    // Callback de progresso
    if (onProgress) {
      onProgress(i + 1, emails.length)
    }

    // Pequeno delay para evitar rate limiting
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return resultados
}