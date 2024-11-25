const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(options) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: options.to,
                subject: options.subject,
                html: this.getEmailTemplate(options.content)
            };

            if (options.attachments) {
                mailOptions.attachments = options.attachments;
            }

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email envoyé:', info.messageId);
            return info;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            throw new Error('Erreur lors de l\'envoi de l\'email');
        }
    }

    getEmailTemplate(content) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4A90E2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                    .button { display: inline-block; padding: 10px 20px; background: #4A90E2; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>OVPR</h1>
                    </div>
                    <div class="content">
                        ${content}
                    </div>
                    <div class="footer">
                        <p>OVPR - Objets Volés, Perdus, Retrouvés</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async sendVerificationEmail(user, verificationToken) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const content = `
            <h2>Bienvenue sur OVPR</h2>
            <p>Bonjour ${user.firstName},</p>
            <p>Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            <a href="${verificationUrl}" class="button">Vérifier mon email</a>
            <p>Ce lien est valable pendant 24 heures.</p>
            <p>Si le bouton ne fonctionne pas, copiez ce lien : ${verificationUrl}</p>
        `;

        await this.sendEmail({
            to: user.email,
            subject: 'Vérification de votre compte OVPR',
            content
        });
    }

    async sendPasswordResetEmail(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const content = `
            <h2>Réinitialisation de mot de passe</h2>
            <p>Bonjour ${user.firstName},</p>
            <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            <p>Ce lien est valable pendant 1 heure.</p>
            <p>Si le bouton ne fonctionne pas, copiez ce lien : ${resetUrl}</p>
        `;

        await this.sendEmail({
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe OVPR',
            content
        });
    }

    async sendMatchNotification(user, item) {
        const itemUrl = `${process.env.FRONTEND_URL}/items/${item._id}`;
        const content = `
            <h2>Un objet correspondant a été trouvé !</h2>
            <p>Bonjour ${user.firstName},</p>
            <p>Un objet correspondant à votre recherche a été trouvé :</p>
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                <h3>${item.title}</h3>
                <p><strong>Catégorie :</strong> ${item.category}</p>
                <p><strong>Lieu :</strong> ${item.location}</p>
                <p><strong>Date :</strong> ${new Date(item.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <a href="${itemUrl}" class="button">Voir l'objet</a>
        `;

        await this.sendEmail({
            to: user.email,
            subject: 'Un objet correspondant a été trouvé - OVPR',
            content
        });
    }

    async sendContactNotification(user, contactUser, item) {
        const itemUrl = `${process.env.FRONTEND_URL}/items/${item._id}`;
        const content = `
            <h2>Nouvelle demande de contact</h2>
            <p>Bonjour ${user.firstName},</p>
            <p>${contactUser.firstName} ${contactUser.lastName} souhaite vous contacter à propos de votre objet "${item.title}".</p>
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                <p><strong>Message :</strong> ${contactUser.message}</p>
                <p><strong>Email :</strong> ${contactUser.email}</p>
                ${contactUser.phoneNumber ? `<p><strong>Téléphone :</strong> ${contactUser.phoneNumber}</p>` : ''}
            </div>
            <a href="${itemUrl}" class="button">Voir l'objet</a>
        `;

        await this.sendEmail({
            to: user.email,
            subject: 'Nouvelle demande de contact - OVPR',
            content
        });
    }
}

module.exports = new EmailService();
