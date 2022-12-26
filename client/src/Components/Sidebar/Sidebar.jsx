import "./Sidebar.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ChatList from "../Chatlist/ChatList"
import { useContextData } from "../../hooks/useContextData";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import { XreconText, Xrecon } from "../../Assets";
import { MdSearch, MdOutlineSettings } from "react-icons/md"
import { FiLogOut } from "react-icons/fi"
import { TbUserPlus } from "react-icons/tb"
import { GoSync } from "react-icons/go";
import { BiUser } from "react-icons/bi"

export default function Sidebar() {
    const [loading, setLoading] = useState(false);
    // const [contacts, setContacts] = useState([]);
    const AvatarRef = useRef();
    const SidbarRef = useRef();
    const SyncRef = useRef();

    const { user, setOnLogout, socket, forceUpdate, contacts, setContacts } = useContextData();
    const navigate = useNavigate();

    useEffect(() => {
        // console.time("Local");
        let localContacts = JSON.parse(localStorage.getItem('xrecon-user-contacts'));
        if (localContacts) {
            // console.log("Local Contacts", localContacts);
            setContacts(localContacts);
        } else {
            FetchContacts(user.uid);
        }
        // console.timeEnd("Local");
    }, [user, forceUpdate])

    const FetchContacts = async (uid) => {
        // console.time("Server");
        setLoading(true);
        try {
            const result = await axios.post("/api/getContacts", { userID: uid });
            if (result.data.status) {
                setContacts(result.data.ContactData);
                localStorage.setItem('xrecon-user-contacts', JSON.stringify(result.data.ContactData));
                // console.log("Fetch Contacts", result.data.ContactData);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
        // console.timeEnd("Server");
    }

    useEffect(() => {
        if (user) {
            socket.current = io(axios.defaults.baseURL, { transports: ['websocket', 'polling', 'flashsocket'] });
            socket.current.emit("addUser", user.uid);

            AvatarRef.current.innerHTML = user.avatarImg;
        }
    }, [user, socket])

    const openChat = (obj) => {
        navigate(`/chat/${obj.username}`, { state: { data: obj } });
    }

    const HandleChatSearch = (e) => {
        let searchValue = e.target.value.toLowerCase();
        searchValue.length !== 0 ? setContacts(prev => prev.filter((obj) => {
            return obj.username.toLowerCase().includes(searchValue);
        })) : FetchContacts(user.uid);
    }

    const CopyUserID = () => {
        navigator.clipboard.writeText(user.uid);
        toast.success("Copied to clipboard", { position: "top-right" });
    }

    const RefreshContacts = () => {
        FetchContacts(user.uid);
        SyncRef.current.children[0].classList.add("SyncActive");
        setTimeout(() => {
            SyncRef.current.children[0].classList.remove("SyncActive");
        }, 400);
    }

    return (
        <div className='Sidebar-Main flex col' ref={SidbarRef}>
            <div className="Sidebar-header flex col">
                <div className="Sidebar-Title flex">
                    <Link to="/" className="flex">
                        <img src={XreconText} alt="Xrecon Logo" width="auto" height={40} />
                        {/* <h1 className="webTitle" style={{ fontSize: "30px" }}>Recon</h1> */}
                    </Link>

                    <div className="flex gap-1">
                        <div className="Sidebar-Options flex" onClick={() => { navigate("/connect") }}>
                            <TbUserPlus size={30} color="inherit" />
                        </div>
                        <div className="Sidebar-Options flex" onClick={() => { navigate("/settings") }}>
                            <MdOutlineSettings size={30} color="inherit" />
                        </div>
                    </div>
                </div>

                <div className="Sidebar-search flex">
                    <div className="Sidebar-input flex">
                        <MdSearch size={30} color="var(--grey)" />
                        <input type="text" placeholder="Search Chat" onChange={HandleChatSearch} />
                    </div>

                    <div className="Sidebar-Refresh" onClick={RefreshContacts} ref={SyncRef}>
                        <GoSync size={25} color="var(--inherit)" title="Refresh Contacts" />
                    </div>

                    {/* <FiFilter size={30} color="var(--grey)" title="Filter Unread" /> */}
                </div>
            </div>

            <div className="Sidebar-ChatlistContainer">
                {!loading ?
                    <div className="Sidebar-chatList">
                        {contacts?.length !== 0 ? contacts?.map((obj) => {
                            return <div className="Sidebar-ChatItem" key={obj._id} onClick={() => { openChat(obj) }}>
                                <ChatList data={obj} />
                            </div>
                        })
                            : <p>No Contacts found.</p>}
                    </div>
                    :
                    <div className="Sidebar-Loader flex">
                        <img src={Xrecon} alt="loader" width={50} height={50} />
                    </div>
                }
            </div>

            <div className="Sidebar-Nav">
                <div className="flex gap-1">
                    <div className="Sidebar-avatar flex" ref={AvatarRef}>
                        <BiUser size={80} color="var{--white}" />
                    </div>

                    <div className="Sidebar-UserInfo">
                        <h3>{user?.username}</h3>
                        <p onClick={CopyUserID}>Copy UserID</p>
                    </div>
                </div>

                <div className="Sidebar-Logout flex" onClick={() => setOnLogout(true)} title="Logout">
                    <FiLogOut size={25} color="var(--white)" />
                </div>
            </div>
        </div>
    )
}