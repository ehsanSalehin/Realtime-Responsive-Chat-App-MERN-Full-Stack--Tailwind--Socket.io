import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Contacts from './components/contacts'
import Empty from './components/empty'
import ChatContainer from './components/chatContainer'

function Chat() {


  const {userInfo, selectedChatType, 
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,} = useAppStore()
  const navigate = useNavigate()
  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast('Please Set Up Your Profile');
      navigate("/profile");
    }
  },[userInfo, navigate]);


  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {
        isUploading && (<div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-balck/80 flex items-center justify-center gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Uploading Is In Progress</h5>
          {fileUploadProgress}%
        </div>)
      }
      {
        isDownloading && (<div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-balck/80 flex items-center justify-center gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Downloading Is In Progress </h5>
          {fileDownloadProgress}%
        </div>)
      }
      <Contacts/>
      {
        selectedChatType === undefined ?   (<Empty/>) : (<ChatContainer/>)
      }

    </div>
  )
}

export default Chat