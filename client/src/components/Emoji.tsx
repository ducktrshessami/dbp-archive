import "./Emoji.css";

export default function Emoji(props: EmojiProps) {
    return (
        <i className={props.solo ? "emoji solo" : "emoji"} meta-emoji-id={props.id} />
    );
}

type EmojiProps = {
    id: string,
    solo: boolean
};
