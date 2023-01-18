export interface Env {
    // Example KV binding
    KV_NAMESPACE: KVNamespace;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        _: ExecutionContext
    ): Promise<Response> {
        // Example KV key
        const KV_DESTINATION = await env.KV_NAMESPACE.get("DESTINATION", { type: "text" });
        if (KV_DESTINATION) {
            const source = new URL(request.url);
            const destination = new URL(KV_DESTINATION);
            destination.pathname += source.pathname;
            destination.search = source.search;
            destination.hash = source.hash;
            const redirect = new Request(destination.toString(), request);
            return fetch(redirect);
        }
        else {
            return new Response("Redirect destination not set", { status: 404 });
        }
    },
};
