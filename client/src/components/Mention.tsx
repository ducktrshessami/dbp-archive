import { ReactNode } from "react";

export default function Mention(props: MentionProps) {
    return (
        <span className="mention">{props.children}</span>
    );
}

type MentionProps = { children?: ReactNode };
