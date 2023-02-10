import Markdown from "markdown-to-jsx";
import { ReactNode } from "react";
import reactStringReplace from "react-string-replace";
import Emoji from "../components/Emoji";
import Mention from "../components/Mention";
import {
    ChannelData,
    MessageData,
    RoleData,
    UserData
} from "./api";
import attachmentUrl from "./attachmentUrl";
import userTag from "./userTag";

function parseEmojis(content: string) {
    return reactStringReplace(content, /<?(a)?:?\w{2,32}:(?<id>\d{17,19})>?/, match => (
        <Emoji id={match.groups!.id} solo={match[0].length === content.length} />
    ));
}

function parseUserMentions(content: ParsableContent, users?: Nullable<Map<string, UserData>>) {
    return reactStringReplace(content, /<@!?(?<id>\d{17,19})>/, match => {
        const tag = userTag(users?.get(match.groups!.id));
        return (
            <Mention>@{tag}</Mention>
        );
    });
}

function parseChannelMentions(content: ParsableContent, channels?: Nullable<Map<string, ChannelData>>) {
    return reactStringReplace(content, /<#(?<id>\d{17,19})>/, match => {
        const channel = channels?.get(match.groups!.id);
        const name = channel?.name ?? "deleted-channel";
        return (
            <Mention>#{name}</Mention>
        );
    });
}

function parseRoleMentions(content: ParsableContent, roles?: Nullable<Map<string, RoleData>>) {
    return reactStringReplace(content, /<@&(?<id>\d{17,19})>/, match => {
        const role = roles?.get(match.groups!.id);
        const name = role?.name ?? "deleted-role";
        return (
            <Mention>@{name}</Mention>
        );
    });
}

function parseContent(content: string, resolved: ResolvedMessageData) {
    return parseRoleMentions(
        parseChannelMentions(
            parseUserMentions(
                parseEmojis(content),
                resolved.users
            ),
            resolved.channels
        ),
        resolved.roles
    )
        .map(node => {
            if (typeof node === "string") {
                return (
                    <Markdown>{node}</Markdown>
                );
            }
            else {
                return node;
            }
        });
}

export function renderContent(content: string, resolved: ResolvedMessageData) {
    if (content.length) {
        return (
            <span>{parseContent(content, resolved)}</span>
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

export type ResolvedMessageData = {
    channels?: Nullable<Map<string, ChannelData>>,
    users?: Nullable<Map<string, UserData>>,
    roles?: Nullable<Map<string, RoleData>>,
    messages?: Nullable<Array<MessageData>>
};

type ParsableContent = string | ReactNode[];
