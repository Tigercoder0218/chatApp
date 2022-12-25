import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from './Sidebar/Sidebar'
import { useContextData } from "../hooks/useContextData";

const Content = () => {
    const [isLogout, setIsLogout] = useState(false);
    const { setUser, setToken, onLogout, setOnLogout } = useContextData();
    const location = useLocation();
    const navigate = useNavigate();
    const ContentRef = useRef();
    const OutletRef = useRef();

    useEffect(() => {
        let devWidth = window.innerWidth;
        if (devWidth < 750 && location.pathname === "/") {
            ContentRef.current.classList.add("Sidebar-Active");
            OutletRef.current.classList.add("Sidebar-Active");
        } else {
            ContentRef.current.classList.remove("Sidebar-Active");
            OutletRef.current.classList.remove("Sidebar-Active");
        }
    }, [location])

    useEffect(() => {
        if (onLogout) {
            setIsLogout(true);
        }
    }, [onLogout])

    const Logout = () => {
        setUser({});
        setToken("");
        setOnLogout(false);
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="Content-main" ref={ContentRef}>
            <Sidebar />
            <div className="Outlet" ref={OutletRef}>
                <Outlet />
            </div>

            {isLogout &&
                <div className="Logout-Modal flex">
                    <div className="Logout-Card flex col">
                        <h3>Are you sure you want to logout?</h3>
                        <div className="Logout-Buttons flex">
                            <button onClick={() => { setIsLogout(false); setOnLogout(false) }}>Cancel</button>
                            <button className="logout" onClick={Logout}>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Content