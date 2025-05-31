import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, name: string) => {
    await transporter.sendMail({
        from: `"Car Rental" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Welcome to Car Rental!",
        html: `<h1>Hi ${name},</h1><p>Welcome to our Car Rental Service. We're excited to have you!</p>`,
    });
};
