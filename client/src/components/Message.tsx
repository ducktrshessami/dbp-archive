import { UserData } from "../utils/api";

export default function Message(props: MessageProps) {
    return (
        <li>

        </li>
    );
}

type MessageProps = {
    id: string,
    author: UserData,
    content: string,
    createdAt: Date,
    attachments: Array<string>
    break: boolean
};
