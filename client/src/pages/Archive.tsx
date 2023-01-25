import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import { ChannelData, getChannels } from "../utils/api";
import "./Archive.css";

export default function Archive() {
    const { channelId, page } = useParams<ArchiveParams>();
    const [channels, setChannels] = useState<Nullable<Array<ChannelData>>>(null);
    const [pageCount, setPageCount] = useState<Nullable<number>>(null);

    useEffect(() => {
        if (channels === null) {
            getChannels()
                .then(setChannels);
        }
        else if (channelId) {
            const selected = channels.find(channel => channel.id === channelId);
            setPageCount(selected?.pages ?? null);
        }
    }, [channels, channelId]);

    return (
        <main className="archive">
            <ChannelList channels={channels} selected={channelId} />
            <MessageList channelId={channelId} page={page} pageCount={pageCount} />
        </main>
    );
}

type ArchiveParams = "channelId" | "page";
