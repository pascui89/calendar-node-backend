const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const login = async (req = request, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne ({ email });
        if (!user) {
            return res.status(400).json({
                result: false,
                message: 'The user does not exist'
            });
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                result: false,
                message: 'The password is incorrect'
            });
        }
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            result: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (err) {
        res.status(500).json({
            result: false,
            message: 'An error occurred while logging the user',
        });
        console.error(err);
    };
}

const createUser = async (req = request, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne ({ email });
        if (user) {
            return res.status(400).json({
                result: false,
                message: 'The user already exists'
            });
        }
        user = new User(req.body);
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            result: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (err) {
        res.status(500).json({
            result: false,
            message: 'An error occurred while creating the user',
        });
        console.error(err);
    };
}

const renewToken = async (req = request, res = response) => {
    const { uid, name } = req;
    const token = await generateJWT(uid, name);
    res.json({
        result: true,
        message: '/renew',
        token
    })
}

module.exports = {
    login,
    createUser,
    renewToken
}