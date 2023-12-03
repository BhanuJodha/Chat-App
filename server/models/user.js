const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        index: "text"
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                let re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                return (!v || !v.trim().length) || re.test(v)
            },
            message: 'Provided email is invalid.'
        },
        unique: true
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                let re = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
                return (!v || !v.trim().length) || re.test(v)
            },
            message: 'Provided phone number is invalid.'
        }
    },
    role: {
        type: String,
        enum: {
            values: ["CUSTOMER", "HOST", "ADMIN"],
            message: "Invalid `{VALUE}` for `{PATH}`"
        },
        require: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    autoCreate: true
})

user.index({email: "hashed"}, {unique: true})

module.exports = mongoose.model("User", user);