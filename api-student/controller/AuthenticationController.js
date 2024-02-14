require("dotenv").config();
let helper = require("../config/helper");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_TOKEN = process.env.JWT_SECRET;
const User = db.student;
const JWT_TOKEN_TIME = process.env.JWT_TOKEN_TIME;
const path = require('path');

const OTP_EXPIRY_DURATION = 15 * 60 * 1000;

module.exports = {

    //create a new users
    signUp: async (req, res) => {
        try {
            let email = await User.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (email) {
                return helper.error(
                    res,
                    "Account already registered"
                );
            }

            let salt = 10;
            await bcrypt.hash(req.body.password, salt).then(function (hash) {
                req.body.password = hash;
            });

            let user = await User.create(req.body);
            console.log(JWT_TOKEN, "JWT_TOKENJWT_TOKEN");

            if (user) {
                let accessToken = jwt.sign(
                    {
                        data: {
                            id: user.id,
                            email: user.email,
                        },
                    },
                    JWT_TOKEN,
                    {
                        expiresIn: "6000s",
                    }
                );
                var body = {
                    token: accessToken,
                    expires_in: JWT_TOKEN_TIME,
                };

                return helper.success(res, "User registered successfully", body);
            } else {
                return helper.error("Some error occur, Please try again");
            }
        } catch (err) {
            console.error(err);
            return helper.error("Some error occur, Please try again");
        }
    },

    // login user
    logIn: async (req, res) => {
        try {
            var user = await User.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (!user) {
                return helper.error(res, "This email is not associated with a user");
            }
            await bcrypt
                .compare(req.body.password, user.password)
                .then(async function (result) {
                    if (result == true) {
                        let accessToken = jwt.sign(
                            {
                                data: {
                                    id: user.id,
                                    email: user.email,
                                },
                            },
                            JWT_TOKEN,
                            {
                                expiresIn: "6000s",
                            }
                        );
                        var body = {
                            token: accessToken,
                            expires_in: "1d",
                        };
                        return helper.success(res, "User log in successfully", body);
                    } else {
                        return helper.error(res, "Password do not match");
                    }
                });
        } catch (err) {
            return helper.error(res, "server error: ");
        }
    },
 

};


