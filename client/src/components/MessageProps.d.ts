import { UserData } from "../utils/api";
import { ResolvedMessageData } from "../utils/renderMessage";

export type PartialMessageProps = {
    id: string,
    content: string,
    createdAt: Date,
    attachments: Array<string>,
    resolved: ResolvedMessageData
};

export type MessageProps = PartialMessageProps & { authorId: string };
