import nodeMailer from 'nodemailer'
export const sendEmail=async(options)=>{
    const transporter=nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // false for 587 (STARTTLS)
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        },
        // Optimizations for cloud environments
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000, 
        socketTimeout: 10000,
        debug: true, // Enable debug logs
        logger: true // Log to console
    })
    const mailOptions={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(mailOptions);
}