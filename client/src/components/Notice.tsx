import { ReactNode } from "react";
import "./Notice.css";

export default function Notice(props: NoticeProps) {
    const className = props.className ? `notice ${props.className}` : "notice";
    return (
        <div className={className}>
            <span>{props.children}</span>
        </div>
    );
}

type NoticeProps = {
    className?: string,
    children?: ReactNode
};
