const ChatModel = require('../Model/ChatModel');
const UserModel = require('../Model/UserModel');

exports.SendChat = async (req, res) => {
    const { msg, from, to } = req.body;
    try {
        const GetChats = await ChatModel.find({ users: { $all: [from, to] } });

        //IF Other User has not added your contact
        const OtherUser = await UserModel.findById(to);
        if (!OtherUser.contacts.includes(from)) {
            await UserModel.findByIdAndUpdate(to, { $push: { contacts: { cid: from } } });
            console.log("OtherUser Contact Added");
        }

        if (GetChats.length > 0) {
            const newMsg = {
                text: msg,
                sender: from,
            }
            await ChatModel.findOneAndUpdate({ users: { $all: [from, to] } }, { $push: { messages: newMsg } });
            console.log("Message Sent to Chat");
            res.send({ status: true });
        } else {
            const newChat = await ChatModel.create({
                users: [from, to],
                messages: {
                    sender: from,
                    text: msg
                },
            });
            console.log("New Chat Created")
            res.send({ status: true });
        }
    } catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.GetChats = async (req, res) => {
    const { from, to } = req.body;
    try {
        const [GetChats] = await ChatModel.find({ users: { $all: [from, to] } });
        res.send({ status: true, GetChats });
    } catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.UpdateChat = async (req, res) => {
    const { userID, contactID, lastMsg, lastMsgTime } = req.body;
    try {
        const updateContact = await UserModel.findOneAndUpdate({ _id: userID, "contacts.cid": contactID }, { $set: { "contacts.$.lastMsg": lastMsg, "contacts.$.lastMsgTime": lastMsgTime } });
        res.send({ status: true });
    } catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

// exports.UpdateAll = async (req, res) => {
//     const { cid, lastMsg, lastMsgTime } = req.body;
//     console.log(cid, lastMsg, lastMsgTime);
//     try {
//         const allUsers = await UserModel.find().select('contacts');
//         allUsers.forEach(async (user) => {
//             const updateContact = await UserModel.findOneAndUpdate({ _id: user._id }, { $push: { contacts: { cid: cid, lastMsg: lastMsg, lastMsgTime: lastMsgTime } } });
//             // console.log(updateContact);
//         });

//         res.send({ status: true, allUsers });
//     } catch (err) {
//         console.log(err);
//         res.send({ status: false, err });
//     }
// }