import { ReactNode, useState } from "react";
import "./Spoiler.css";

export default function Spoiler(props: SpoilerProps) {
    const [revealed, setRevealed] = useState<boolean>(false);
    return (
        <span
            className={revealed ? "spoiler revealed" : "spoiler"}
            onClick={() => {
                if (!revealed) {
                    setRevealed(true);
                }
            }}
        >
            {props.children}
        </span>
    );
}

type SpoilerProps = { children?: ReactNode };
