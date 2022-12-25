import "./AddContact.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContextData } from "../../hooks/useContextData";

import { BiUser, BiUserPlus } from "react-icons/bi";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { MdSearch, MdContentCopy } from "react-icons/md";
import { BsWhatsapp, BsFacebook, BsTwitter } from "react-icons/bs";

const AddContact = () => {
    const [userResult, setUserResult] = useState(null);
    const { user, setForceUpdate, setContacts } = useContextData();
    const navigate = useNavigate();
    const { connectID } = useParams();

    const SearchInputRef = useRef();
    const PulseARef = useRef();
    const PulseBRef = useRef();
    const UserAvatarRef = useRef();

    useEffect(() => {
        if (userResult) {
            UserAvatarRef.current.innerHTML = userResult.avatarImg;
        }

        if (connectID) {
            SearchInputRef.current.value = connectID;
            PulseARef.current.classList.add("pulse");
            PulseBRef.current.classList.add("pulse");
        }
    }, [userResult, connectID])

    const FindUser = async () => {
        const userID = SearchInputRef.current.value;
        PulseARef.current.classList.remove("pulse");
        PulseBRef.current.classList.remove("pulse");

        if (userID === user.uid) {
            toast.error("Invalid User ID");
            SearchInputRef.current.value = "";
            return;
        }

        try {
            const result = await axios.post("/api/findUser", { userID })
            setUserResult(result.data.user);
            // console.log(result)
        }
        catch (err) {
            console.log(err)
            toast.error("User not found");
        }
    }

    const AddUser = async () => {
        try {
            const result = await axios.post("/api/addContact", { userID: user.uid, contactID: userResult._id })
            // console.log(result)
            if (result.data.status) {
                // let data = FetchContacts(user.uid);
                // setContactData(data);
                setContacts(prev => [...prev, { _id: userResult._id, username: userResult.username, avatarImg: userResult.avatarImg }]);

                let prevContacts = JSON.parse(localStorage.getItem("xrecon-user-contacts"));
                prevContacts.push({ _id: userResult._id, username: userResult.username, avatarImg: userResult.avatarImg });
                localStorage.setItem("xrecon-user-contacts", JSON.stringify(prevContacts));

                toast.success("User Added to Chat 👍");
                navigate("/");
            } else {
                toast.error(result.data?.err || "Something went wrong");
            }

        }
        catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Something went wrong");
        }

        // setForceUpdate(prev => prev + 1);
    }

    const CopyUserID = () => {
        navigator.clipboard.writeText(user.uid);
        toast.success("Copied to clipboard", { position: "top-right" });
    }

    return (
        <div className="AddContact-Main">
            <div className="AddContact-Header flex">
                <div className="AddContact-BackBtn flex" onClick={() => navigate("/")}>
                    <HiOutlineChevronLeft size={25} color="var(--grey)" />
                </div>
                <h2>Add a new Contact</h2>
            </div>

            <div className="AddContact-Body flex col">
                <div className="AddContact-Input flex">
                    <input type="text" placeholder="Paste or Enter the User ID" ref={SearchInputRef} />
                    <div className="AddContact-SearchBtn flex" onClick={FindUser}>
                        <span ref={PulseARef}></span>
                        <span ref={PulseBRef}></span>
                        <MdSearch size={25} color="var(--white)" />
                    </div>
                </div>

                {userResult ? <div className="AddContact-SearchResult flex">
                    <div className="AddContact-UserInfo flex">
                        <div className="AddContact-UserAvatar flex" ref={UserAvatarRef}>
                            <BiUser size={40} color="var(--white)" />
                        </div>
                        <div className="AddContact-UserName flex col">
                            <span>{userResult.username}</span>
                            <p>{userResult._id}</p>
                        </div>

                        <div className="AddContact-AddBtn flex" onClick={AddUser}>
                            <BiUserPlus size={30} color="var(--white)" />
                            <p>Add</p>
                        </div>
                    </div>
                </div>
                    :
                    <div className="AddContact-SearchResult flex">
                        Ask your friend to share their User ID.
                    </div>}

                <div className="AddContact-Share flex col gap-1">
                    <span>Share your User ID :</span>

                    <div className="AddContact-Social flex">
                        <a href={`https://api.whatsapp.com/send?text=https://xrecon.netlify.app/connect/${user.uid}`} id="whatsapp">
                            <BsWhatsapp size={25} color="var(--white)" />
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=https://xrecon.netlify.app/connect/${user.uid}`} id="facebook">
                            <BsFacebook size={25} color="var(--white)" />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?text=https://xrecon.netlify.app/connect/${user.uid}`} id="twitter">
                            <BsTwitter size={25} color="var(--white)" />
                        </a>
                    </div>

                    <div className="AddContact-copyUid flex col">
                        <span>OR Copy User ID</span>

                        <div className="flex">
                            <input type="text" value={user.uid} readOnly />
                            <div className="AddContact-copyBtn flex" onClick={CopyUserID}>
                                <MdContentCopy size={25} color="var(--white)" title="Copy User ID" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default AddContact