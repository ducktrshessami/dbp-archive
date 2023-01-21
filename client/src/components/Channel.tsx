import "./Channel.css";

export default function Channel(props: ChannelProps) {
    return (
        <li className="channel"># {props.name}</li>
    );
}

type ChannelProps = {
    id: string,
    name: string,
    selected: boolean
};
