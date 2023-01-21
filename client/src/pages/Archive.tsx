import { Component } from "react";
import ChannelList from "../components/ChannelList";
import { ChannelData, getChannels } from "../utils/api";

export default class Archive extends Component<{}, ArchiveState> {
    async componentDidMount() {
        const channels = await getChannels();
        this.setState({ channels });
    }

    render() {
        const channelArray = this.state?.channels ? Array.from(this.state.channels.values()) : null;
        return (
            <main>
                <ChannelList channels={channelArray} selected={this.state?.selected} />
            </main>
        );
    }
}

type ArchiveState = {
    channels?: Map<string, ChannelData>,
    selected?: string
};
