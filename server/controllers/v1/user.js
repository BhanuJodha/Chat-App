const { sign } = require("jsonwebtoken");
const User = require("../../models/user");
const moment = require("moment");

exports.createUser = async (req, res) => {

    const {email, phone, name} = req.body;
    
    try {
        const check = await User.findOne({ email: email });
        if (check) {
            return res.status(200).json({
                "success": true,
                "message": "User already exist!",
                "data": check
            })
        }

        const user = await User.create({
            name: name?.trim(),
            phone,
            email,
            role: "CUSTOMER"
        })

        res.status(201).json({
            "success": true,
            "message": "User created successfully",
            "data": user.toJSON()
        })

    } catch (err) {
        res.status(400).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}

exports.getToken = async (req, res) => {

    const {email} = req.query;

    try {
        const user = await User.findOne({email: email});

        if (user) {
            return res.status(200).json({
                "success": true,
                "message": "Sign in successful, here is your token, please keep it safe!",
                "data": {
                    bearer: sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '2h'}),
                    expiresAt: moment().add(2, "h")
                }
            })
        }

        res.status(401).json({
            "success": false,
            "message": "Invalid email!",
            "data": {
                url: "/api/v1/user",
                methord: "POST"
            }
        })

    } catch (err) {
        res.status(400).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}