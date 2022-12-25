import './Chatlist.css';
import { useState, useRef, useEffect } from 'react';
import { useContextData } from "../../hooks/useContextData"
import { MdKeyboardArrowDown } from "react-icons/md"
import { BiUser } from "react-icons/bi"

const ChatList = ({ data }) => {
    const [contactInfo, setContactInfo] = useState([]);
    const [sliceLen, setSliceLen] = useState(0);
    const { username, avatarImg, _id } = data;
    const { user } = useContextData();
    const AvatarRef = useRef();
    const LastMsgRef = useRef();

    useEffect(() => {
        const [Info] = user.contacts.filter(contact => contact.cid === _id);
        setContactInfo(Info);

        AvatarRef.current.innerHTML = avatarImg;
        setSliceLen(LastMsgRef.current.clientWidth / 7.5);
        // console.log(LastMsgRef.current.clientWidth / 7.5)
    }, [avatarImg, user])

    return (
        <div className='Chatlist-Main'>
            <div className="Chatlist-avatar flex" ref={AvatarRef}>
                <BiUser size={30} color="var(--white)" />
            </div>

            <div className="Chatlist-info flex col">
                <div className="Chatlist-userinfo">
                    <span>{username}</span>
                    <p>{contactInfo?.lastMsgTime}</p>
                </div>
                <div className="Chatlist-prevMsg" ref={LastMsgRef}>
                    <span>{contactInfo?.lastMsg?.slice(0, sliceLen)}</span>
                    <div className="Chatlist-opt flex">
                        <MdKeyboardArrowDown size={30} color="var(--grey)" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatList;
