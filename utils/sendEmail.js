import nodemailer from 'nodemailer'

export async function sendEmail({ email, ...rest }) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })

  let info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    ...rest
  })

  console.log('Message sent: %s', info.messageId)
}
