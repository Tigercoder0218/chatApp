const ChatModel = require('../Model/ChatModel');
const UserModel = require('../Model/UserModel');

exports.SendChat = async (req, res) => {
    const { msg, from, to } = req.body;
    try {
        const GetChats = await ChatModel.find({ users: { $all: [from, to] } });

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

        //IF Other User has not added your contact
        const OtherUser = await UserModel.findById(to);
        if (!OtherUser.contacts.includes(from)) {
            await UserModel.findByIdAndUpdate(to, { $push: { contacts: from } });
            console.log("OtherUser Contact Added");
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