import "./Login.css";
import { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useContextData } from "../../hooks/useContextData"
import { toast } from 'react-toastify';
import axios from 'axios';

import { MdAlternateEmail } from "react-icons/md"
import { BsEye, BsEyeSlash } from "react-icons/bs"
import { FiLogIn, FiLoader } from "react-icons/fi"
import { XreconText, ChatSVG } from "../../Assets/index.jsx";

const Login = () => {
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    // const SubmitRef = useRef();

    const { setUser, setToken } = useContextData();
    const navigate = useNavigate();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        // console.log(email, password)
        // setUser({ email, password });

        try {
            const result = await axios.post('/api/login', { email, password });
            console.log(result);

            if (result.data.status) {
                let user = result.data.user;
                let token = result.data.token;

                setUser(user);
                setToken(token);

                localStorage.setItem('xrecon-user-token', JSON.stringify({ user, token }));
                navigate("/");
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            toast.error(err.response?.data?.error || "Something went wrong");
        }
    }

    return (
        <div className="Login-main">
            <div className="Login-sideart flex col">
                <div className="Login-Logo flex">
                    <img src={XreconText} alt="Xrecon Logo" width="auto" height={100} />
                    {/* <h1 className="webTitle">Recon</h1> */}
                </div>

                <img src={ChatSVG} width={400} height={400} alt="Messaging" />
            </div>
            <div className="Login-form flex col">
                <form onSubmit={HandleSubmit} className="flex col">
                    <h2 className="flex">Login to
                        <img src={XreconText} className="Login-XImg" alt="Xrecon Logo" width="auto" height={50} />
                        {/* <span className="webTitle" style={{ fontSize: "40px" }}>Recon</span> */}
                    </h2>

                    <div className="Login-input flex">
                        <input type="email" placeholder="Email" ref={emailRef} required />
                        <MdAlternateEmail size={25} color="var(--black)" />
                    </div>
                    <div className="Login-input flex">
                        <input type={showPass ? "text" : "password"} placeholder="Password" ref={passwordRef} required />
                        <div className="Login-showpass flex" onClick={() => setShowPass(prev => !prev)}>
                            {!showPass ? <BsEyeSlash size={25} color="var(--black)" />
                                : <BsEye size={25} color="var(--black)" />}
                        </div>
                    </div>

                    <button type="submit" className="Login-submit flex">
                        {!loading ? <FiLogIn size={25} color="var(--white)" />
                            : <FiLoader className="Login-loaderSvg" size={25} color="var(--white)" />}
                        <span>Login</span>
                    </button>
                </form>

                <div className="Login-register flex gap-1">
                    <p>Don't have an account?</p>
                    <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Login