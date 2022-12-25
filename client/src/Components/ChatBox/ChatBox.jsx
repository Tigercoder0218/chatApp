import "./ChatBox.css";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useContextData } from "../../hooks/useContextData";
import ChatBlob from "./ChatBlob";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { MdSearch, MdDelete, MdContentCopy } from "react-icons/md"
import { HiOutlineChevronLeft } from "react-icons/hi"
import { BiSend, BiUser } from "react-icons/bi"
import { FaSmileWink } from "react-icons/fa"
import { TbDotsVertical } from "react-icons/tb"
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { Xrecon } from "../../Assets";

const ChatBox = () => {
    const [toggleEmoji, setToggleEmoji] = useState(false);
    const [contactInfo, setContactInfo] = useState({});
    const [initialChat, setInitialChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [deleteMenu, setDeleteMenu] = useState(false);

    const { user, setUser, socket } = useContextData();
    const location = useLocation();

    const MsgInputRef = useRef();
    const ContactAvatarRef = useRef();
    const ChatBodyRef = useRef();
    const navigate = useNavigate();

    let isMobile = window.innerWidth <= 750 ? true : false;
    // let devHeight = window.innerHeight;

    useEffect(() => {
        if (location.state) {
            setContactInfo(location.state.data);
            ContactAvatarRef.current.innerHTML = location.state.data.avatarImg;
        }

        const GetChats = async () => {
            setMessages([]);
            const result = await axios.post("/api/chat/getChat", {
                from: user.uid,
                to: location.state.data._id
            });
            result.data.status && setInitialChat(true);

            if (result.data.GetChats) {
                const msgList = result.data?.GetChats?.messages;
                setMessages(msgList);
            }

        }

        if (!initialChat) {
            GetChats();
        }

        setDeleteMenu(false);
    }, [location.state, user.uid, initialChat])

    useEffect(() => {
        socket.current.on("getMessage", (data) => {
            setMessages([...messages, data]);
        })

        ChatBodyRef.current.scrollTop = ChatBodyRef.current.scrollHeight;
    }, [socket, messages])

    useEffect(() => {
        if (contactInfo._id !== location.state.data._id) {
            setInitialChat(false);
            setMessages([]);
        }
    }, [location.state.data._id, contactInfo._id]);

    const HandleSendChat = async (e) => {
        e.preventDefault();
        let msg = MsgInputRef.current.value;
        if (msg === "") return;
        let time = new Date().toISOString();

        setMessages([...messages, { text: msg, sender: user.uid, createdAt: time }]);
        MsgInputRef.current.value = "";

        try {
            await axios.post("/api/chat/sendChat", {
                msg,
                from: user.uid,
                to: contactInfo._id
            });

            socket.current.emit("sendMessage", {
                to: contactInfo._id,
                from: user.uid,
                text: msg
            });
        } catch (err) {
            console.log(err);
        }
    }

    const AddEmoji = (EmojiClickData) => {
        MsgInputRef.current.value += EmojiClickData.emoji;
    }

    const HandleDeleteContact = async () => {
        try {
            const result = await axios.post("/api/deleteContact", { userID: user.uid, deleteUID: contactInfo._id });
            if (result.data.status) {
                let newContacts = user.contacts.filter(contact => contact !== contactInfo._id);
                setUser({ ...user, contacts: newContacts });

                let localContacts = JSON.parse(localStorage.getItem("xrecon-user-contacts"));
                let newLocalContacts = localContacts.filter(contact => contact.id !== contactInfo._id);
                localStorage.setItem("xrecon-user-contacts", JSON.stringify(newLocalContacts));

                toast.success("Contact Deleted Successfully!");
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!");
        }

        setDeleteMenu(false);
    }

    const CopyUserID = () => {
        navigator.clipboard.writeText(contactInfo._id);
        setDeleteMenu(false);
        toast.success("Copied to clipboard", { position: "top-right" });
    }

    const OpenProfile = () => {
        navigate("profile", { state: { contactInfo } });
    }

    return (
        // <div className="ChatBox-main" style={{ height: `${devHeight}px` }}>
        <div className="ChatBox-main">
            {deleteMenu && <div className="ChatBox-DeleteMenuHolder" onClick={() => setDeleteMenu(false)}>
                <div className="ChatBox-DeleteMenu flex col">
                    <div className="delete flex gap-05" onClick={HandleDeleteContact}>
                        <MdDelete size={25} color="inherit" />
                        <span>Delete Contact</span>
                    </div>
                    <div className="flex gap-05" onClick={CopyUserID}>
                        <MdContentCopy size={20} color="var(--white)" />
                        <span>Copy User ID</span>
                    </div>
                </div>
            </div>}

            <div className="ChatBox-header">
                <div className="ChatBox-BackBtn flex" onClick={() => navigate("/")}>
                    <HiOutlineChevronLeft size={25} color="var(--grey)" />
                </div>

                <div className="ChatBox-userInfo" onClick={OpenProfile}>
                    <div className="ChatBox-avatar flex" ref={ContactAvatarRef}>
                        <BiUser size={35} color="var(--white)" />
                    </div>
                    <div className="ChatBox-info">
                        <span>{contactInfo.username}</span>
                        <p>online</p>
                    </div>
                </div>

                <div className="ChatBox-options flex gap-1">
                    <div className="btn flex">
                        <MdSearch size={25} color="var(--grey)" />
                    </div>

                    <div className="btn flex" onClick={() => setDeleteMenu(prev => !prev)}>
                        <TbDotsVertical size={25} color="var(--grey)" />
                    </div>
                </div>
            </div>

            <div className="ChatBox-Loader flex" style={!initialChat ? { display: "flex" } : { display: "none" }}>
                <img src={Xrecon} alt="loader" width={50} height={50} />
            </div>
            <div className="ChatBox-bodyContainer" style={initialChat ? { display: "flex" } : { display: "none" }} onClick={() => setToggleEmoji(false)}>
                <div className="ChatBox-body" ref={ChatBodyRef}>
                    {messages.map((msg) => {
                        return <ChatBlob key={uuidv4()} msg={msg} />
                    })}
                </div>
            </div>

            <div className="ChatBox-footer">
                {toggleEmoji &&
                    <div className="ChatBox-emojiPicker">
                        <EmojiPicker
                            width="100%"
                            height="350px"
                            emojiStyle={EmojiStyle.NATIVE}
                            previewConfig={{ showPreview: false }}
                            autoFocusSearch={false}
                            lazyLoadEmojis={true}
                            skinTonesDisabled
                            onEmojiClick={AddEmoji} />
                    </div>
                }
                <form onSubmit={HandleSendChat} className="ChatBox-typer flex">
                    <FaSmileWink size={isMobile ? 40 : 30} color="var(--grey)" onClick={() => setToggleEmoji(prev => !prev)} />
                    <div className="ChatBox-input flex">
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="Type a message"
                            ref={MsgInputRef}
                            onFocus={() => setToggleEmoji(false)} />
                    </div>
                    <button type="submit" className="flex" onFocus={() => setToggleEmoji(false)} >
                        <BiSend size={35} color="var(--primary)" />
                    </button>
                </form>
            </div>
        </div >
    )
}

export default ChatBox