import { ReactNode } from "react";
import "./Mention.css";

export default function Mention(props: MentionProps) {
    return (
        <span className="mention">{props.children}</span>
    );
}

type MentionProps = { children?: ReactNode };
