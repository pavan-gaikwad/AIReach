import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ text, sender }) => {
    
    const [block, setBlock] = useState([]);

    const addBlock = (message) => {
        setBlock((prevMessages) => [...prevMessages, message]);
    };

    const isCodeBlock = (message) => {
        // Code keywords to look for
    const keywords = ['("', '{', "('", "()"];

    // Split text into lines
    const lines = message.split('\n');

    // Check each line for keywords
    for (let line of lines) {
        for (let keyword of keywords) {
            if (line.includes(keyword)) {
                return true;
            }
        }
    }

    return false;

    }

    // Function to format code block for display
    const formatCodeBlock = (message) => {
        
        return message.trim();

    }

    const formatTextResponse = (message) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
    }

    return (
        <div className={`my-2 p-2 text-xs rounded ${sender === 'assistant' ? 'bg-gray-700 text-white ml-2' : 'bg-cyan-500 text-white mr-2 self-end'}`}>
            
            {isCodeBlock(text) ? (
                <SyntaxHighlighter language="javascript" style={solarizedlight}>
                    {formatCodeBlock(text.trim())}
                </SyntaxHighlighter>
            ) : (
                <pre><code dangerouslySetInnerHTML={{ __html: formatTextResponse(text.trim()) }} /></pre>
            )}
        </div>
    );
}

export default ChatMessage;
