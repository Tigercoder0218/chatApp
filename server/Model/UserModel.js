const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    avatarImg: {
        type: String,
        default: "",
    },
    contacts: [{
        cid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        lastMsg: {
            type: String,
            default: "Click to start a conversation",
        },
        lastMsgTime: {
            type: String,
            default: "",
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model("Users", userSchema);
