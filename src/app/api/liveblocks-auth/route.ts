import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

// initialize livebloc server sdk
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
//  curr user from clerk
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

// get room enetered by user
  const { room } = await request.json();

  //start an authenticated session
  const session = liveblocks.prepareSession(
    clerkUser.id,
    {
      userInfo: {
        name: clerkUser.firstName || "Anonymous",
        picture: clerkUser.imageUrl,
        color: "#" + Math.floor(Math.random()*16777215).toString(16), // any random color
      },
    }
  );

  // Give the user full access to the room
  session.allow(room, session.FULL_ACCESS);

  // Authorize
  const { status, body } = await session.authorize();
  return new NextResponse(body, { status });
}