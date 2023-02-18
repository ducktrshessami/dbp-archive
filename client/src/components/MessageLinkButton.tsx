import { Link } from "react-router-dom";

export default function MessageLinkButton(props: MessageLinkButtonProps) {
    return (
        <Link className="message-link-button" to={`/${props.channelId}/${props.page}#${props.messageId}`}>#</Link>
    );
}

type MessageLinkButtonProps = {
    channelId: string,
    page: number,
    messageId: string,
};
