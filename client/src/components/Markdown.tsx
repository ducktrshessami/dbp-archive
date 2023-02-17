import { toHTML } from "discord-markdown-fix";
import DOMPurify from "dompurify";

export default function Markdown(props: MarkdownProps) {
    return (
        <span className="markdown" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHTML(props.children)) }} />
    );
}

type MarkdownProps = { children: string };
