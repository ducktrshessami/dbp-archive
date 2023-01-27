import renderAttachments from "../utils/renderAttachments";
import { MessageProps } from "./MessageProps";

export default function Message(props: MessageProps) {
    const tag = `${props.author.username}#${props.author.discriminator}`;
    return (
        <li className="message">
            <img className="avatar" src={props.author.avatarUrl} alt={`${tag}'s avatar`} />
            <div>
                <span>{props.content}</span>
                {renderAttachments(props.attachments)}
            </div>
        </li>
    );
}
