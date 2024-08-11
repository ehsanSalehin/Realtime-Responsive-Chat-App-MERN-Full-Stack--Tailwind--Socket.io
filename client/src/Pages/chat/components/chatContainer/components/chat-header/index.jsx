import { useAppStore } from "@/store";
import { HOST } from "@/Utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { RiCloseCircleLine } from "react-icons/ri";
import { getColor } from "@/Utils/colors"; 

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  const avatarClass = "w-10 h-10 rounded-full";

  return (
    <div className="h-[10vh] border-b-2 border-gray-300 flex items-center px-4 justify-between bg-[#cec7ea] shadow-md text-black">
        <div className="flex items-center gap-3">
            {selectedChatType === "contact" ? (
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
                                selectedChatData?.color ? getColor(selectedChatData.color) : ""
                            }`}
                        >
                            {selectedChatData?.firstName
                                ? selectedChatData.firstName.charAt(0)
                                : selectedChatData?.email.charAt(0)}
                        </div>
                    )}
                </Avatar>
            ) : (
                <div className="bg-[#e7e6d5] h-10 w-10 flex items-center justify-center rounded-full text-black">
                    +
                </div>
            )}
<span>
  {selectedChatType === "group" && selectedChatData.name}
  {selectedChatType === "contact" && selectedChatData.firstName ? 
    `${selectedChatData.firstName} ${selectedChatData.lastName}` : 
    selectedChatData.lastName}
</span>
        </div>
        <button
        className="text-gray-500 hover:text-red-500 transition-all duration-300"
        onClick={closeChat}
      >
            <RiCloseCircleLine className="text-3xl" />
        </button>
    </div>
);
};

export default ChatHeader;