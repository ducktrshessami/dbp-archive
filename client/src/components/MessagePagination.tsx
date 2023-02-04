import { BeatLoader } from "react-spinners";
import "./MessagePagination.css";

function renderPagination(page?: Nullable<number>, pageCount?: Nullable<number>) {
    if (page && pageCount) {
        return (
            <div>

            </div>
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

export default function MessagePagination(props: MessagePaginationProps) {
    return (
        <div className="message-pagination">
            {renderPagination(props.page, props.pageCount)}
        </div>
    );
}

type MessagePaginationProps = {
    page?: Nullable<number>,
    pageCount?: Nullable<number>
};
