const mongoose = require("mongoose");

const host = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "User"
    },
    active: {
        type: Number,
        default: 0,
        index: 1
    },
    closed: {
        type: Number,
        default: 0,
        index: 1
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    autoCreate: true,
})

module.exports = mongoose.model("Host", host);