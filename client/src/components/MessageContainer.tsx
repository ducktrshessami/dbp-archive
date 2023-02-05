import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChannelPage, MessagesData } from "../utils/api";
import MessageList from "./MessageList";
import MessagePagination, { MessagePaginationProps } from "./MessagePagination";
import "./MessageContainer.css";

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
    const [messageData, setMessagedata] = useState<Nullable<MessagesData>>(null);
    const [fetchedChannel, setFetchedChannel] = useState<Nullable<string>>(null);
    const [fetchedPage, setFetchedPage] = useState<Nullable<number>>(null);
    const channelSelected = !!props.channelId;
    const page = parseInt(props.page!);
    const ready = fetchedChannel === props.channelId && fetchedPage === page;
    const paginationProps: Omit<MessagePaginationProps, "top"> = {
        page,
        pageCount: props.pageCount,
        channelId: props.channelId
    };

    useEffect(() => {
        if (
            props.channelId &&
            props.page &&
            (fetchedChannel !== props.channelId || fetchedPage !== page)
        ) {
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
        <div className="message-container">
            {renderMessagePagination(channelSelected, {
                ...paginationProps,
                top: true
            })}
            <MessageList
                channelSelected={channelSelected}
                ready={ready}
                messageData={messageData}
            />
            {renderMessagePagination(channelSelected, {
                ...paginationProps,
                top: false
            })}
        </div>
    );
}

type MessageContainerProps = {
    channelId?: Nullable<string>,
    page?: Nullable<string>,
    pageCount?: Nullable<number>
};
