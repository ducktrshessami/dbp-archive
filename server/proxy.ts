import { connect } from "ngrok";
import {
    Dispatcher,
    FormData,
    request
} from "undici";
import { CF_KEY, PORT } from "./constants";
import { RequestError } from "./error";

const WRITE_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT}/storage/kv/namespaces/${process.env.CF_NAMESPACE}/values/${CF_KEY}`;

async function requestWrap(url: string | URL, options?: RequestOptions): Promise<Dispatcher.ResponseData> {
    const res = await request(url, options);
    if (res.statusCode < 400) {
        return res;
    }
    else {
        throw new RequestError(res.statusCode);
    }
}

async function storeProxyUrl(url: string): Promise<void> {
    const data = new FormData();
    data.set("value", url);
    data.set("metadata", `{"timestamp":${Date.now()}}`);
    await requestWrap(WRITE_ENDPOINT, {
        method: "PUT",
        headers: { authorization: `Bearer ${process.env.CF_TOKEN}` },
        body: data
    });
}

export async function proxy(): Promise<void> {
    const url = await connect({
        authtoken: process.env.NGROK_TOKEN,
        addr: PORT,
        onLogEvent: console.debug
    });
    await storeProxyUrl(url);
    console.log(`[proxy] Proxied port ${PORT} to ${url}`);
}

export function proxyReady(): boolean {
    return !!process.env.NGROK_TOKEN && !!process.env.CF_TOKEN && !!process.env.CF_ACCOUNT && !!process.env.CF_NAMESPACE;
}

type RequestOptions = { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, "origin" | "path" | "method"> & Partial<Pick<Dispatcher.RequestOptions, "method">>;
