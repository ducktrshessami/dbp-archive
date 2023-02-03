import { ReactNode } from "react";
import "./Notice.css";

export default function Notice(props: NoticeProps) {
    const className = props.className ? `notice centered-box ${props.className}` : "notice centered-box";
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
