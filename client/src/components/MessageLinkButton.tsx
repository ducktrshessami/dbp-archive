import { Link, useLocation } from "react-router-dom";

export default function MessageLinkButton(props: MessageLinkButtonProps) {
    const location = useLocation();
    return (
        <Link className="message-link-button" to={`${location.pathname}#${props.messageId}`}>#</Link>
    );
}

type MessageLinkButtonProps = { messageId: string };
