import ReactPaginate from "react-paginate";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import "./MessagePagination.css";

function renderPagination(navigate: NavigateFunction, props: MessagePaginationProps) {
    if (props.page && props.pageCount) {
        return (
            <ReactPaginate
                className="centered-box"
                forcePage={props.page - 1}
                pageCount={props.pageCount}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                pageClassName="page"
                pageLinkClassName="page-link"
                activeClassName="selected"
                ariaLabelBuilder={i => `Page ${i}`}
                previousLabel="ᐸ"
                previousClassName="page increment"
                previousLinkClassName="page-link"
                nextLabel="ᐳ"
                nextClassName="page increment"
                nextLinkClassName="page-link"
                breakClassName="page-break"
                hrefBuilder={i => `/${props.channelId}/${i}`}
                onPageChange={({ selected }) => navigate(`/${props.channelId}/${selected + 1}`)}
            />
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
    const navigate = useNavigate();
    return (
        <div className={props.top ? "message-pagination top" : "message-pagination bottom"}>
            {renderPagination(navigate, props)}
        </div>
    );
}

export type MessagePaginationProps = {
    top: boolean
    page?: Nullable<number>,
    pageCount?: Nullable<number>,
    channelId?: Nullable<string>
};
