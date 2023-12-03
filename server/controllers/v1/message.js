const Message = require("../../models/message")
const Chat = require("../../models/chat")

exports.newMessage = async (req, newMessage, chatId) => {
    try {
        let chat
        if (req.user.role === "CUSTOMER") {

            // there was an index on createdAt : -1
            chat = await Chat.findOne({
                userId: req.user.id,
                status: {
                    $in: ['ASSIGN', 'CLOSING']
                }
            })
        }
        else {
            chat = await Chat.findOne({
                _id: chatId,
                status: {
                    $in: ['ASSIGN', 'CLOSING']
                }
            })
        }

        if (!chat) {
            return {
                "success": false,
                "message": "No active chat session found",
                "data": null
            }
        }

        // deciding the sender and reciver
        const obj = {}
        if (chat.userId == req.user.id) {
            obj.reciver = chat.hostId;
            obj.reciverType = "Host"
            obj.sender = chat.userId;
            obj.senderType = "User";
        }
        else {
            obj.reciver = chat.userId;
            obj.reciverType = "User";
            obj.sender = chat.hostId;
            obj.senderType = "Host"
        }

        const message = await Message.create({
            chatId: chat.id,
            hostId: chat.id,
            message: newMessage,
            ...obj
        })

        await Chat.findOneAndUpdate({ _id: chat.id }, { $inc: { "totalMessages": 1 } });

        return {
            success: true,
            data: message
        }

    } catch (err) {
        console.error(err)
        return {
            success: false,
            data: null
        }
    }
}


exports.getMessage = async (req, res) => {

    let { limit, offset, chatId } = req.query
    offset ??= 0;
    offset = offset < 0 ? 0 : offset
    limit ??= 10;
    limit = limit > 50 ? 50 : limit

    try {
        // there is already -1 index on createdAt
        const messages = await Message.find({ chatId }, {}, { limit, skip: offset, lean: true })
        const total = await Message.countDocuments({ chatId })

        res.status(200).json({
            "success": true,
            "message": "Total messages are " + total,
            "data": messages
        })

    } catch (err) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "data": null
        })
    }
}