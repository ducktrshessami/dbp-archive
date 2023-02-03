import { BeatLoader } from "react-spinners";
import { ChannelData } from "../utils/api";
import Channel from "./Channel";
import "./ChannelList.css";

function renderChannelList(props: ChannelListProps) {
    if (props.channels) {
        const channels = props.channels.map(channel =>
            <Channel
                key={channel.id}
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
            <div className="centered-box">
                <BeatLoader color="#8A9A5B" size="1.25rem" />
            </div>
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
