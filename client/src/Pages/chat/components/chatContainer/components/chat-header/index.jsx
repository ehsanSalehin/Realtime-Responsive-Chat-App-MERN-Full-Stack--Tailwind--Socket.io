import React from 'react';
import { useAppStore } from "@/store";
import { HOST } from "@/Utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { RiCloseCircleLine } from "react-icons/ri";
import { getColor } from "@/Utils/colors"; 

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  const avatarClass = "w-10 h-10 rounded-full";

  return (
    <div className="h-[10vh] border-b-2 border-[#5f67be] flex items-center px-20 justify-between">
      <div className="flex items-center gap-3">
        {
          selectedChatType==="contact"?
        }
        <Avatar className={avatarClass}>
          {selectedChatData?.image ? (
            <AvatarImage
              src={`${HOST}/${selectedChatData.image}`}
              alt="profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className={`uppercase w-full h-full flex items-center justify-center rounded-full text-[#12527a] text-lg font-bold ${
                getColor(selectedChatData?.color)
              }`}
            >
              {selectedChatData?.firstName ? selectedChatData.firstName.charAt(0) : selectedChatData?.email.charAt(0)}
            </div>
          )}
        </Avatar>
        <span>
          {selectedChatType === "contact" && (
            `${selectedChatData.firstName}${selectedChatData.lastName ? ` ${selectedChatData.lastName}` : ''}`
          )}
        </span>
      </div>
      <button className="text-neutral-500 focus:border-none focus:text-white duration-300 transition-all" onClick={closeChat}>
        <RiCloseCircleLine className="text-3xl" />
      </button>
    </div>
  );
};

export default ChatHeader;
