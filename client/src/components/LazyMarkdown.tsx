import { lazy, Suspense } from "react";
import { MarkdownProps } from "./Markdown";

const Markdown = lazy(() => import("./Markdown"));

export default function LazyMarkdown(props: MarkdownProps) {
    return (
        <Suspense fallback={<span>{props.children}</span>}>
            <Markdown>{props.children}</Markdown>
        </Suspense>
    );
}
