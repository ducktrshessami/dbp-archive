import { Component } from "react";
import { ChannelData, getChannels } from "../../api";

export default class Archive extends Component<{}, ArchiveState> {
    async componentDidMount() {
        const channels = await getChannels();
        this.state = { channels };
    }

    render() {
        return (
            <main>

            </main>
        );
    }
}

type ArchiveState = {
    channels?: Map<string, ChannelData>,
    selected?: string
};
