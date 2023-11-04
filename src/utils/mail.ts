import sgMail from '@sendgrid/mail';

// const sgMail = require('@sendgrid/mail');

const sendMail = async (address: string, content: string) => {
    try {
        const key = process.env.SEND_GRID_KEY || '';
        if (!key) return;

        sgMail.setApiKey(key);

        const msg = {
            to: address, // Change to your recipient
            from: 'kanghanstar@outlook.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: content,
            html: `<strong>and easy to do anywhere, even with Node.js</strong><a href="${content}" >인증하기 : ${content}</a>`,
        };
        const response = await sgMail.send(msg);
        console.log('response = ', response);
        // .then((response) => {
        //     console.log(response[0].statusCode);
        //     console.log(response[0].headers);
        // })
        // .catch((error) => {
        //     console.error(error);
        // });
    } catch (error) {
        console.error(error);
    }
};

export { sendMail };
