import { cards } from "./cards";
import { auth } from "./auth";

export const appRouter = { cards, auth };
export type AppRouter = typeof appRouter;
