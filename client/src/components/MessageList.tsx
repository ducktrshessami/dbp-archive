import { BeatLoader } from "react-spinners";
import { MESSAGE_AGEBREAK } from "../utils/constants";
import Message from "./Message";
import Notice from "./Notice";
import PartialMessage from "./PartialMessage";
import "./MessageList.css";
import { ResolvedMessageData } from "../utils/renderMessage";
import "./MessageMarkdown.css";

function renderMessageList(props: MessageListProps) {
    switch (true) {
        case props.channelSelected && props.ready && !!props.resolved.messages:
            const messages = props.resolved.messages!.map((message, i) => {
                const createdAt = new Date(message.createdAt);
                if (
                    message.break ||
                    i === 0 ||
                    message.authorId !== props.resolved.messages![i - 1].authorId ||
                    (message.createdAt - props.resolved.messages![i - 1].createdAt) >= MESSAGE_AGEBREAK
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
    resolved: ResolvedMessageData
};
