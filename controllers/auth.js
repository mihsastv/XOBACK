const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/kiss')
const errorHandler = require('../utils/errorHandler')
const msSql = require ('@frangiskos/mssql')
const sendMail = require('../utils/sendMail')


module.exports.login = async function (req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    })
    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            //Пароли совпали генерим токен
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 3600})
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            //пароль не верный
            res.status(401).json({
                message: 'Пароль не правильный'
            })
        }
    }
    else
    {
        res.status(404).json({
            message: 'Пользователь с таким Email не найден'
        })
    }
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // Пользователь существует
        res.status(409).json({
            message: 'Такой Email уже занят'
        })
    } else {
        //Создаем пользователя
        const hash = bcrypt.genSaltSync(10)

        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, hash)
        })
        try {
            await user.save().then(res.status(201).json(user)).catch(err => console.log(err))

        } catch (e) {
            //обработать ошибку
            errorHandler(res, e)
        }
    }
}


module.exports.windowlogin = async function (req, res) {
    const user = req.connection.user;
    await msSql.sql.query('SELECT DomenName FROM portal_sotr WHERE DomenName = @P1', user)
        .then(data => {
            if (data.length !=[]) {
                const token = jwt.sign({
                    account: user
                }, keys.jwt, {expiresIn: 3600})
                res.status(200).json({user,
                    token: `Bearer ${token}`
                })

            } else {
                res.status(404).json({message: 'Пользователь не найден', error: 'NotFound'})
            }
        })
        .catch(error => console.error(error));
}

module.exports.sendmail = function (req, res) {
        new Promise(async function (resolve) {
           var info = await sendMail(req.body.email,req.body.sub,req.body.message);
           resolve(info);
        }).then(function (info) {
            console.log(info)
           if (info.status === 'Ok') {
               res.status(200).json(info)
           } else
           if (info.status === 'Error') {
               res.status(400).json(info)
           }
         });

}
