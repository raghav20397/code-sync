"use client";

import { useOthers, useSelf } from "@/liveblocks.config";

export default function ActiveUsers() {
  const others = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = others.length > 3;

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex -space-x-2 overflow-hidden p-1">
        {/* render all users*/}
        {others.slice(0, 3).map(({ connectionId, info }) => {
          return (
            <Avatar
              key={connectionId}
              name={info.name}
              picture={info.picture}
              color={info.color}
            />
          );
        })}

        {/*counter if many */}
        {hasMoreUsers && (
          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#121212] bg-[#2f2f2f] text-xs font-semibold text-white">
            +{others.length - 3}
          </div>
        )}

        {/* we are always visible */}
        {currentUser && (
          <div className="relative ml-1">
            <Avatar
              name="You"
              picture={currentUser.info.picture}
              color={currentUser.info.color}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ name, picture, color }: { name: string; picture: string; color: string }) {
  return (
    <div 
      className="relative h-8 w-8 rounded-full border-2 border-[#121212] transition-transform hover:scale-110 hover:z-50"
      title={name}
      style={{ backgroundColor: color }} 
    >
      {/* if image is availablee, else colour*/}
      <img
        src={picture}
        alt={name}
        className="h-full w-full rounded-full object-cover"
        onError={(e) => {
          // if fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}