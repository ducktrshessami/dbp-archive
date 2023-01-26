import renderAttachments from "../utils/renderAttachments";
import { PartialMessageProps } from "./MessageProps";

export default function PartialMessage(props: PartialMessageProps) {
    return (
        <li className="message partial">
            <span>{props.content}</span>
            {renderAttachments(props.attachments)}
        </li>
    );
}
