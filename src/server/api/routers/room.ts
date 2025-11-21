import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { auth } from "@clerk/nextjs/server";

export const roomRouter = createTRPCRouter({
  // 1. Check if a room exists
  exists: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
        select: { id: true },
      });
      return !!room;
    }),

  // 2. Create Room
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await auth();
      if (!user.userId) throw new Error("Unauthorized");

      return ctx.db.room.create({
        data: {
          name: input.name,
          userId: user.userId,
        },
      });
    }),

  // 3. Get My Rooms
  getMyRooms: publicProcedure.query(async ({ ctx }) => {
    const user = await auth();
    if (!user.userId) return [];

    return ctx.db.room.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // 4. Delete Room
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await auth();
      if (!user.userId) throw new Error("Unauthorized");

      // Verify ownership before deleting
      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
      });

      if (!room || room.userId !== user.userId) {
        throw new Error("You do not have permission to delete this room");
      }

      return ctx.db.room.delete({
        where: { id: input.id },
      });
    }),

  // 5. Rename Room
  rename: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await auth();
      if (!user.userId) throw new Error("Unauthorized");

      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
      });

      if (!room || room.userId !== user.userId) {
        throw new Error("You do not have permission to rename this room");
      }

      return ctx.db.room.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
});