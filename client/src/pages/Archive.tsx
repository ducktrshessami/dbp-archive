import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageContainer";
import { ChannelData, getChannels } from "../utils/api";
import "./Archive.css";

export default function Archive() {
    let channelId: Nullable<string> = null;
    let page: Nullable<string> = null;
    const location = useLocation();
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Nullable<Array<ChannelData>>>(null);
    const [pageCount, setPageCount] = useState<Nullable<number>>(null);
    const hasRoute = /^\/.+$/.test(location.pathname);

    if (hasRoute) {
        const channelMatch = location.pathname.match(/^\/(?<channelId>\d+)(\/(?<page>\d+))?/);
        channelId = channelMatch?.groups!.channelId ?? null;
        page = channelMatch?.groups!.page ?? null;
    }

    useEffect(() => {
        if (channels === null) {
            getChannels()
                .then(setChannels);
        }
        else if (channelId) {
            const selected = channels.find(channel => channel.id === channelId);
            setPageCount(selected?.pages ?? null);
        }
        if (channelId && !page) {
            navigate(`/${channelId}/1`, { replace: true });
        }
        else if (hasRoute && !channelId && !page) {
            navigate("/", { replace: true });
        }
    }, [channels, channelId, page, hasRoute, navigate]);

    return (
        <main className="archive">
            <ChannelList channels={channels} selected={channelId} />
            <MessageList channelId={channelId} page={page} pageCount={pageCount} />
        </main>
    );
}
