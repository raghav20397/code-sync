import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { roomRouter } from "./routers/room"; // Import the new file

export const appRouter = createTRPCRouter({
  room: roomRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);