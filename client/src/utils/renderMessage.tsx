import { ReactNode } from "react";
import { Link } from "react-router-dom";
import reactStringReplace from "react-string-replace";
import Emoji from "../components/Emoji";
import LazyMarkdown from "../components/LazyMarkdown";
import Mention from "../components/Mention";
import Spoiler from "../components/Spoiler";
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
        <Emoji key={match.groups!.id + i} id={match.groups!.id} solo={soloable && match[0].length === match.input.length} />
    ));
}

function parseIdMentions(content: ParsableContent, resolved?: ResolvedMentionableData) {
    return reactStringReplace(content, /<(?<prefix>[@#])(?<role>&?)(?<id>\d{17,19})>/, (match, i) => {
        let name: string;
        switch (true) {
            case !!match.groups!.role:
                const role = resolved?.roles?.get(match.groups!.id);
                name = role?.name ?? "deleted-role";
                break;
            case match.groups!.prefix === "#":
                const channel = resolved?.channels?.get(match.groups!.id);
                name = channel?.name ?? "deleted-channel";
                break;
            default:
                const user = resolved?.users?.get(match.groups!.id);
                name = userTag(user);
                break;
        }
        return (
            <Mention key={match.groups!.id + i}>{`${match.groups!.prefix}${name}`}</Mention>
        );
    });
}

function parseEveryoneMentions(content: ParsableContent) {
    return reactStringReplace(content, /@(?<type>everyone|here)/, (match, i) => (
        <Mention key={match.groups!.type + i}>{match[0]}</Mention>
    ));
}

function parseRawContent(content: string, resolved: ResolvedMessageData) {
    return parseEmojis(
        parseEveryoneMentions(
            parseIdMentions(
                parseMessageLinks(
                    content,
                    resolved.messageLinks
                ),
                resolved
            )
        )
    )
        .map((node, i) => {
            if (typeof node === "string") {
                return (
                    <LazyMarkdown key={`markdown-${i}`}>{node}</LazyMarkdown>
                );
            }
            else {
                return node;
            }
        });
}

function parseSpoilerTags(content: ParsableContent, resolved: ResolvedMessageData) {
    return reactStringReplace(content, /\|\|(?<inner>(?:[^\|]|\\\|)+)\|\|/, (match, i) => (
        <Spoiler key={`spoiler-${i}`}>{parseRawContent(match.groups!.inner, resolved)}</Spoiler>
    ));
}

function parseContent(content: string, resolved: ResolvedMessageData) {
    return parseSpoilerTags(content, resolved)
        .flatMap(node => {
            if (typeof node === "string") {
                return parseRawContent(node, resolved);
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

type ResolvedMentionableData = {
    channels?: Nullable<Map<string, ChannelData>>,
    users?: Nullable<Map<string, UserData>>,
    roles?: Nullable<Map<string, RoleData>>
};

export type ResolvedData = ResolvedMentionableData & { messageLinks?: Nullable<Map<string, number>> };

export type ResolvedMessageData = ResolvedData & { messages?: Nullable<Array<MessageData>> };

type ParsableContent = string | ReactNode[];
