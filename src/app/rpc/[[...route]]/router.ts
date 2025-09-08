import { auth } from "./auth";
import { cards } from "./cards";

export const appRouter = { cards, auth };
export type AppRouter = typeof appRouter;
