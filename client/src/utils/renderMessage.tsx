import reactStringReplace from "react-string-replace";
import Emoji from "../components/Emoji";
import attachmentUrl from "./attachmentUrl";

function parseEmojis(content: string) {
    return reactStringReplace(content, /<?(a)?:?\w{2,32}:(?<id>\d{17,19})>?/, match => (
        <Emoji id={match.groups!.id} solo={match[0].length === content.length} />
    ));
}

function parseContent(content: string) {
    return parseEmojis(content);
}

export function renderContent(content: string) {
    if (content.length) {
        return (
            <span>{parseContent(content)}</span>
        );
    }
    else {
        return null;
    }
}

export function renderAttachments(attachments: Array<string>) {
    if (attachments.length) {
        return attachments.map(attachment =>
            <img
                key={attachment}
                className="attachment"
                src={attachmentUrl(attachment)}
                alt={attachment}
            />
        );
    }
    else {
        return null;
    }
}
