import { BeatLoader } from "react-spinners";
import { ChannelData } from "../utils/api";
import Channel from "./Channel";
import "./ChannelList.css";

function renderChannelList(props: ChannelListProps) {
    if (props.channels) {
        const channels = props.channels.map(channel =>
            <Channel
                id={channel.id}
                name={channel.name}
                selected={channel.id === props.selected}
            />
        );
        return (
            <ul>
                {channels}
            </ul>
        );
    }
    else {
        return (
            <BeatLoader />
        );
    }
}

export default function ChannelList(props: ChannelListProps) {
    return (
        <div className="channel-list">
            {renderChannelList(props)}
        </div>
    );
}

type ChannelListProps = {
    channels?: Nullable<Array<ChannelData>>,
    selected?: Nullable<string>
};
