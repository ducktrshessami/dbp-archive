import "./MessageList.css";

export default function MessageList(props: MessageListProps) {
    return (
        <div className="message-list">

        </div>
    );
}

type MessageListProps = {
    channelId?: Nullable<string>,
    page?: Nullable<string>,
    pageCount?: Nullable<number>
};
