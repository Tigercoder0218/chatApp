import "./Dashboard.css"
import { ChatSVG, Devbase, XreconText } from "../../Assets"
import { BsGithub } from "react-icons/bs"

const Dashboard = () => {
    let currYear = new Date().getFullYear();

    return (
        <div className='Dashboard-Main'>
            <div className="Dashboard-welcome flex col">
                <h1 className="flex">Welcome to
                    <img src={XreconText} className="Dashboard-XImg" alt="Xrecon Logo" width="auto" height={70} />
                </h1>

                <img src={ChatSVG} alt="Welcome SVG" width={350} height={350} />
                <p>XRecon is a realtime chat app, Users can text and interact with other users.</p>

                <div className="Dashboard-Footer">
                    <div className="Dashboard-Links flex">
                        <a href="https://devbase.netlify.app/" target="_blank" rel="noreferrer" title="DevBase">
                            <img src={Devbase} alt="DevBase" width={35} height={35} />
                            <span>DevBase</span>
                        </a>
                        <a href="https://github.com/ChiragChrg" target="_blank" rel="noreferrer" title="GitHub">
                            <BsGithub size={35} color="var(--white)" />
                            <span>GitHub</span>
                        </a>
                    </div>
                    <p>© Copyright 2022 - {currYear} ChiragChrg</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
