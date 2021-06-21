const User = require('../models/user');
const errorResponse = require('../lib/responses/errorResponse');
const successResponse = require('../lib/responses/successResponse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { request } = require('express');

module.exports = {
    register: async (req, res) => {
        try {
            let user = await User.findOne( { email: req.body.email });

        if(user) {
            return errorResponse(res, 400, new Error('Email is already registered!'));
        }

        if(!req.body.password || req.body.password != req.body.repeat_password) {
            return errorResponse(res, 400, new Error('Password field is empty or Password does not match the repeat password'));
        }

        req.body.password = bcrypt.hashSync(req.body.password);
        user = await User.create(req.body);

        successResponse(res, 'You have successfully registered!');
        } catch (error) {
            errorResponse(res, 500, error);
        }
        

    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });

        if(!user) {
            errorResponse(res, 400, new Error('Email is not registered!'))
        }

        if(!bcrypt.compareSync(req.body.password, user.password)) {
            errorResponse(res, 400, new Error('Invalid password'));
        }

        const payload = {
            id: user._id,
            email: user.email
        }

        const token = jwt.sign(payload, process.env.AUTH_SECRET_KEY, {
            expiresIn: '60m'
        })

        res.cookie('token', token, { httpOnly: true });
        
        successResponse(res, 'JWT successfully generated', token);
        } catch (error) {
            errorResponse(res, 500, error);
        }
        

    },
    logout: (req, res) => {
        try {
            res.cookie('token', '', { maxAge: 1 });
            successResponse(res, 'Logged out');
        } catch (error) {
           errorResponse(res, 500, error);
        }
    },
}