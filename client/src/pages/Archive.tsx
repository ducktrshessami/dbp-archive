import { useEffect, useState } from "react";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import { ChannelData, getChannels } from "../utils/api";

export default function Archive() {
    const [channels, setChannels] = useState<Nullable<Array<ChannelData>>>(null);
    const [selected, setSelected] = useState<Nullable<string>>(null);

    useEffect(() => {
        if (channels === null) {
            (async function init() {
                setChannels(await getChannels());
            })();
        }
    });

    return (
        <main>
            <ChannelList channels={channels} selected={selected} />
            <MessageList />
        </main>
    );
}
