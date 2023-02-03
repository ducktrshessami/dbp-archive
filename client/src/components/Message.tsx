import { renderAttachments, renderContent } from "../utils/renderMessage";
import { MessageProps } from "./MessageProps";

function widen(n: number, minDigits: number): string {
    const raw = n.toString();
    const zeroes = new Array<0>(Math.max(0, minDigits - raw.length))
        .fill(0)
        .join("");
    return zeroes + raw;
}

function formatTimestamp(timestamp: Date): string {
    const month = timestamp.getMonth() + 1;
    const day = timestamp.getDate();
    const year = timestamp.getFullYear();
    const hour = timestamp.getHours();
    const minute = widen(timestamp.getMinutes(), 2);
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
                {renderContent(props.content)}
                {renderAttachments(props.attachments)}
            </div>
        </li>
    );
}
