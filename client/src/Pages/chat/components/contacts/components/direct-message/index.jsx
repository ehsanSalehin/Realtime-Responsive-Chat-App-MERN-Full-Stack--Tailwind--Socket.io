// DirectMessage.jsx
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import Lottie from "react-lottie";
import { PiUserPlusLight } from "react-icons/pi";
import { animation } from "@/lib/utils"; 
import Modal from './model';
import { apiClient } from '@/lib/api-client';
import { HOST, SEARCH_COUNTACTS_ROUTES } from '@/Utils/constants';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useAppStore } from '@/store';

const DirectMessage = () => {
  const {setSelectedChatType, setSelectedChatData} = useAppStore()
  const [openNewContact, setOpenNewContact] = useState(false);
  const [searchCon, setSearchCon] = useState([]);

  const searchContacts = async (search) => {
    try{
      if(search.length>0){
        const res = await apiClient.post(SEARCH_COUNTACTS_ROUTES,{search},{withCredentials:true} );
        if(res.status ===200 && res.data.contacts){
          setSearchCon(res.data.contacts);
        }
      }else{
        setSearchCon([]);
      }
    }catch(err){
      console.log(err)
    }
  };
  const avatarClass = "w-10 h-10 rounded-full";

  const selectNewContact = (contact)=>{
    setOpenNewContact(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchCon([]);
  };  

  return (
    <>

<TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <PiUserPlusLight
              className="text-neutral-400 text-opacity-90 hover:text-neutral-800 cursor-pointer transition-all duration-50 font-bold text-xl"
              onClick={() => setOpenNewContact(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#9745ff] border-none mb-2 p-3 text-white">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Modal isOpen={openNewContact} onClose={() => setOpenNewContact(false)}>
        <div className="flex flex-col h-full">
          <h2 className="text-lg mb-4 font-bold">Please Select Your Contact</h2>
          <input
            placeholder="Search Contacts"
            className="rounded-lg p-3 bg-[#ffffff] border-none mb-4 font-bold text-purple-600"
            onChange={(e) => searchContacts(e.target.value)}
          />

          {searchCon.length <= 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie 
                isClickToPauseDisabled={true} 
                height={100} 
                width={100} 
                options={animation}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-xl text-xl transition-all duration-300 text-center">
                <h3 className="playwrite-ar-thin">
                  Hi <span className="text-purple-600">!</span> Connect <span></span>
                  <span className="text-purple-600">With </span> Fresh Faces <span className="text-purple-500">.</span>
                </h3>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto max-h-[250px]">
              {searchCon.map((contact) => (
                <div key={contact._id} className="flex gap-3 items-center cursor-pointer">
                  <div className="flex items-center p-2 bg-[#a84db8] rounded-lg mt-1 w-full"
                    onClick={() => selectNewContact(contact)}>
                    <Avatar className={avatarClass}>                
                      {contact.image ? (
                        <AvatarImage 
                          src={`${HOST}/${contact.image}`} 
                          alt="profile" 
                          className='object-cover w-full h-full' 
                        />
                      ) : (
                        <div className='uppercase w-full h-full flex items-center justify-center rounded-full bg-gray-300 text-[#12527a] text-lg font-bold'>
                          {contact.firstName ? contact.firstName.charAt(0) : contact.email.charAt(0)}
                        </div> 
                      )}
                    </Avatar>
                    <div className="ml-3">
                      <span className="font-semibold text-lg">
                        {contact.firstName && contact.lastName 
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <div className="text-sm text-white">
                        {contact.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DirectMessage;
