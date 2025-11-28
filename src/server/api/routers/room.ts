import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { auth } from "@clerk/nextjs/server";

//goruping public API endpoints
export const roomRouter = createTRPCRouter({
// checking if room exists already,using zod, GET
  exists: publicProcedure.input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
        select: { id: true },
      });
      return !!room;
    }),

// creating new room, with input santitation using zod, POST
    create: publicProcedure.input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await auth();
      if (!user.userId) throw new Error("Unauthorized, please try again!");

      return ctx.db.room.create({
        data: {
          name: input.name,
          userId: user.userId,
        },
      });
    }),
  checkName: publicProcedure
  .query(async ({ ctx }) =>{
      const user = await auth();
      if(!user.userId) return [];
      return ctx.db.room.findMany({
        where: {
          name: user.userId,
        },
        orderBy:{
          name: "desc",
        }
      });
    }),
// get rooms
  getMyRooms: publicProcedure
  .query(async ({ ctx }) => {
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
// delete room
  delete: publicProcedure.input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await auth();
      if (!user.userId) throw new Error("Unauthorized");

// only delete if owner is deleting
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

// rename room
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