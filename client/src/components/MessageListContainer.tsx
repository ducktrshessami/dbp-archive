import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChannelPage, MessageData } from "../utils/api";
import { ResolvedData, ResolvedMessageData } from "../utils/renderMessage";
import MessageList from "./MessageList";
import MessagePagination, { MessagePaginationProps } from "./MessagePagination";
import "./MessageListContainer.css";

function renderMessagePagination(channelSelected: boolean, props: MessagePaginationProps) {
    if (channelSelected) {
        return (
            <MessagePagination
                top={props.top}
                page={props.page}
                pageCount={props.pageCount}
                channelId={props.channelId}
            />
        );
    }
    else {
        return null;
    }
}

export default function MessageListContainer(props: MessageListContainerProps) {
    const navigate = useNavigate();
    const [fetchedData, setFetchedData] = useState<Nullable<FetchedData>>(null);
    const selectedChannel = props.resolved?.channels?.get(props.channelId!);
    const channelSelected = !!props.channelId;
    const page = parseInt(props.page!);
    const ready = !!props.resolved &&
        fetchedData?.channelId === props.channelId &&
        fetchedData?.page === page;
    const paginationProps: Omit<MessagePaginationProps, "top"> = {
        page,
        pageCount: selectedChannel?.pages,
        channelId: props.channelId
    };
    const resolvedData: ResolvedMessageData = {
        ...props.resolved,
        messages: fetchedData?.messages
    };

    useEffect(() => {
        if (
            props.channelId &&
            props.page &&
            (fetchedData?.channelId !== props.channelId || fetchedData?.page !== page)
        ) {
            (async function () {
                if (isNaN(page) || page.toString() !== props.page) {
                    navigate("/", { replace: true });
                    return;
                }
                try {
                    setFetchedData(null);
                    const data = await getChannelPage(props.channelId!, page);
                    setFetchedData({
                        page,
                        channelId: props.channelId,
                        messages: data
                    });
                }
                catch (err) {
                    console.error(err);
                    navigate("/", { replace: true });
                }
            })();
        }
    });

    return (
        <div className="message-list-container">
            {renderMessagePagination(channelSelected, {
                ...paginationProps,
                top: true
            })}
            <MessageList
                channelSelected={channelSelected}
                ready={ready}
                resolved={resolvedData}
            />
            {renderMessagePagination(channelSelected, {
                ...paginationProps,
                top: false
            })}
        </div>
    );
}

type MessageListContainerProps = {
    resolved?: Nullable<ResolvedData>,
    channelId?: Nullable<string>,
    page?: Nullable<string>
};

type FetchedData = {
    channelId?: Nullable<string>,
    page?: Nullable<number>,
    messages?: Nullable<Array<MessageData>>
};
