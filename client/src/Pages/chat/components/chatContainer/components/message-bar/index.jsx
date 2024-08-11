import { useEffect, useRef, useState } from "react";
import { RiAttachmentLine, RiEmojiStickerLine } from "react-icons/ri";
import { GrSend } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/Utils/constants";

const MessageBar = () => {
  const fileInputRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, addMessage, setIsUploading, setFileUploadProgress } = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const [emojiPicker, setEmojiPicker] = useState(false);

  const handleEmoji = (emojiObject) => {
    setMessage((prevMsg) => prevMsg + emojiObject.emoji);
    setEmojiPicker(false);
  };

  const handleSendMessage = () => {
    if (!socket) {
      console.error("Socket is not available");
      return;
    }

    if (selectedChatType === "contact") {
      const messageData = {
        sender: userInfo?.id,
        content: message,
        recipent: selectedChatData?._id,
        messageType: "text",
        fileUrl: undefined,
      };
      socket.emit("sendMessage", messageData);
      addMessage(messageData);
      setMessage("");
    } else if (selectedChatType === "group") {
      const messageData = {
        sender: userInfo?.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        groupId: selectedChatData?._id,
      };
      socket.emit("send-group-message", messageData);
      addMessage(messageData);
      setMessage("");
    }
  };

  const handleAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("recipentId", selectedChatData._id);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        if (res.status === 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            const messageData = {
              sender: userInfo?.id,
              content: undefined,
              recipent: selectedChatData?._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            };
            socket.emit("sendMessage", messageData);
            addMessage(messageData);
            setMessage("");
          } else if (selectedChatType === "group") {
            const messageData = {
              sender: userInfo?.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              groupId: selectedChatData?._id,
            };
            socket.emit("send-group-message", messageData);
            addMessage(messageData);
            setMessage("");
          }
        }
      }
      console.log({ file });
    } catch (err) {
      setIsUploading(false);
      console.log(err);
    }
  };

  return (
    <div className="h-[10vh] bg-[#8FD4D0] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 bg-[#d9f7f1] rounded-md flex items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none font-bold text-purple-800"
          placeholder="Enter Your Message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500" onClick={handleAttachment}>
          <RiAttachmentLine className="text-2xl mb-1" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button onClick={() => setEmojiPicker(!emojiPicker)}>
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPicker && (
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker theme="light" onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-[#5ae7bf] rounded-md flex items-center justify-center p-4 hover:bg-[#1de8ae]"
        onClick={handleSendMessage}
      >
        <GrSend className="text-2xl mb-1" />
      </button>
    </div>
  );
};

export default MessageBar;
