import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, name: string, verificationCode: string) => {
    await transporter.sendMail({
        from: `"Car Rental" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Welcome to Car Rental!",
        html: `
            <h1>Hi ${name}</h1>
            <p>Thanks for joining Car Rental. We're excited to have you on board.</p>
            <p>Best regards,<br>Car Rental Team</p>
            <p>Verification code: <h3>${verificationCode}</h3></p>
            <p>Click <a href="http://localhost:3000/verify/${verificationCode}">here</a> to verify your email.</p>
        `,
    });
};
