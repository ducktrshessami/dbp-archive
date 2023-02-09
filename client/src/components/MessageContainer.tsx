import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getChannelPage,
    MessageData,
    ResolvedData
} from "../utils/api";
import MessageList from "./MessageList";
import MessagePagination, { MessagePaginationProps } from "./MessagePagination";
import "./MessageContainer.css";
import { ResolvedMessageData } from "../utils/renderMessage";

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

export default function MessageContainer(props: MessageContainerProps) {
    const navigate = useNavigate();
    const [fetchedData, setFetchedData] = useState<Nullable<FetchedData>>(null);
    const selectedChannel = props.resolved?.channels.find(channel => channel.id === props.channelId);
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
                    navigate("/");
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
                    navigate("/");
                }
            })();
        }
    });

    return (
        <div className="message-container">
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

type MessageContainerProps = {
    resolved?: Nullable<ResolvedData>,
    channelId?: Nullable<string>,
    page?: Nullable<string>
};

type FetchedData = {
    channelId?: Nullable<string>,
    page?: Nullable<number>,
    messages?: Nullable<Array<MessageData>>
};
