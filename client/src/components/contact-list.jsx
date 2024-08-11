import { useAppStore } from "@/store";
import { HOST } from "@/Utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "../Utils/colors";

function ContactList({ contacts, isGroup = false }) {
  const { selectedChatData, setSelectedChatData, setSelectedChatType, setSelectedChatMessages } = useAppStore();
  const avatarClass = "w-10 h-10 rounded-full overflow-hidden";

  const handleClick = (contact) => {
    if (isGroup) setSelectedChatType("group");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all cursor-pointer duration-300 ${
            selectedChatData && selectedChatData._id === contact._id ? "bg-[#3ec552] hover:bg-[#59e46e]" : "hover:bg-[#b1eb9d]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-600">
            {!isGroup && (
              <Avatar className={avatarClass}>
                {contact?.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div
                    className={`uppercase w-full h-full flex items-center justify-center rounded-full text-[#12527a] text-lg font-bold ${
                      selectedChatData && selectedChatData._id === contact._id ? "bg-[#fffff2] border border-white/50" : getColor(contact.color)
                    }`}
                  >
                    {contact?.firstName ? contact.firstName.charAt(0) : contact?.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}
            {isGroup && (
              <>
                <div className="bg-[#fffff2] h-10 w-10 flex items-center justify-center rounded-full">+</div>
                <span>{contact.name}</span>
              </>
            )}
            {!isGroup && (
              <span>{contact.firstName ?`${contact.firstName} ${contact.lastName}`: contact.email}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
