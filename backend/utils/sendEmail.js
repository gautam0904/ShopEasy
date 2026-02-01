import Mailjet from 'node-mailjet';

export const sendEmail = async (options) => {
    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE
    );

    const request = await mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: process.env.MJ_SENDER_EMAIL,
                        Name: process.env.MJ_SENDER_NAME || 'ShopEasy'
                    },
                    To: [
                        {
                            Email: options.email
                        }
                    ],
                    Subject: options.subject,
                    TextPart: options.message
                }
            ]
        });

    return request.body;
};