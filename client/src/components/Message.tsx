import renderAttachments from "../utils/renderAttachments";
import { MessageProps } from "./MessageProps";

function formatTimestamp(timestamp: Date): string {
    const month = timestamp.getMonth() + 1;
    const day = timestamp.getDate();
    const year = timestamp.getFullYear();
    const hour = timestamp.getHours();
    const minute = timestamp.getMinutes();
    const period = hour < 12 ? "AM" : "PM";
    let parsedHour: number;
    switch (true) {
        case hour === 0: parsedHour = 12; break;
        case hour > 12: parsedHour = hour - 12; break;
        default: parsedHour = hour;
    }
    return `${month}/${day}/${year} ${parsedHour}:${minute} ${period}`;
}

export default function Message(props: MessageProps) {
    const tag = `${props.author.username}#${props.author.discriminator}`;
    return (
        <li className="message">
            <img className="avatar" src={props.author.avatarUrl} alt={`${tag}'s avatar`} />
            <div className="content">
                <div className="content-header">
                    <span className="author" meta-author-id={props.author.id}>{props.author.username}#{props.author.discriminator}</span>
                    <span className="timestamp">{formatTimestamp(props.createdAt)}</span>
                </div>
                <span>{props.content}</span>
                {renderAttachments(props.attachments)}
            </div>
        </li>
    );
}
