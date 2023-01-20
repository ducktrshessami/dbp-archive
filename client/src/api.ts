async function fetchJson(url: string): Promise<any> {
    const res = await fetch(url);
    if (res.status < 400) {
        return await res.json();
    }
}

export async function getChannels(): Promise<Array<ChannelData>> {
    return await fetchJson("/api/channels");
}

export async function getChannelPage(channelId: string, page: number): Promise<Array<MessagesData>> {
    return await fetchJson(`/api/channel/${channelId}/${page}`);
}

export function attachmentUrl(filename: string): string {
    return `/api/attachment/${filename}`;
}

type ChannelData = {
    id: string,
    name: string,
    pages: number
};

type MessageData = {
    id: string,
    content: string,
    createdAt: number,
    break: boolean,
    attachments: Array<string>
};

type UserData = {
    id: string,
    username: string,
    discriminator: string,
    avatarUrl: string
};

type MessagesData = {
    messages: Array<MessageData>,
    users: Array<UserData>
};
