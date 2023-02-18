import { Link, useLocation } from "react-router-dom";
import "./MessageLinkButton.css";

export default function MessageLinkButton(props: MessageLinkButtonProps) {
    const location = useLocation();
    return (
        <div className="message-link-button-container">
            <Link className="message-link-button" to={`${location.pathname}#${props.messageId}`}>#</Link>
        </div>
    );
}

type MessageLinkButtonProps = { messageId: string };
