import { UserData } from "./api";

export default function userTag(user?: UserData): string {
    return user ? user.username : "Unknown User";
}
