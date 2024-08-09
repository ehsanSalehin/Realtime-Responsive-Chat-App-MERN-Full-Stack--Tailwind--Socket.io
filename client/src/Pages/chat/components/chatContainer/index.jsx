import ChatHeader from "./components/chat-header"
import MessageBar from "./components/message-bar"
import MessageContainer from "./components/message-container"

const ChatContainer = () => {
  return (
    <div className='fixed top-0 h-[100] w-[100vw] bg-[#8FD4D0] flex flex-col md:static md:flex-1'>
        <ChatHeader/>
        <MessageContainer/>
        <MessageBar/>
      </div>
  )
}

export default ChatContainer