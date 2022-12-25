import "./NotFound.css"
import { useNavigate } from "react-router-dom"
import { NotFoundImg, XreconText } from "../../Assets"
import { HiHome } from "react-icons/hi"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="NotFound-Main flex col">
            <div className="NotFound-Header">
                <img src={XreconText} alt="Not Found" />

                <div className="NotFound-HomeBtn flex gap-05" onClick={() => navigate("/")}>
                    <HiHome size={25} color="var(--white)" />
                    <span>Home</span>
                </div>
            </div>

            <div className="NotFound-ImgHolder flex">
                <img src={NotFoundImg} alt="Not Found" />
            </div>
        </div>
    )
}

export default NotFound