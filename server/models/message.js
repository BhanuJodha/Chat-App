const mongoose = require("mongoose");

const message = new mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Chat"
    },
    message: {
        type: String,
        required: true
    },
    hostId: {
        type: mongoose.Types.ObjectId,
        ref: "Host",
        required: true
    },
    senderType: {
        type: String,
        enum: {
            values: ["User", "Host"],
            message: "enum validator failed for path `{PATH}` with value `{VALUE}`"
        },
        require: true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciverType: {
        type: String,
        enum: {
            values: ["User", "Host"],
            message: "enum validator failed for path `{PATH}` with value `{VALUE}`"
        },
        require: true
    },
    reciver: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: {
        createdAt: true
    },
    autoCreate: true,
})

message.index({chatId: "hashed", createdAt: "descending"});

module.exports = mongoose.model("Message", message);