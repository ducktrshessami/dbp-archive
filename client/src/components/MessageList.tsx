import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { getChannelPage, MessagesData } from "../utils/api";
import Message from "./Message";
import "./MessageList.css";

function renderMessageList(messageData: Nullable<MessagesData>) {
    if (messageData) {
        const messages = messageData.messages.map(message =>
            <Message
                key={message.id}
                id={message.id}
                author={messageData.users.get(message.authorId)!}
                content={message.content}
                createdAt={new Date(message.createdAt)}
                attachments={message.attachments}
                break={message.break}
            />
        );
        return (
            <ul>
                {messages}
            </ul>
        );
    }
    else {
        return (
            <BeatLoader />
        );
    }
}

export default function MessageList(props: MessageListProps) {
    const navigate = useNavigate();
    const [messageData, setMessagedata] = useState<Nullable<MessagesData>>(null);

    useEffect(() => {
        if (props.channelId && props.page && messageData === null) {
            (async function () {
                const page = parseInt(props.page!);
                if (isNaN(page) || page.toString() !== props.page) {
                    navigate("/");
                    return;
                }
                try {
                    const data = await getChannelPage(props.channelId!, page);
                    setMessagedata(data);
                }
                catch (err) {
                    console.error(err);
                    navigate("/");
                }
            })();
        }
    });

    return (
        <div className="message-list">
            {renderMessageList(messageData)}
        </div>
    );
}

type MessageListProps = {
    channelId?: Nullable<string>,
    page?: Nullable<string>,
    pageCount?: Nullable<number>
};
