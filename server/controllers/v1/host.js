const Host = require("../../models/host");
const Chat = require("../../models/chat");
const User = require("../../models/user");

exports.makeHost = async (req, res) => {

    const { email } = req.body;

    if (req.user.role != "ADMIN")
        return res.status(403).json({
            "success": false,
            "message": "Unauthorized",
            "data": null
        })

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                "success": false,
                "message": "User not found",
                "data": null
            })
        }

        const host = await Host.create({
            userId: user.id
        });

        await User.updateOne({ email: user.email }, { $set: { "role": "HOST" } });

        res.status(201).json({
            "success": true,
            "message": "Host created successfully",
            "data": host.toJSON()
        })

    } catch (err) {
        res.status(400).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}

exports.assignHost = async (req, res) => {

    const { chatId } = req.params;

    if (req.user.role != "HOST")
        return res.status(403).json({
            "success": false,
            "message": "Unauthorized",
            "data": null
        })

    try {

        const check = await Chat.findOne({ _id: chatId });
        if (!check) {
            return res.status(400).json({
                "success": false,
                "message": "Invalid chatId",
                "data": null
            })
        }
        if (check.status === "CLOSED") {
            return res.status(403).json({
                "success": false,
                "message": "Chat is closed",
                "data": check
            })
        }
        if (check.hostId) {
            return res.status(400).json({
                "success": false,
                "message": "Host already assigned",
                "data": check
            })
        }

        await Chat.updateOne({
            _id: chatId
        }, { $set: { hostId: req.user.id, status: "ASSIGN" } })

        await Host.updateOne({
            userId: req.user.id,
        }, { $inc: { active: 1 } })

        res.status(200).json({
            "success": true,
            "message": "User assign successfully",
            "data": req.user
        })

    } catch (err) {
        res.status(400).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}

exports.myStats = async (req, res) => {

    if (req.user.role != "HOST")
        return res.status(403).json({
            "success": false,
            "message": "Unauthorized",
            "data": null
        })

    try {
        const host = await Host.find({userId: req.user.id})

        res.status(200).json({
            "success": true,
            "message": "Host fetch successfully",
            "data": host
        })

    } catch (err) {
        res.status(400).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}