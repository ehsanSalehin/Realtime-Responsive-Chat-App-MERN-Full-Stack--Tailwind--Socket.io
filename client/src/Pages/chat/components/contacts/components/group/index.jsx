import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { PiUserPlusLight } from "react-icons/pi";
import Modal from '../direct-message/model';
import { apiClient } from '@/lib/api-client';
import { CREATE_GROUP_ROUTE, SEARCH_COUNTACTS_ROUTES } from '@/Utils/constants';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { HOST } from '@/Utils/constants';

const Group = () => {
  const { setSelectedChatType, setSelectedChatData, addGroup } = useAppStore();
  const [newGroup, setNewGroup] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleContactSelection = (contactId) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(contactId)
        ? prevSelected.filter((id) => id !== contactId)
        : [...prevSelected, contactId]
    );
  };

  const createGroup = async () => {
    try {
      if (groupName.length > 0 && selectedContacts.length > 0) {
        // Log the data being sent
        console.log("Creating group with:", { name: groupName, members: selectedContacts });
  
        const res = await apiClient.post(
          CREATE_GROUP_ROUTE,
          {
            name: groupName,
            members: selectedContacts, // Ensure these are valid IDs
          },
          { withCredentials: true }
        );
  
        if (res.status === 201) {
          setGroupName("");
          setSelectedContacts([]);
          setNewGroup(false);
          addGroup(res.data.group);
        }
      }
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  const searchContacts = async (search) => {
    try {
      if (search.length > 0) {
        const res = await apiClient.post(SEARCH_COUNTACTS_ROUTES, { search }, { withCredentials: true });
        if (res.status === 200 && res.data.contacts) {
          setSearchResults(res.data.contacts);
        }
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <PiUserPlusLight
              className="text-neutral-400 text-opacity-90 hover:text-neutral-800 cursor-pointer transition-all duration-50 font-bold text-xl "
              onClick={() => setNewGroup(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#9745ff] border-none mb-2 p-3 text-white">
            <p>Create New Group</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Modal isOpen={newGroup} onClose={() => setNewGroup(false)}>
        <div className="flex flex-col h-full">
          <h2 className="text-lg mb-4 font-bold">Create a New Group</h2>
          
          {/* Input for Group Name */}
          <input
            placeholder="Group Name"
            className="rounded-lg p-3 bg-[#ffffff] border-none mb-4 font-bold text-purple-600"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />

          {/* Input for Searching Contacts */}
          <input
            placeholder="Search Contacts"
            className="rounded-lg p-3 bg-[#ffffff] border-none mb-4 font-bold text-purple-600"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchContacts(e.target.value);
            }}
            value={searchTerm}
          />

          {/* List of Search Results */}
          <div className="mb-4 max-h-40 overflow-y-auto bg-[#e3a76b] flex flex-col rounded-xl">
            {searchResults.map((contact) => (
              <label key={contact._id} className="flex  mb-2 gap-3 items-center cursor-pointer ">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact._id)}
                  onChange={() => handleContactSelection(contact._id)}
                  className="mr-2"
                />
                <Avatar className="w-10 h-10 rounded-full">
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
              </label>
            ))}
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-800 transition-all duration-300"
            onClick={createGroup}
          >
            Create Group
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Group;