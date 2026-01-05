const nodemailer = require('nodemailer');

let transporter;

// Initialize Transporter (Dev vs Prod can be handled here)
const initEmailService = async () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Real Email (Gmail, Outlook, etc.)
        transporter = nodemailer.createTransport({
            service: 'gmail', // Simplest for personal use, requires App Password
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log('📧 Email Service Configured (Real Account)');
    } else {
        // Development: Ethereal (Fake SMTP)
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
            console.log('📧 Email Service Configured (Ethereal Dev Mode)');
            console.log('   Credentials:', testAccount.user, testAccount.pass);
        } catch (err) {
            console.error('Failed to create test email account:', err);
        }
    }
};

const sendOTP = async (to, otp) => {
    if (!transporter) await initEmailService();

    try {
        const info = await transporter.sendMail({
            from: '"Learning Tracker" <no-reply@tracker.com>',
            to: to,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${otp}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff; border-radius: 10px;">
                    <h1>Verification Code</h1>
                    <p>Your OTP is:</p>
                    <h2 style="color: #3b82f6; letter-spacing: 5px; font-size: 32px;">${otp}</h2>
                    <p>This code expires in 5 minutes.</p>
                </div>
            `,
        });

        console.log(`📨 OTP Sent to ${to}`);
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
        }
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendOTP };
