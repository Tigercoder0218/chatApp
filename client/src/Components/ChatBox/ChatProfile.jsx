import "./ChatProfile.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { HiOutlineChevronLeft } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { MdContentCopy } from "react-icons/md";

const ChatProfile = () => {
    const [userProfile, setUserProfile] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const AvatarRef = useRef();

    useEffect(() => {
        setUserProfile(location.state.contactInfo);
        AvatarRef.current.innerHTML = location.state.contactInfo.avatarImg;
    }, [location.state.contactInfo])

    const CopyUserID = () => {
        navigator.clipboard.writeText(userProfile._id);
        toast.success("Copied to clipboard", { position: "top-right" });
    }

    return (
        <div className="ChatProfile-Main">
            <div className="ChatProfile-Header flex">
                <div className="ChatProfile-BackBtn flex" onClick={() => navigate(-1)}>
                    <HiOutlineChevronLeft size={25} color="var(--grey)" />
                </div>
                <h2>User Profile</h2>
            </div>

            <div className="ChatProfile-Body">
                <div className="ChatProfile-UserInfo flex">
                    <div className="ChatProfile-Avatar" ref={AvatarRef}>
                        <BiUser size={35} color="var(--white)" />
                    </div>
                    <div className="ChatProfile-Info flex col gap-05">
                        <h1>{userProfile.username}</h1>
                        <p onClick={CopyUserID}>
                            <MdContentCopy size={20} color="var(--white)" />
                            {userProfile._id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatProfile