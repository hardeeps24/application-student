// const bcrypt = require('bcrypt');
const db = require('../models');
// const sequelize = require('sequelize');
// const config = require('./config');
// const path = require('path');
// var uuid = require('uuid');
var randomstring = require("randomstring");
// const cryptLib = require('@skavinvarnan/cryptlib');

const KEY = process.env.ENCRYPTION || "";


module.exports = {
    validateObject: async (required, non_required) => {
        let message = '';
        let empty = [];

        let model = required.hasOwnProperty('model') && db.hasOwnProperty(required.model) ? db[required.model] : db.users;

        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] === '' && (required[key] !== '0' || required[key] !== 0)) {
                    empty.push(key);
                }
            }
        }


        if (empty.length != 0) {
            message = empty.toString();
            if (empty.length > 1) {
                message += " fields are required"
            } else {
                message += " field is required"
            }
            throw {
                'code': 400,
                'message': message
            }
        } else {
            if (required.hasOwnProperty('securitykey')) {
                if (required.securitykey != "ads") {
                    message = "Invalid security key";
                    throw {
                        'code': 400,
                        'message': message
                    }
                }
            }
            // if (required.hasOwnProperty('password')) {
            //     required.password = module.exports.createSHA1Hash(required.password);
            // }

            if (required.hasOwnProperty('checkExists') && required.checkExists == 1) {
                const checkData = {
                    email: 'Email already exists, kindly use another.',
                    phone: 'Phone number already exists, kindly use another'
                }

                for (let key in checkData) {
                    if (required.hasOwnProperty(key)) {
                        const checkExists = await model.findOne({
                            where: {
                                [key]: required[key].trim()
                            }
                        });
                        if (checkExists) {
                            throw {
                                code: 400,
                                message: checkData[key]
                            }
                        }
                    }
                }
            }

            const merge_object = Object.assign(required, non_required);
            delete merge_object.checkexit;
            delete merge_object.securitykey;

            if (merge_object.hasOwnProperty('password') && merge_object.password == '') {
                delete merge_object.password;
            }

            for (let data in merge_object) {
                if (merge_object[data] == undefined) {
                    delete merge_object[data];
                } else {
                    if (typeof merge_object[data] == 'string') {
                        merge_object[data] = merge_object[data].trim();
                    }
                }
            }

            return merge_object;
        }
    },

    unauth: function (res, err, body = {}) {
        console.log(err, '===========================>error');
        let code = (typeof err === 'object') ? (err.code) ? err.code : 401 : 401;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        res.status(code).json({
            'success': false,
            'code': code,
            'message': message,
            'body': body
        });

    },

    success: function (res, message = '', body = {}) {
       
        return res.status(200).json({
            'success': true,
            'code': 200,
            'message': message,
            'body': body
        });
    },

    error: function (res, err, body = {}) {
        console.log(err, '===========================>error');
        let code = (typeof err === 'object') ? (err.code) ? err.code : 200 : 400;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        res.status(200).json({
            'success': false,
            'code': code,
            'message': message,
            'body': body
        });
    },
  

    fileUpload: (file, parentFolder = '') => {
        let file_name_string  = file.name;
        var file_name_array = file_name_string.split(".");
        var file_extension = file_name_array[file_name_array.length - 1];
        var result="";
        result = Math.floor(Date.now() / 1000)
        let name = result+'.'+file_extension;
        file.mv(process.cwd()+`/../public/images/${name}`, function(err) {
            if (err) throw err;
        });
        return name;
    },

    multipleFileUpload: (files, parentFolder = '') => {
        let names = [];
        attachment = files;
        console.log(" attachment.length  ", attachment.length);
        if (attachment.length > 1) {
            attachment.forEach(file => {
                let file_name_string = file.name;
                var file_name_array = file_name_string.split(".");
                var file_extension = file_name_array[file_name_array.length - 1];
                var result = "";
                result = randomstring.generate(15);
                let name = result + '.' + file_extension;
                file.mv(process.cwd() + `/../public/images/${name}`, function (err) {
                    if (err) throw err;
                });
                names.push(name);
            });
        } else {
            let file_name_string = attachment.name;
            var file_name_array = file_name_string.split(".");
            var file_extension = file_name_array[file_name_array.length - 1];
            var result = "";
            result = randomstring.generate(15);
            let name = result + '.' + file_extension;
            attachment.mv(process.cwd() + `/../public/images/${name}`, function (err) {
                if (err) throw err;
            });
            names.push(name);
        }
        return names;
    },
}
