import "./Register.css";
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import multiavatar from '@multiavatar/multiavatar/esm'
import axios from 'axios';

import { XreconText } from "../../Assets/index.jsx"
import { MdPerson, MdAlternateEmail } from "react-icons/md"
import { BsEye, BsEyeSlash } from "react-icons/bs"
import { BiUser } from "react-icons/bi"
import { FiUserPlus, FiLoader } from "react-icons/fi"
import { GoSync } from "react-icons/go"

const Register = () => {
    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [error, setError] = useState("");
    const [isAvatarImg, setIsAvatarImg] = useState(false);
    const [defaultName, setDefaultName] = useState("");
    const [loading, setLoading] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confPasswordRef = useRef();
    const AvatarRef = useRef();
    const avatarInputRef = useRef();
    const RandomBtnRef = useRef();
    const FormRef = useRef();
    // const SubmitRef = useRef();

    const navigate = useNavigate();
    let mobiledevice = window.innerWidth <= 768 ? true : false;

    const HandleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const defaultAvatar = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" color=#fff height="60" width="60" xmlns="http://www.w3.org/2000/svg" style="color: #fff;"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>';

        try {
            const username = nameRef.current.value.charAt(0).toUpperCase() + nameRef.current.value.slice(1);
            const email = emailRef.current.value.toLowerCase();
            const password = passwordRef.current.value;
            const avatar = AvatarRef?.current?.innerHTML || defaultAvatar;

            const result = await axios.post('/api/register', { username, email, password, avatar });

            if (result.data.status) {
                toast.success("User registered successfully");
                navigate('/login');
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast.error(err.response.data.error || "Something went wrong");
        }
    }

    const OnBlurEmail = () => {
        if (emailRef.current.value === "") return;

        const email = emailRef.current.value.toLowerCase();
        const isValidEmail = email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!isValidEmail) {
            setError("Enter a valid email");
            emailRef.current.parentNode.classList.add("RegError");
            return;
        } else {
            setError("");
            emailRef.current.parentNode.classList.remove("RegError");
        }
    }

    const OnBlurPass = () => {
        if (passwordRef.current.value === "") return;

        if (passwordRef.current.value.length < 6) {
            setError("Password Should be atleast 6 characters.")
            passwordRef.current.parentNode.classList.add("RegError");
        } else {
            passwordRef.current.parentNode.classList.remove("RegError");
        }

        OnChangePassConf();
    }

    const OnChangePassConf = () => {
        if (passwordRef.current.value !== confPasswordRef.current.value) {
            confPasswordRef.current.parentNode.classList.add("RegError");
            setError("Passwords do not match!");
        } else {
            setError("");
            confPasswordRef.current.parentNode.classList.remove("RegError");
        }
    }

    const HandleAvatarName = (e) => {
        if (window.innerWidth <= 750) {
            FormRef.current.style.marginTop = "2em";
        }

        avatarInputRef.current.style.visibility = "visible";
        RandomBtnRef.current.style.visibility = "visible";
        setDefaultName(e.target.value);
        GetAvatar(e.target.value);
        setIsAvatarImg(true);

        if (e.target.value === "") {
            RandomBtnRef.current.style.visibility = "hidden";
            AvatarRef.current.innerHTML = "";
            setIsAvatarImg(false);
        }
    }

    const GetAvatar = (name) => {
        if (name !== "") {
            const AvatarSVG = multiavatar(name);
            AvatarRef.current.innerHTML = AvatarSVG;
            setIsAvatarImg(true);
        } else {
            AvatarRef.current.innerHTML = "";
            setIsAvatarImg(false);
        }
    }

    const GetRandomAvatar = () => {
        RandomBtnRef.current.classList.toggle("RandomBtnActive");
        const AvatarSVG = multiavatar(Math.round(Math.random() * 10000));
        AvatarRef.current.innerHTML = AvatarSVG;
        setIsAvatarImg(true);
    }


    return (
        <div className="Register-main flex col">
            <div className="Register-card">
                <div className="Register-Logo flex">
                    <h1>Register to</h1>
                    <img src={XreconText} className="Register-XImg" alt="Xrecon Logo" width="auto" height={mobiledevice ? 35 : 70} />
                </div>

                <div className="Register-avatar flex">
                    <div className="Register-setAvatar flex col">
                        <div className="Register-avatarImg flex">
                            {!isAvatarImg && <BiUser size={60} color="var(--white)" />}
                            <div className="AvatarHolder" ref={AvatarRef}></div>
                            <div className="Register-randAvatar flex" title="Random Avatar" ref={RandomBtnRef} onClick={GetRandomAvatar}>
                                <GoSync size={25} color="var(--white)" />
                            </div>
                        </div>
                        <div className="Register-input flex" ref={avatarInputRef}>
                            <input
                                type="text"
                                placeholder="Avatar Name"
                                defaultValue={defaultName}
                                onChange={(e) => GetAvatar(e.target.value)} />
                        </div>
                    </div>
                </div>

                <form onSubmit={HandleRegister} ref={FormRef} className="Register-form flex col">
                    <div className="Register-input flex">
                        <input type="text" placeholder="Username" ref={nameRef} onChange={HandleAvatarName} required />
                        <MdPerson size={25} color="var(--black)" />
                    </div>
                    <div className="Register-input flex">
                        <input type="email" placeholder="Email" ref={emailRef} onBlur={OnBlurEmail} required />
                        <MdAlternateEmail size={25} color="var(--black)" />
                    </div>
                    <div className="Register-input flex">
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            ref={passwordRef}
                            onBlur={OnBlurPass}
                            required
                            autoComplete="new-password" />
                        <div className="Register-showpass flex" onClick={() => setShowPass(prev => !prev)}>
                            {!showPass ? <BsEyeSlash size={25} color="var(--black)" />
                                : <BsEye size={25} color="var(--black)" />}
                        </div>
                    </div>
                    <div className="Register-input flex">
                        <input
                            type={showConfPass ? "text" : "password"}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            ref={confPasswordRef}
                            required
                            onChange={OnChangePassConf} />
                        <div className="Register-showpass flex" onClick={() => setShowConfPass(prev => !prev)}>
                            {!showConfPass ? <BsEyeSlash size={25} color="var(--black)" />
                                : <BsEye size={25} color="var(--black)" />}
                        </div>

                    </div>
                    <p className="Register-errorMsg" style={error === "" ? { display: "none" } : { display: "flex" }}>{error}</p>

                    <button type="submit" className="Register-submit flex">
                        {!loading ? <FiUserPlus size={25} color="var(--white)" />
                            : <FiLoader className="Register-loaderSvg" size={25} color="var(--white)" />}
                        <span>Create New Account</span>
                    </button>
                </form>
                <div className="Register-login flex gap-1">
                    <p>Already have an account?</p>
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Register