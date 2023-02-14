import { toHTML as markdownToHTML } from "discord-markdown-fix";
import DOMPurify from "dompurify";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
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

function parseMessageLinks(content: ParsableContent, messageLinks?: Nullable<Map<string, number>>) {
    return reactStringReplace(content, /https?:\/\/discord(app)?.com\/channels\/(?<guildId>\d{17,19})\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})\/?/i, (match, i) => {
        const page = messageLinks?.get(`${match.groups!.channelId}/${match.groups!.messageId}`);
        return (
            <Link key={match.groups!.messageId + i} to={page ? `/${match.groups!.channelId}/${page}#${match.groups!.messageId}` : "#"}>{match[0]}</Link>
        );
    });
}

function parseEmojis(content: ParsableContent) {
    const soloable = typeof content === "string" || content.length === 1;
    return reactStringReplace(content, /<a?:\w{2,32}:(?<id>\d{17,19})>/, (match, i) => (
        <Emoji key={match.groups!.id + i} id={match.groups!.id} solo={soloable && match[0].length === content.length} />
    ));
}

function parseUserMentions(content: ParsableContent, users?: Nullable<Map<string, UserData>>) {
    return reactStringReplace(content, /<@!?(?<id>\d{17,19})>/, (match, i) => {
        const tag = userTag(users?.get(match.groups!.id));
        return (
            <Mention key={match.groups!.id + i}>@{tag}</Mention>
        );
    });
}

function parseChannelMentions(content: ParsableContent, channels?: Nullable<Map<string, ChannelData>>) {
    return reactStringReplace(content, /<#(?<id>\d{17,19})>/, (match, i) => {
        const channel = channels?.get(match.groups!.id);
        const name = channel?.name ?? "deleted-channel";
        return (
            <Mention key={match.groups!.id + i}>#{name}</Mention>
        );
    });
}

function parseRoleMentions(content: ParsableContent, roles?: Nullable<Map<string, RoleData>>) {
    return reactStringReplace(content, /<@&(?<id>\d{17,19})>/, (match, i) => {
        const role = roles?.get(match.groups!.id);
        const name = role?.name ?? "deleted-role";
        return (
            <Mention key={match.groups!.id + i}>@{name}</Mention>
        );
    });
}

function parseContent(content: string, resolved: ResolvedMessageData) {
    return parseRoleMentions(
        parseChannelMentions(
            parseUserMentions(
                parseEmojis(
                    parseMessageLinks(
                        content,
                        resolved.messageLinks
                    )
                ),
                resolved.users
            ),
            resolved.channels
        ),
        resolved.roles
    )
        .flatMap((node, i) => {
            if (typeof node === "string") {
                return (
                    <span key={i} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(markdownToHTML(node)) }} /> // wew
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
            <div>{parseContent(content, resolved)}</div>
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
    messageLinks?: Nullable<Map<string, number>>,
    messages?: Nullable<Array<MessageData>>
};

type ParsableContent = string | ReactNode[];
