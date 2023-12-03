const Chat = require("../../models/chat");
const Host = require("../../models/host");

exports.createChat = async (req, res) => {

    if (req.user.role != "CUSTOMER")
        return res.status(403).json({
            "success": false,
            "message": "Unauthorized",
            "data": null
        })

    try {
        const check = await Chat.findOne({ userId: req.user.id, status: {$ne: "CLOSED"} });
        if (check) {
            return res.status(200).json({
                "success": true,
                "message": "Chat found",
                "data": check
            })
        }

        const chat = await Chat.create({
            userId: req.user.id
        })

        res.status(201).json({
            "success": true,
            "message": "Chat created successfully",
            "data": chat.toJSON()
        })

    } catch (err) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}

exports.getPendingChats = async (req, res) => {

    if (req.user.role != "HOST")
        return res.status(403).json({
            "success": false,
            "message": "Unauthorized",
            "data": null
        })

    let { limit, offset } = req.query
    offset ??= 0;
    offset = offset < 0 ? 0 : offset
    limit ??= 10;
    limit = limit > 50 ? 50 : limit

    try {

        const chats = await Chat.find({ status: "NOT_ASSIGN" }, {}, { limit, skip: offset, lean: true })
        const total = await Chat.countDocuments({ status: "NOT_ASSIGN" })

        res.status(200).json({
            "success": true,
            "message": "Total chats are " + total,
            "data": chats
        })

    } catch (err) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}

exports.closeChat = async (req, res) => {

    const { chatId } = req.query

    try {
        const check = await Chat.findOne({ _id: chatId });
        if (check.status === "CLOSED") {
            return res.status(400).json({
                "success": false,
                "message": "Chat is already closed",
                "data": check
            })
        }

        const chat = await Chat.findOneAndUpdate({ _id: chatId }, { $set: { status: "CLOSED" } });
        chat.hostId && await Host.updateOne({ userId: chat.hostId }, { $inc: { active: -1, closed: 1 } });

        res.status(200).json({
            "success": true,
            "message": "Chat closed successfully",
            "data": chat
        })

    } catch (err) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}