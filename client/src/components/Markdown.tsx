import { toHTML } from "discord-markdown-fix";
import DOMPurify from "dompurify";
import "./Markdown.css";

export default function Markdown(props: MarkdownProps) {
    return (
        <span className="markdown" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHTML(props.children)) }} />
    );
}

export type MarkdownProps = { children: string };
