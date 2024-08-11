export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContact:[],
  isUploading:false,
  isDownloading:false,
  fileUploadProgress:0,
  fileDownloadProgress:0,
  groups:[],
  
  setGroups:(newGroups) => set ({groups:newGroups}),
  setIsUploading:(newIsUploading) =>set({isUploading: newIsUploading}),
  setIsDownloading:(newIsDownloading) =>set({isDownloading: newIsDownloading}),
  setFileUploadProgress:(newFileUploadProgress) =>set({fileUploadProgress: newFileUploadProgress}),
  setFileDownloadProgress:(newFileDownloadProgress) =>set({fileDownloadProgress: newFileDownloadProgress}),

  setSelectedChatType: (newSelectedChatType) => set({ selectedChatType: newSelectedChatType }),
  setSelectedChatData: (newSelectedChatData) => set({ selectedChatData: newSelectedChatData }),
  setSelectedChatMessages: (newSelectedChatMessages) => set({ selectedChatMessages: newSelectedChatMessages }),
  setDirectMessagesContact:(newDirectMessagesContact)=>set({directMessagesContact: newDirectMessagesContact}),
  addGroup:(group)=>{
    const groups = get().groups;
    set({groups:[group,...groups]})
  },
  closeChat: () => set({
    selectedChatData: undefined,
    selectedChatType: undefined,
    selectedChatMessages: [],

  }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    set({
      selectedChatMessages: [...selectedChatMessages, message],
    });
  },
  //sorting group message 
  addGroupInGroupList:(message)=>{
    const groups =get().groups;
    const data = groups.find(group=>group._id === message.groupId);
    const index = groups.findIndex(
      (group) => group._id === message.groupId
    );
    if(index !== -1 && index !==undefined){
      groups.splice(index, 1);
      groups.unshift(data);
    }
  },
  //sorting direct message
  addContextInDirectMessageContext:(message)=>{
    const userId = get().userInfo.id;
    const fromId = 
    message.sender._id ===userId
      ? message.recipent._id
      : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.recipent : message.sender;
    const directMessagesContact = get().directMessagesContact;
    const data = directMessagesContact.find((contact)=>contact._id === fromId);
    const index = directMessagesContact.findIndex((contact)=> contact._id === fromId);
    if(index !== -1 && index !== undefined){
      directMessagesContact.splice(index, 1);
      directMessagesContact.unshift(data);
    }else{
      directMessagesContact.unshift(fromData);
    }
    set({directMessagesContact: directMessagesContact});
  }
});
