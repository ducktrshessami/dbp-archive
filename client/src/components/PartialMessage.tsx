import { renderAttachments, renderContent } from "../utils/renderMessage";
import { PartialMessageProps } from "./MessageProps";

export default function PartialMessage(props: PartialMessageProps) {
    return (
        <li className="message partial">
            {renderContent(props.content, props.resolved)}
            {renderAttachments(props.attachments)}
        </li>
    );
}
