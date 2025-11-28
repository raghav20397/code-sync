"use client";

import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useParams } from "next/navigation"; 
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Share2, Terminal, Loader2 } from "lucide-react"; 
import ActiveUsers from "@/components/ActiveUsers"; 

// import editor dynamcally
const CollaborativeEditor = dynamic(
  () => import("@/components/CollaborativeEditor"),
  { ssr: false }
);

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    // use h-screen and overflow-hidden to ensure the editor fits the window exactly
    <main className="flex h-screen flex-col bg-black text-white overflow-hidden">
      
      <header className="flex justify-between items-center p-4 border-b border-gray-800 h-16 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft size={20} />
            {/* codesync logo with lucide */}
            <Terminal className="text-blue-500" size={20} />
            <span className="font-bold hidden md:block">CodeSync</span>
          </Link>
          
          <div className="h-6 w-px bg-gray-800 mx-2 hidden md:block"></div>

          <h1 className="text-sm md:text-base font-medium text-gray-400 flex items-center gap-2">
            Room: <span className="text-white font-mono bg-gray-900 px-2 py-1 rounded">{roomId}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <SignedIn>
             {/* stack for aciv users */}
             <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
                <ClientSideSuspense fallback={null}>
                  {() => <ActiveUsers />}
                </ClientSideSuspense>
             </RoomProvider>

             <button 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition font-medium"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Room URL copied to clipboard!");
                }}
             >
                <Share2 size={16} />
                Share
             </button>
          </SignedIn>
          
          <SignedOut>
             <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </header>

      
      {/* flex-1  automatically taking up all height */}
      <div className="flex-1 overflow-hidden relative">
        <SignedIn>
          <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
            <ClientSideSuspense fallback={
              <div className="flex items-center justify-center h-full text-gray-500 gap-2">
                 <Loader2 className="animate-spin" /> Loading editor...
              </div>
            }>
              {() => <CollaborativeEditor />}
            </ClientSideSuspense>
          </RoomProvider>
        </SignedIn>
        
        <SignedOut>
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-gray-400">Please sign in to join this room.</p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 text-white font-medium">
                Sign In to Join
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}