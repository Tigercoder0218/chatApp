const User = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, email, password, avatar } = req.body;

    try {
        const checkEmail = await User.findOne({ email });
        if (checkEmail) return res.status(400).json({ error: 'Email already exists!' });

        const checkUsername = await User.findOne({ username });
        if (checkUsername) return res.status(400).json({ error: 'Username already exists!' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            avatarImg: avatar,
            contacts: [{
                cid: "639a209133c745293b051412",
            }],
        });

        res.send({ status: true });
    } catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const getUser = await User.findOne({ email });
        if (!getUser) return res.status(400).json({ error: 'User does not exist!' });

        const validPassword = await bcrypt.compare(password, getUser.password);
        if (!validPassword) return res.status(400).json({ error: 'Incorrect username or password!' });

        const token = jwt.sign({
            uid: getUser._id,
            username: getUser.username,
            email: getUser.email,
        }, process.env.JWT_SECRET);

        const user = {
            uid: getUser._id,
            username: getUser.username,
            email: getUser.email,
            avatarImg: getUser.avatarImg,
            contacts: getUser.contacts.length > 0 ? getUser.contacts : null,
        }
        res.send({ status: true, user, token });
    } catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.RefreshUser = async (req, res) => {
    const { userID } = req.body;
    try {
        const user = await User.findById(userID).select("-password");
        res.send({ status: true, user });
    }
    catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.findUser = async (req, res) => {
    const { userID } = req.body;
    try {
        const user = await User.findById(userID).select("-password");
        res.send({ status: true, user });
    }
    catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.addUserContacts = async (req, res) => {
    const { userID, contactID } = req.body;

    try {
        const user = await User.findById(userID);
        const contactList = user.contacts;
        // console.log(contactList);
        let contactExists = false;

        contactList.map(async (contact) => {
            if (contact.cid == contactID) {
                contactExists = true;
            }
        });

        if (!contactExists) {
            user.contacts.push({ cid: contactID, lastMsg: "Click to start a conversation", lastMsgTime: "" });
            await user.save();
            console.log('Contact added!');
            return res.send({ status: true });
        } else {
            console.log('Contact already exists!');
            return res.send({ status: false, err: 'Contact already exists!' });
        }
    } catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.getUserContacts = async (req, res) => {
    const { userID } = req.body;

    try {
        const user = await User.findById(userID);
        const contacts = user?.contacts;
        // console.log("contacts", contacts);
        if (!contacts) return res.send({ status: false, err: 'No contacts found!' });

        let contactsArr = contacts.map(contact => contact.cid);
        let ContactData = await User.find({ _id: { $in: contactsArr } }).select('_id username avatarImg');

        res.send({ status: true, ContactData });
    } catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.deleteContact = async (req, res) => {
    const { userID, deleteUID } = req.body;
    console.log(userID, deleteUID);

    try {
        const user = await User.findById(userID);
        user.contacts = user.contacts.filter(contact => contact.cid != deleteUID);
        await user.save();

        console.log('Contact deleted!', user.contacts);
        return res.send({ status: true });
    }
    catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.setUsername = async (req, res) => {
    try {
        const { userID, Username } = req.body;

        const checkUsername = await User.findOne({ username: Username });
        if (checkUsername) return res.status(400).json({ status: false, error: 'Username already exists!' });

        const user = await User.findById(userID);
        user.username = Username;
        await user.save();
        res.send({ status: true });
    }
    catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}

exports.setAvatar = async (req, res) => {
    try {
        const { userID, AvatarImg } = req.body;
        const user = await User.findById(userID);
        user.avatarImg = AvatarImg;
        await user.save();
        res.send({ status: true });
    }
    catch (err) {
        console.log(err);
        res.send({ status: false, err });
    }
}