import { Link } from "react-router-dom";
import "./Channel.css";

export default function Channel(props: ChannelProps) {
    return (
        <li className={props.selected ? "channel selected" : "channel"}>
            <Link className="channel-link" to={props.selected ? "#" : `/${props.id}`}># {props.name}</Link>
        </li>
    );
}

type ChannelProps = {
    id: string,
    name: string,
    selected: boolean
};
