import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { appRouter } from "@/app/rpc/[[...route]]/router";

declare global {
	var $client: RouterClient<typeof appRouter> | undefined;
}

const link = new RPCLink({
	url: `${typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000")}/rpc`,
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return await headers();
	},
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof appRouter> =
	globalThis.$client ?? createORPCClient(link);
