import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { getChannelPage, MessagesData } from "../utils/api";
import Message from "./Message";
import PartialMessage from "./PartialMessage";
import "./MessageContainer.css";
import { MESSAGE_AGEBREAK } from "../utils/constants";
import Notice from "./Notice";

function renderMessageList(channelSelected: boolean, ready: boolean, messageData: Nullable<MessagesData>) {
    switch (true) {
        case channelSelected && ready && !!messageData:
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
        case channelSelected && !ready:
            return (
                <div className="centered-box">
                    <BeatLoader color="#8A9A5B" size="1.5rem" />
                </div>
            );
        default:
            return (
                <Notice>Select a channel</Notice>
            );
    }
}

export default function MessageList(props: MessageContainerProps) {
    const navigate = useNavigate();
    const [messageData, setMessagedata] = useState<Nullable<MessagesData>>(null);
    const [fetchedChannel, setFetchedChannel] = useState<Nullable<string>>(null);
    const [fetchedPage, setFetchedPage] = useState<Nullable<number>>(null);
    const page = parseInt(props.page!);
    const ready = fetchedChannel === props.channelId && fetchedPage === page;

    useEffect(() => {
        if (props.channelId && props.page && fetchedChannel !== props.channelId) {
            (async function () {
                if (isNaN(page) || page.toString() !== props.page) {
                    navigate("/");
                    return;
                }
                try {
                    setMessagedata(null);
                    const data = await getChannelPage(props.channelId!, page);
                    setFetchedChannel(props.channelId!);
                    setFetchedPage(page);
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
            {renderMessageList(!!props.channelId, ready, messageData)}
        </div>
    );
}

type MessageContainerProps = {
    channelId?: Nullable<string>,
    page?: Nullable<string>,
    pageCount?: Nullable<number>
};
