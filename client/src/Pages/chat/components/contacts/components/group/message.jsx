import React from 'react';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { HOST } from '@/Utils/constants';

const Message = ({ message }) => {
  const { sender, content, fileUrl } = message;

  return (
    <div className="flex items-start mb-4">
      <Avatar className="w-10 h-10 rounded-full mr-3">
        {sender.image ? (
          <AvatarImage
            src={`${HOST}/${sender.image}`}
            alt="profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="uppercase w-full h-full flex items-center justify-center rounded-full bg-gray-300 text-[#12527a] text-lg font-bold">
            {sender.firstName ? sender.firstName.charAt(0) : sender.email.charAt(0)}
          </div>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold text-lg">
          {sender.firstName && sender.lastName
            ? `${sender.firstName} ${sender.lastName}`
            : sender.email}
        </span>
        <div className="text-sm text-gray-700">
          {content}
          {fileUrl && <a href={`${HOST}/${fileUrl}`} target="_blank" rel="noopener noreferrer">View File</a>}
        </div>
      </div>
    </div>
  );
};

export default Message;