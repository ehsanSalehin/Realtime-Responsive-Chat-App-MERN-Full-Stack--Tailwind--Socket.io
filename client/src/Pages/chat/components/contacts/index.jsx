import { useEffect } from "react";
import DirectMessage from "./components/direct-message";
import ProfileInfo from "./components/profileInfo";
import { apiClient } from "@/lib/api-client";
import { GET_DIRECTMESSAGE_CONTACTS_ROUTE, GET_USER_GROUP_ROUTE } from "@/Utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import  Group  from "../contacts/components/group/index";

const Contacts = () => {
const {setDirectMessagesContact, directMessagesContact, groups, setGroups }=useAppStore();
  //get the contacts
  useEffect(()=>{
    const getContacts = async()=>{
        const res = await apiClient.get(GET_DIRECTMESSAGE_CONTACTS_ROUTE,{withCredentials:true});
        if(res.data.contacts){
          setDirectMessagesContact(res.data.contacts);
        }
    };
    
          const getGroups = async()=>{
              const res = await apiClient.get(GET_USER_GROUP_ROUTE,{withCredentials:true});
              if(res.data.groups){
                setGroups(res.data.groups);
              }
          };
    getContacts();
    getGroups();
  },[setGroups, setDirectMessagesContact]);
  
  return (
    <div className="relative mid:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#ffebda] border-r-2 border-[#5f67be] w-full h-screen flex flex-col justify-between">
      <div>
        <div className="pt-3">
          <img src="https://i.ibb.co/nsFC4RV/Capture.png" alt="Capture" border="0"/>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Direct Messages"/>
            <DirectMessage/>
          </div>
          <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
              <ContactList contacts={directMessagesContact}/>
          </div>
        </div>
        <div className="my-5">
          {/*}
          <div className="flex items-center justify-between pr-10">
            <Title text="Groups"/>
            <Group/>
          </div>
            */}
          <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
              <ContactList contacts={groups} isGroup={true}/>
          </div>
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

const Title = ({text}) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">{text}</h6>
  );
};

export default Contacts;