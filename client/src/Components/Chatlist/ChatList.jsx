import './Chatlist.css';
import { useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md"
import { BiUser } from "react-icons/bi"

const ChatList = ({ data }) => {
    const { username, avatarImg } = data;
    const AvatarRef = useRef();

    useEffect(() => {
        AvatarRef.current.innerHTML = avatarImg;
    }, [avatarImg])

    return (
        <div className='Chatlist-Main'>
            <div className="Chatlist-avatar flex" ref={AvatarRef}>
                <BiUser size={30} color="var(--white)" />
            </div>

            <div className="Chatlist-info flex col">
                <div className="Chatlist-userinfo">
                    <span>{username}</span>
                    <p>11/11/2022</p>
                </div>
                <div className="Chatlist-prevMsg">
                    <span>He Said Yo bro!</span>
                    <MdKeyboardArrowDown size={30} color="var(--grey)" />
                </div>
            </div>
        </div>
    )
}

export default ChatList;
