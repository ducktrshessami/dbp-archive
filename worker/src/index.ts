export interface Env {
    DESTINATION: string;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const source = new URL(request.url);
        const destination = new URL(env.DESTINATION);
        destination.pathname += source.pathname;
        destination.search = source.search;
        destination.hash = source.hash;
        const redirect = new Request(destination.toString(), request);
        return fetch(redirect);
    },
};
