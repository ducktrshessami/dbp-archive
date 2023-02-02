import { RequestError } from "./error";

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

export async function getChannels(): Promise<Array<ChannelData>> {
    return await fetchJson("/api/channels");
}

export async function getChannelPage(channelId: string, page: number): Promise<MessagesData> {
    const rawData: RawMessagesData = await fetchJson(`/api/channel/${channelId}/${page}`);
    return {
        messages: rawData.messages,
        users: new Map<string, UserData>(rawData.users.map(user => [user.id, user]))
    };
}

export async function setMessageBreak(messageId: string, value: boolean): Promise<void> {
    await fetchWrapped(`/api/break/${messageId}`, createPostJsonOptions({ value }));
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

type RawMessagesData = {
    messages: Array<MessageData>,
    users: Array<UserData>
};

export type MessagesData = {
    messages: Array<MessageData>,
    users: Map<string, UserData>
};
