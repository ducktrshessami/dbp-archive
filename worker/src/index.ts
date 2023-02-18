export interface Env {
    RRP: KVNamespace;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        _: ExecutionContext
    ): Promise<Response> {
        const KV_DESTINATION = await env.RRP.getWithMetadata<KvDestinationMetadata>("DBP_ARCHIVE", { type: "text" });
        if (KV_DESTINATION.value && KV_DESTINATION.metadata) {
            try {
                const source = new URL(request.url);
                const destination = new URL(KV_DESTINATION.value);
                destination.pathname = destination.pathname === "/" ? source.pathname : destination.pathname + source.pathname;
                destination.search = source.search;
                destination.hash = source.hash;
                const redirect = new Request(destination.toString(), request);
                redirect.headers.set("ngrok-skip-browser-warning", "foobar");
                return await fetch(redirect);
            }
            catch {
                const timestamp = new Date(KV_DESTINATION.metadata.timestamp);
                return new Response(`Redirect failed. Last destination set at ${timestamp.toISOString()}`, { status: 502 });
            }
        }
        else {
            return new Response("Redirect destination not set", { status: 404 });
        }
    },
};

type KvDestinationMetadata = { timestamp: number };
