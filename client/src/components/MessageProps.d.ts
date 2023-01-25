import { UserData } from "../utils/api";

export type PartialMessageProps = {
    id: string,
    content: string,
    createdAt: Date,
    attachments: Array<string>
};

export type MessageProps = PartialMessageProps & { author: UserData };
