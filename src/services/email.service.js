require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name}, \n\nThank you for registering at Backend Ledger.
    We're excited to have you on board!\n\nBest regards, \nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards, <br>The Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail, transactionDetails) {
    const subject = 'Transaction Notification';
    const text = `Hello, \n\nA transaction has been made on your account. Here are the details:\n\n${transactionDetails}\n\nBest regards, \nThe Vault Ledger Team`;
    const html = `<p>Hello,</p><p>A transaction has been made on your account. Here are the details:</p><p>${transactionDetails}</p><p>Best regards, <br>The Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionFailureEmail(userEmail, transactionDetails) {
    const subject = 'Transaction Failure Notification';
    const text = `Hello, \n\nA transaction attempt has failed on your account. Here are the details:\n\n${transactionDetails}\n\nPlease check your account and try again.\n\nBest regards, \nThe Vault Ledger Team`;
    const html = `<p>Hello,</p><p>A transaction attempt has failed on your account. Here are the details:</p><p>${transactionDetails}</p><p>Best regards, <br>The Vault Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};