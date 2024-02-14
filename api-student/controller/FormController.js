require("dotenv").config();
const helper = require("../config/helper");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_TOKEN = process.env.JWT_SECRET;

const Form = db.form;
const JWT_TOKEN_TIME = process.env.JWT_TOKEN_TIME;
const path = require('path');
const OTP_EXPIRY_DURATION = 15 * 60 * 1000;

module.exports = {

    // create a new user
    newStudent: async (req, res) => {
        try {
            const { name, email, standard } = req.body;

            // Check if email already exists
            const existedEmail = await Form.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (existedEmail) {
                return helper.error(
                    res,
                    "Account already registered"
                );
            }

            // Validate required fields
            if (!name || !email || !standard) {
                return helper.error(res, 'All fields are required');
            }

            // Create a new student
            const newStudent = await Form.create({
                name,
                email,
                standard,
            });

            return helper.success(res, 'Student data updated successfully', newStudent);
        } catch (err) {
            console.error(err);
            return helper.error(res, 'Error creating a new student');
        }
    },

    // student data list
    studentData: async (req, res) => {
        try {
            // Fetch all students from the database
            const students = await Form.findAll();

            // Send the student data
            return helper.success(res, 'data get successfully', students);
        } catch (error) {
            console.error(error);
            return helper.error(res, "Some  error occurred while fetching student data");
        }
    },
};
