"use client"; 
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  // publicApiKey: "", // We are using authEndpoint instead for security
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

type UserMeta = {
  id: string;
  info: {
    name: string;
    color: string;
    picture: string;
  };
};

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useSelf,
} = createRoomContext<Presence, {}, UserMeta, never>(client);