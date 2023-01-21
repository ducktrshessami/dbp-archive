import { BeatLoader } from "react-spinners";
import { ChannelData } from "../utils/api";
import "./ChannelList.css";

function renderChannelList(props: ChannelListProps) {
    if (props.channels) {
        return (
            <div>

            </div>
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
