import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChannelList from "../components/ChannelList";
import MessageListContainer from "../components/MessageListContainer";
import {
    ChannelData,
    getResolvedChannels,
    getResolvedMessageLinks,
    getResolvedRoles,
    getResolvedUsers,
    RoleData,
    UserData
} from "../utils/api";
import { ResolvedData } from "../utils/renderMessage";
import "./Archive.css";

export default function Archive() {
    let channelId: Nullable<string> = null;
    let page: Nullable<string> = null;
    const location = useLocation();
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Nullable<Map<string, ChannelData>>>(null);
    const [users, setUsers] = useState<Nullable<Map<string, UserData>>>(null);
    const [roles, setRoles] = useState<Nullable<Map<string, RoleData>>>(null);
    const [messageLinks, setMessageLinks] = useState<Nullable<Map<string, number>>>(null);
    const resolvedData: ResolvedData = {
        channels,
        users,
        roles,
        messageLinks
    };
    const hasRoute = /^\/.+$/.test(location.pathname);

    if (hasRoute) {
        const channelMatch = location.pathname.match(/^\/(?<channelId>\d+)(\/(?<page>\d+))?/);
        channelId = channelMatch?.groups!.channelId ?? null;
        page = channelMatch?.groups!.page ?? null;
    }

    useEffect(() => {
        if (
            channels === null &&
            users === null &&
            roles === null &&
            messageLinks === null
        ) {
            getResolvedChannels()
                .then(setChannels);
            getResolvedUsers()
                .then(setUsers);
            getResolvedRoles()
                .then(setRoles);
            getResolvedMessageLinks()
                .then(setMessageLinks);
        }
        if (channelId && !page) {
            navigate(`/${channelId}/1`, { replace: true });
        }
        else if (hasRoute && !channelId && !page) {
            navigate("/", { replace: true });
        }
    }, [
        channels,
        users,
        roles,
        messageLinks,
        channelId,
        page,
        hasRoute,
        navigate
    ]);

    return (
        <main className="archive">
            <ChannelList channels={channels} selected={channelId} />
            <MessageListContainer resolved={resolvedData} channelId={channelId} page={page} />
        </main>
    );
}
