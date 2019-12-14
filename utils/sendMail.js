
    //const config = require('../config');
module.exports = async function(email, subject, message) {
        let nodemailer = require('nodemailer');
        const mailTransport = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: "test@pneumax.ru",
                pass: "1qaz2wsx1qaz"
            }
        });

        var result = '';



        /*await mailTransport.verify(async function(error, success) { Проверка доступносте почтового сервиса
            if (await error) {
                result='Error'
            }
            if (await success) {
                result='Succes';
               }
        })*/



        await mailTransport.sendMail({
            from: 'test@pneumax.ru',
            to: email,
            subject: subject,
            text: message
        }).then(info => {result={'status': 'Ok',
                                 'response': info.response}})
          .catch(err => {result={'error': err.response,
                                 'status': 'Error'  }});
        return(result);
};

