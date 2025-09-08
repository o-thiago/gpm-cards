"use server";

import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "./router";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = new RPCHandler(appRouter);

async function handleRequest(request: Request) {
	const session = await getServerSession(authOptions);
	const { response } = await handler.handle(request, {
		prefix: "/rpc",
		context: {
			session,
		},
	});

	return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
