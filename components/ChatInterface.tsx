import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageSender } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import Message from './Message';
import Loader from './Loader';
import { INITIAL_AI_MESSAGE } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AI_MESSAGE]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === '') return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      sender: MessageSender.User,
      text: input,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setLoading(true);

    let aiResponseText = '';
    const newAiMessageId = Date.now().toString() + '-ai';

    try {
      await sendMessageToGemini(
        input,
        (chunk) => {
          aiResponseText += chunk;
          setMessages((prevMessages) => {
            const existingAiMessageIndex = prevMessages.findIndex(
              (msg) => msg.id === newAiMessageId,
            );
            if (existingAiMessageIndex > -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[existingAiMessageIndex] = {
                ...updatedMessages[existingAiMessageIndex],
                text: aiResponseText,
                timestamp: new Date(), // Update timestamp on chunk
              };
              return updatedMessages;
            } else {
              return [
                ...prevMessages,
                {
                  id: newAiMessageId,
                  sender: MessageSender.AI,
                  text: aiResponseText,
                  timestamp: new Date(),
                },
              ];
            }
          });
        },
        (error) => {
          console.error("Gemini API error:", error);
          const errorMessage: ChatMessage = {
            id: Date.now().toString() + '-error',
            sender: MessageSender.AI,
            text: `Apologies, I encountered an error: ${error.message}. Please try again.`,
            timestamp: new Date(),
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        },
      );
    } catch (error) {
      console.error("Unhandled error during message sending:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: MessageSender.AI,
        text: `An unexpected error occurred: ${
          (error as Error).message
        }. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !loading) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage, loading],
  );

  return (
    <div className="flex flex-col flex-grow h-full max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-xl overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {loading && (
          <div className="flex justify-start mb-4 px-2">
            <div className="bg-white p-3 rounded-br-lg rounded-t-lg shadow-md">
              <Loader />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
