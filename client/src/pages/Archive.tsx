import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChannelList from "../components/ChannelList";
import MessageListContainer from "../components/MessageListContainer";
import {
    ChannelData,
    getChannels,
    getResolvedData,
    ResolvedData
} from "../utils/api";
import { ResolvedMessageData } from "../utils/renderMessage";
import "./Archive.css";

export default function Archive() {
    let channelId: Nullable<string> = null;
    let page: Nullable<string> = null;
    const location = useLocation();
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Nullable<Map<string, ChannelData>>>(null);
    const [resolved, setResolved] = useState<Nullable<ResolvedData>>(null);
    const resolvedMessageData: ResolvedMessageData = {
        ...resolved,
        channels
    };
    const hasRoute = /^\/.+$/.test(location.pathname);

    if (hasRoute) {
        const channelMatch = location.pathname.match(/^\/(?<channelId>\d+)(\/(?<page>\d+))?/);
        channelId = channelMatch?.groups!.channelId ?? null;
        page = channelMatch?.groups!.page ?? null;
    }

    useEffect(() => {
        if (channels === null && resolved === null) {
            getChannels()
                .then(setChannels);
            getResolvedData()
                .then(setResolved);
        }
        if (channelId && !page) {
            navigate(`/${channelId}/1`, { replace: true });
        }
        else if (hasRoute && !channelId && !page) {
            navigate("/", { replace: true });
        }
    }, [
        channels,
        resolved,
        channelId,
        page,
        hasRoute,
        navigate
    ]);

    return (
        <main className="archive">
            <ChannelList channels={channels} selected={channelId} />
            <MessageListContainer resolved={resolvedMessageData} channelId={channelId} page={page} />
        </main>
    );
}
