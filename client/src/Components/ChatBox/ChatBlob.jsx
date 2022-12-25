import moment from 'moment';
import { useContextData } from '../../hooks/useContextData';

const ChatBlob = ({ msg }) => {
    const { user } = useContextData();
    const time = moment(msg.createdAt).format('LT');
    const MsgClass = msg.sender === user.uid ? "ChatBox-MsgBlob selfMsg" : "ChatBox-MsgBlob extMsg";

    return (
        <div className={MsgClass}>
            <div className="blob flex">
                <p>{msg.text}</p>
                <span>{time}</span>
            </div>
        </div>
    )
}

export default ChatBlob