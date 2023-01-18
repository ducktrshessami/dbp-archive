import { Dispatcher, request } from "undici";
import { RequestError } from "./error";

async function requestWrap(url: string | URL, options?: RequestOptions): Promise<Dispatcher.ResponseData> {
    const res = await request(url, options);
    if (res.statusCode < 400) {
        return res;
    }
    else {
        throw new RequestError(res.statusCode);
    }
}

type RequestOptions = { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, "origin" | "path" | "method"> & Partial<Pick<Dispatcher.RequestOptions, "method">>;
