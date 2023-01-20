class CustomError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

class RequestError extends CustomError { }

async function fetchJson(url: string): Promise<any> {
    const res = await fetch(url);
    if (res.status < 400) {
        return await res.json();
    }
    else {
        throw new RequestError(`${res.status} ${res.statusText}`);
    }
}

export async function getChannels(): Promise<Map<string, ChannelData>> {
    const channels: Array<ChannelData> = await fetchJson("/api/channels");
    return new Map<string, ChannelData>(channels.map(channel => [channel.id, channel]));
}

export async function getChannelPage(channelId: string, page: number): Promise<Array<MessagesData>> {
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
