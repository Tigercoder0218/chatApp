const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: Array,
    messages: [
        {
            text: String,
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model("chats", chatSchema);
