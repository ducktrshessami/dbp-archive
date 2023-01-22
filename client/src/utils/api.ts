import { RequestError } from "./error";

async function fetchJson(url: string): Promise<any> {
    const res = await fetch(url);
    if (res.status < 400) {
        return await res.json();
    }
    else {
        throw new RequestError(`${res.status} ${res.statusText}`);
    }
}

export async function getChannels(): Promise<Array<ChannelData>> {
    return await fetchJson("/api/channels");
}

export async function getChannelPage(channelId: string, page: number): Promise<MessagesData> {
    return await fetchJson(`/api/channel/${channelId}/${page}`);
}

export type ChannelData = {
    id: string,
    name: string,
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

export type MessagesData = {
    messages: Array<MessageData>,
    users: Array<UserData>
};
