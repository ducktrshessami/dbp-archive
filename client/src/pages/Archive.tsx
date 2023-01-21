import { Component } from "react";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import { ChannelData, getChannels } from "../utils/api";

export default class Archive extends Component<{}, ArchiveState> {
    async componentDidMount() {
        const channels = await getChannels();
        this.setState({ channels });
    }

    render() {
        return (
            <main>
                <ChannelList channels={this.state?.channels} selected={this.state?.selected} />
                <MessageList />
            </main>
        );
    }
}

type ArchiveState = {
    channels?: Nullable<Array<ChannelData>>,
    selected?: Nullable<string>
};
