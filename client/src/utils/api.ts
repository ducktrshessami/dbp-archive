import { RequestError } from "./error";
import { fromArray } from "./mapUtils";

async function fetchWrapped(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const res = await fetch(input, init);
    if (res.status < 400) {
        return res;
    }
    else {
        throw new RequestError(`${res.status} ${res.statusText}`);
    }
}

async function fetchJson(url: string): Promise<any> {
    const res = await fetchWrapped(url);
    return await res.json();
}

function createPostJsonOptions(body: any): RequestInit {
    return {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}

export async function getResolvedData(): Promise<ResolvedData> {
    const rawData: RawResolvedData = await fetchJson("/api/resolved");
    return {
        channels: fromArray(rawData.channels),
        users: fromArray(rawData.users),
        roles: fromArray(rawData.roles),
        messageLinks: new Map<string, number>(rawData.messageLinks)
    };
}

export async function getChannelPage(channelId: string, page: number): Promise<Array<MessageData>> {
    return await fetchJson(`/api/channel/${channelId}/${page}`);
}

export async function setMessageBreak(messageId: string, value: boolean): Promise<void> {
    await fetchWrapped(`/api/break/${messageId}`, createPostJsonOptions({ value }));
}

export async function setChannelHidden(channelId: string, value: boolean): Promise<void> {
    await fetchWrapped(`/api/hidden/${channelId}`, createPostJsonOptions({ value }));
}

export type ChannelData = {
    id: string,
    name: string,
    hidden: boolean,
    pages: number
};

export type MessageData = {
    id: string,
    authorId: string,
    content: string,
    createdAt: number,
    break: boolean,
    attachments: Array<string>
};

export type UserData = {
    id: string,
    username: string,
    discriminator: string,
    avatarUrl: string
};

export type RoleData = {
    id: string,
    name: string
};

type RawMessageLinkData = [string, number];

type RawResolvedData = {
    channels: Array<ChannelData>,
    users: Array<UserData>,
    roles: Array<RoleData>,
    messageLinks: Array<RawMessageLinkData>
};

export type ResolvedData = {
    channels: Map<string, ChannelData>,
    users: Map<string, UserData>,
    roles: Map<string, RoleData>,
    messageLinks: Map<string, number>
};
