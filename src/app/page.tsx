"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Plus, Code2, Terminal, Loader2, ExternalLink, LogIn, Trash2, Pencil } from "lucide-react";
import { api } from "@/trpc/react"; 
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const utils = api.useUtils();
  
  const { data: rooms, isLoading, refetch } = api.room.getMyRooms.useQuery();

  const createRoomMutation = api.room.create.useMutation({
    onSuccess: (room: { id: string }) => {
      router.push(`/room/${room.id}`);
    },
  });

  const deleteRoomMutation = api.room.delete.useMutation({
    onSuccess: () => {
      refetch(); // Refresh the list after deletion
    },
  });

  const renameRoomMutation = api.room.rename.useMutation({
    onSuccess: () => {
      refetch(); // Refresh the list after rename
    },
  });

  const handleCreateRoom = () => {
    createRoomMutation.mutate({ name: "Untitled Project" });
  };

  const handleDelete = (e: React.MouseEvent, roomId: string) => {
    e.preventDefault(); // Prevent clicking the link
    if (confirm("Are you sure you want to delete this room? This cannot be undone.")) {
      deleteRoomMutation.mutate({ id: roomId });
    }
  };

  const handleRename = (e: React.MouseEvent, roomId: string, currentName: string) => {
    e.preventDefault(); // Prevent clicking the link
    const newName = prompt("Enter new room name:", currentName);
    if (newName && newName !== currentName) {
      renameRoomMutation.mutate({ id: roomId, name: newName });
    }
  };

  const handleJoinRoom = async () => {
    if (!joinId) return;
    setIsJoining(true);

    try {
      const exists = await utils.room.exists.fetch({ id: joinId });
      if (exists) {
        router.push(`/room/${joinId}`);
      } else {
        alert("Room not found! Check the ID and try again.");
        setIsJoining(false);
      }
    } catch (error) {
      console.error(error);
      setIsJoining(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#0d1117] text-white">
      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal className="text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">CodeSync</h1>
        </div>
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
             <SignInButton mode="modal">
                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Sign In</button>
             </SignInButton>
          </SignedOut>
        </div>
      </header>

      <div className="flex-1 container mx-auto p-8">
        <div className="flex flex-col items-center justify-center mb-16 text-center space-y-8">
          <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Real-time Code Collaboration
          </h2>
          
          <SignedIn>
            <div className="flex flex-col md:flex-row gap-6 items-stretch w-full max-w-2xl">
              {/* Create Room Card */}
              <div className="flex-1 bg-gray-800/30 p-6 rounded-xl border border-gray-700 flex flex-col items-center gap-4 hover:border-blue-500/50 transition">
                 <div className="bg-blue-900/20 p-3 rounded-full text-blue-400">
                    <Plus size={24} />
                 </div>
                 <h3 className="text-lg font-semibold">Start a New Project</h3>
                 <button 
                    onClick={handleCreateRoom}
                    disabled={createRoomMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {createRoomMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Room"}
                  </button>
              </div>

              <div className="hidden md:flex items-center justify-center text-gray-600 font-bold">OR</div>

              {/* Join Room Card */}
              <div className="flex-1 bg-gray-800/30 p-6 rounded-xl border border-gray-700 flex flex-col items-center gap-4 hover:border-purple-500/50 transition">
                 <div className="bg-purple-900/20 p-3 rounded-full text-purple-400">
                    <LogIn size={24} />
                 </div>
                 <h3 className="text-lg font-semibold">Join Existing Room</h3>
                 <div className="flex w-full gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter Room ID..." 
                      value={joinId}
                      onChange={(e) => setJoinId(e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button 
                      onClick={handleJoinRoom}
                      disabled={isJoining || !joinId}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isJoining ? <Loader2 className="animate-spin w-5 h-5" /> : "Join"}
                    </button>
                 </div>
              </div>
            </div>
          </SignedIn>
        </div>

        {/* Room List Section */}
        <SignedIn>
          <div className="max-w-4xl mx-auto border-t border-gray-800 pt-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Code2 className="text-gray-400" /> 
              Your Created Rooms
            </h3>
            
            {isLoading ? (
               <div className="text-gray-500 text-center py-10">Loading your rooms...</div>
            ) : rooms?.length === 0 ? (
               <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
                 No rooms yet. Create one above!
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms?.map((room) => (
                  <Link 
                    key={room.id} 
                    href={`/room/${room.id}`}
                    className="block p-6 bg-gray-800/40 border border-gray-800 rounded-xl hover:border-blue-500/50 transition group relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-blue-400 transition">{room.name}</h4>
                        <p className="text-sm text-gray-500">Created {new Date(room.createdAt).toLocaleDateString()}</p>
                        <span className="text-xs text-gray-600 font-mono mt-1 block">ID: {room.id}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleRename(e, room.id, room.name)}
                          className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                          title="Rename"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, room.id)}
                          className="p-2 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </SignedIn>
      </div>
    </main>
  );
}