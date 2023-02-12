import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MESSAGE_GLOWTIMEOUT } from "../constants";
import { renderAttachments, renderContent } from "../utils/renderMessage";
import { PartialMessageProps } from "./MessageProps";

export default function PartialMessage(props: PartialMessageProps) {
    const ref = useRef<HTMLLIElement | null>(null);
    const location = useLocation();
    const [glow, setGlow] = useState<boolean>(false);
    const [done, setDone] = useState<boolean>(false);
    const focused = location.hash === `#${props.id}`;

    if (ref.current && focused) {
        ref.current.scrollIntoView();
    }

    useEffect(() => {
        if (!glow && !done) {
            setGlow(focused);
        }
        else if (glow && !done) {
            setTimeout(() => setDone(true), MESSAGE_GLOWTIMEOUT);
        }
    });

    return (
        <li ref={ref} className={glow && !done ? "message partial glow" : "message partial"}>
            {renderContent(props.content, props.resolved)}
            {renderAttachments(props.attachments)}
        </li>
    );
}
