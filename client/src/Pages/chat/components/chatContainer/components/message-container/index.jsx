import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/Utils/constants";
import { TbFileZip } from "react-icons/tb";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import { IoChevronBackCircleOutline } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatMessages, setSelectedChatMessages, userInfo, selectedChatType, selectedChatData, setIsDownloading, setFileDownloadProgress } = useAppStore();

  // State for image overlay
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true });
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (selectedChatData && selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // Check if the file is an image
  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic)$/i;
    return imageRegex.test(filePath);
  };

  const downloadF = async (url) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const res = await apiClient.get(`${HOST}/${url}`, { responseType: "blob",  onDownloadProgress:(ProgressEvent)=>{const{loaded, total}=ProgressEvent;
      const percentage = Math.round((loaded*100)/total);
      setFileDownloadProgress(percentage);
    },});
      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {renderDirectMessages(message)}
        </div>
      );
    });
  };

  const renderDirectMessages = (message) => {
    const isSender = message.sender === userInfo.id || message.sender._id === userInfo.id;

    return (
      <div className={`${isSender ? "text-right" : "text-left"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isSender
                ? "bg-[#26a1c3] text-white border-white/20"
                : "bg-[#9785ff] text-white/90 border-white/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div className={`${isSender ? "bg-[#26a1c3] text-white" : "bg-[#9785ff] text-white/90"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {checkImage(message.fileUrl) ? (
              <div className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="Uploaded file" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black rounded-full">
                  <TbFileZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
              </div>
            )}
            <div className="flex justify-center mt-2">
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadF(message.fileUrl)}>
                <HiOutlineDocumentArrowDown />
              </span>
            </div>
          </div>
        )}
        <div className="text-xs text-gray-600">{moment(message.timestamp).format("LT")}</div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[78vw] xl-[88vw]">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center flex-col backdrop-blur-lg bg-black/70">
          <IoChevronBackCircleOutline
            className="absolute top-4 left-4 text-white text-4xl cursor-pointer"
            onClick={() => setShowImage(false)}
          />
          <img
            src={`${HOST}/${imageUrl}`}
            alt="Large view"
            className="h-auto w-auto max-h-[95vh] max-w-[95vw] object-contain" 
          />
          <span className="bg-white/20 p-3 text-2xl rounded-full hover:bg-white/50 cursor-pointer transition-all duration-100 mt-2"
            onClick={() => downloadF(imageUrl)}>
            <HiOutlineDocumentArrowDown />
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;