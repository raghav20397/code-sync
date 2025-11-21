import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

// Initialize Liveblocks server SDK
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  // Get the current user from Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the room the user is trying to join
  const { room } = await request.json();

  // Start an auth session
  const session = liveblocks.prepareSession(
    clerkUser.id,
    {
      userInfo: {
        name: clerkUser.firstName || "Anonymous",
        picture: clerkUser.imageUrl,
        color: "#" + Math.floor(Math.random()*16777215).toString(16), // Random color
      },
    }
  );

  // Give the user full access to the room
  session.allow(room, session.FULL_ACCESS);

  // Authorize
  const { status, body } = await session.authorize();
  return new NextResponse(body, { status });
}