import { useState } from "react";

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
            dangerouslySetInnerHTML={{ __html: props.html }}
        />
    );
}

type SpoilerProps = { html: string };
