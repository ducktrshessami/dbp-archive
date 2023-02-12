import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { renderAttachments, renderContent } from "../utils/renderMessage";
import { PartialMessageProps } from "./MessageProps";

export default function PartialMessage(props: PartialMessageProps) {
    const ref = useRef<HTMLLIElement | null>(null);
    const location = useLocation();

    if (ref.current && location.hash === `#${props.id}`) {
        ref.current.scrollIntoView();
    }

    return (
        <li ref={ref} className="message partial">
            {renderContent(props.content, props.resolved)}
            {renderAttachments(props.attachments)}
        </li>
    );
}
