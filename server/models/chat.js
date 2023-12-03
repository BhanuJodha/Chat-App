const mongoose = require("mongoose");

const chat = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    totalMessages: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: "NOT_ASSIGN",
        enum: {
            values: ['NOT_ASSIGN', 'ASSIGN', 'CLOSING', 'CLOSED'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    hostId: {
        type: mongoose.Types.ObjectId,
        ref: "Host"
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    autoCreate: true,
})

// compound
chat.index({userId: "hashed", status: "hashed", createdAt: -1});
chat.index({hostId: "hashed", status: "hashed", createdAt: -1});
chat.index({status: "hashed", createdAt: 1});

module.exports = mongoose.model("Chat", chat);