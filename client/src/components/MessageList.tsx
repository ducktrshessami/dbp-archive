import { BeatLoader } from "react-spinners";
import {
    ChannelData,
    MessageData,
    UserData
} from "../utils/api";
import { MESSAGE_AGEBREAK } from "../utils/constants";
import Message from "./Message";
import Notice from "./Notice";
import PartialMessage from "./PartialMessage";
import "./MessageList.css";

function renderMessageList(channelSelected: boolean, ready: boolean, resolved: ResolvedMessageData) {
    switch (true) {
        case channelSelected && ready && !!resolved.messages:
            const messages = resolved.messages!.map((message, i) => {
                const createdAt = new Date(message.createdAt);
                if (
                    message.break ||
                    i === 0 ||
                    message.authorId !== resolved.messages![i - 1].authorId ||
                    (message.createdAt - resolved.messages![i - 1].createdAt) >= MESSAGE_AGEBREAK
                ) {
                    return (
                        <Message
                            key={message.id}
                            id={message.id}
                            author={resolved.users!.get(message.authorId)!}
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

export default function MessageList(props: MessageListProps) {
    return (
        <div className="message-list">
            {renderMessageList(props.channelSelected, props.ready, props.resolved)}
        </div>
    );
}

export type ResolvedMessageData = {
    channels?: Nullable<Array<ChannelData>>,
    users?: Nullable<Map<string, UserData>>,
    messages?: Nullable<Array<MessageData>>
};

type MessageListProps = {
    channelSelected: boolean,
    ready: boolean,
    resolved: ResolvedMessageData
};
