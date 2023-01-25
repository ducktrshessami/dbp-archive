import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { getChannelPage, MessagesData } from "../utils/api";
import Message from "./Message";
import PartialMessage from "./PartialMessage";
import "./MessageList.css";
import { MESSAGE_AGEBREAK } from "../utils/constants";
import Notice from "./Notice";

function renderMessageList(channelSelected: boolean, messageData: Nullable<MessagesData>) {
    switch (true) {
        case !!messageData:
            const messages = messageData!.messages.map((message, i) => {
                const createdAt = new Date(message.createdAt);
                if (
                    message.break ||
                    i === 0 ||
                    message.authorId !== messageData!.messages[i - 1].authorId ||
                    (message.createdAt - messageData!.messages[i - 1].createdAt) >= MESSAGE_AGEBREAK
                ) {
                    return (
                        <Message
                            key={message.id}
                            id={message.id}
                            author={messageData!.users.get(message.authorId)!}
                            content={message.content}
                            createdAt={createdAt}
                            attachments={message.attachments}
                        />
                    );
                }
                else {
                    return (
                        <PartialMessage
                            key={message.id}
                            id={message.id}
                            content={message.content}
                            createdAt={createdAt}
                            attachments={message.attachments}
                        />
                    );
                }
            });
            return (
                <ul>
                    {messages}
                </ul>
            );
        case channelSelected:
            return (
                <BeatLoader />
            );
        default:
            return (
                <Notice>Select a channel</Notice>
            );
    }
}

export default function MessageList(props: MessageListProps) {
    const channelSelected = !!props.channelId && !!props.page;
    const navigate = useNavigate();
    const [messageData, setMessagedata] = useState<Nullable<MessagesData>>(null);
    const [fetchedChannel, setFetchedChannel] = useState<Nullable<string>>(null);

    useEffect(() => {
        if (channelSelected && fetchedChannel !== props.channelId) {
            (async function () {
                const page = parseInt(props.page!);
                if (isNaN(page) || page.toString() !== props.page) {
                    navigate("/");
                    return;
                }
                try {
                    const data = await getChannelPage(props.channelId!, page);
                    setMessagedata(data);
                    setFetchedChannel(props.channelId!);
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
            {renderMessageList(channelSelected, messageData)}
        </div>
    );
}

type MessageListProps = {
    channelId?: Nullable<string>,
    page?: Nullable<string>,
    pageCount?: Nullable<number>
};
