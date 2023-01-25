import { Navigate, useParams } from "react-router-dom";

export default function SelectRedirect() {
    const { channelId } = useParams<SelectRedirectParams>();
    return (
        <Navigate to={`/${channelId}/1`} replace={true} />
    );
}

type SelectRedirectParams = "channelId";
