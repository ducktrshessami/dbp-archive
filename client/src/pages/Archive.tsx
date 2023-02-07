import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChannelList from "../components/ChannelList";
import MessageContainer from "../components/MessageContainer";
import { getResolvedData, ResolvedData } from "../utils/api";
import "./Archive.css";

export default function Archive() {
    let channelId: Nullable<string> = null;
    let page: Nullable<string> = null;
    const location = useLocation();
    const navigate = useNavigate();
    const [resolvedData, setResolvedData] = useState<Nullable<ResolvedData>>(null);
    const hasRoute = /^\/.+$/.test(location.pathname);

    if (hasRoute) {
        const channelMatch = location.pathname.match(/^\/(?<channelId>\d+)(\/(?<page>\d+))?/);
        channelId = channelMatch?.groups!.channelId ?? null;
        page = channelMatch?.groups!.page ?? null;
    }

    useEffect(() => {
        if (resolvedData === null) {
            getResolvedData()
                .then(setResolvedData);
        }
        if (channelId && !page) {
            navigate(`/${channelId}/1`, { replace: true });
        }
        else if (hasRoute && !channelId && !page) {
            navigate("/", { replace: true });
        }
    }, [resolvedData, channelId, page, hasRoute, navigate]);

    return (
        <main className="archive">
            <ChannelList channels={resolvedData?.channels} selected={channelId} />
            <MessageContainer resolved={resolvedData} channelId={channelId} page={page} />
        </main>
    );
}
