import React from 'react';
import { MessageSender, ChatMessage } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.User;
  const messageClass = isUser
    ? 'bg-blue-100 text-blue-900 self-end rounded-bl-lg'
    : 'bg-white text-gray-800 self-start rounded-br-lg shadow-md'; // Added shadow for AI messages for better distinction

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-2`}>
      <div
        className={`max-w-3xl p-3 rounded-t-lg ${messageClass}`}
        style={{ overflowWrap: 'break-word' }}
      >
        <Markdown remarkPlugins={[remarkGfm]} className="prose prose-sm break-words">
          {message.text}
        </Markdown>
        <div className={`text-xs mt-2 ${isUser ? 'text-blue-700' : 'text-gray-500'} text-right`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Message;
