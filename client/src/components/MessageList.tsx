import { BeatLoader } from "react-spinners";
import { MESSAGE_AGEBREAK } from "../constants";
import { MessageData } from "../utils/api";
import { ResolvedMessageData } from "../utils/renderMessage";
import Message from "./Message";
import Notice from "./Notice";
import PartialMessage from "./PartialMessage";
import "./MessageList.css";

function renderMessageList(props: MessageListProps) {
    switch (true) {
        case props.channelSelected && props.ready && !!props.messages:
            const messages = props.messages!.map((message, i) => {
                const createdAt = new Date(message.createdAt);
                if (
                    message.break ||
                    i === 0 ||
                    message.authorId !== props.messages![i - 1].authorId ||
                    (message.createdAt - props.messages![i - 1].createdAt) >= MESSAGE_AGEBREAK
                ) {
                    return (
                        <Message
                            key={message.id}
                            id={message.id}
                            authorId={message.authorId}
                            content={message.content}
                            createdAt={createdAt}
                            attachments={message.attachments}
                            resolved={props.resolved}
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
                            resolved={props.resolved}
                        />
                    );
                }
            });
            return (
                <ul>
                    {messages}
                </ul>
            );
        case props.channelSelected && !props.ready:
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
            {renderMessageList(props)}
        </div>
    );
}

type MessageListProps = {
    channelSelected: boolean,
    ready: boolean,
    resolved: ResolvedMessageData,
    messages?: Nullable<Array<MessageData>>
};
