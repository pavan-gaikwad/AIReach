import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import ChatMessage from './ChatMessage';
import ModelSelection from './ModelSelection';

const ChatUI = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiKey, setAPIKey] = useState();
    const [maxTokens, setMaxTokens] = useState(1024);
    const [isAPIKey, setIsAPIKey] = useState(false);
    const [model, setModel] = useState('gpt-3.5-turbo');
    const containerRef = useRef(null);
    const models = [
        {
          "LATEST MODEL": "gpt-4",
          "DESCRIPTION": "More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. Will be updated with our latest model iteration.",
          "MAX TOKENS": "8,192 tokens",
          "TRAINING DATA": "Up to Sep 2021"
        },
        {
          "LATEST MODEL": "gpt-4-0314",
          "DESCRIPTION": "Snapshot of gpt-4 from March 14th 2023. Unlike gpt-4, this model will not receive updates, and will be deprecated 3 months after a new version is released.",
          "MAX TOKENS": "8,192 tokens",
          "TRAINING DATA": "Up to Sep 2021"
        },
        {
          "LATEST MODEL": "gpt-4-32k",
          "DESCRIPTION": "Same capabilities as the base gpt-4 mode but with 4x the context length. Will be updated with our latest model iteration.",
          "MAX TOKENS": "32,768 tokens",
          "TRAINING DATA": "Up to Sep 2021"
        },
        {
          "LATEST MODEL": "gpt-4-32k-0314",
          "DESCRIPTION": "Snapshot of gpt-4-32 from March 14th 2023. Unlike gpt-4-32k, this model will not receive updates, and will be deprecated 3 months after a new version is released.",
          "MAX TOKENS": "32,768 tokens",
          "TRAINING DATA": "Up to Sep 2021"
        },
        {
            "LATEST MODEL": "gpt-3.5-turbo",
            "DESCRIPTION": "Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration.",
            "MAX TOKENS": "4,096 tokens",
            "TRAINING DATA": "Up to Sep 2021"
        },
        {
            "LATEST MODEL": "gpt-3.5-turbo-0301",
            "DESCRIPTION": "Snapshot of gpt-3.5-turbo from March 1st 2023. Unlike gpt-3.5-turbo, this model will not receive updates, and will be deprecated 3 months after a new version is released.",
            "MAX TOKENS": "4,096 tokens",
            "TRAINING DATA": "Up to Sep 2021"
        },
        {
            "LATEST MODEL": "text-davinci-003",
            "DESCRIPTION": "Can do any language task with better quality, longer output, and consistent instruction-following than the curie, babbage, or ada models. Also supports inserting completions within text.",
            "MAX TOKENS": "4,097 tokens",
            "TRAINING DATA": "Up to Jun 2021"
        },
        {
            "LATEST MODEL": "text-davinci-002",
            "DESCRIPTION": "Similar capabilities to text-davinci-003 but trained with supervised fine-tuning instead of reinforcement learning",
            "MAX TOKENS": "4,097 tokens",
            "TRAINING DATA": "Up to Jun 2021"
        },
        {
            "LATEST MODEL": "code-davinci-002",
            "DESCRIPTION": "Optimized for code-completion tasks",
            "MAX TOKENS": "8,001 tokens",
            "TRAINING DATA": "Up to Jun 2021"
        }            
      ]
      
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('messages');
        console.log("init.. messages..")
        if (savedMessages) {
            return JSON.parse(savedMessages);
        } else {
            return [
            ];
        }
    });

    useEffect(() => {
        console.log("setting messages...");
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);


    const getOpenAIResponse = async (query) => {
        // const apiKey = "";
            
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            "model": model,
            "messages": [...messages, {role: 'user', content: query}],
            "temperature": 0.7,
            "max_tokens": parseInt(maxTokens),
          },
          {headers:{
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
          },
        );
        console.log(response);
        return response.data;
      }
    
    const addMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleSend = async (event) => {
        event.preventDefault();
        setLoading(true);
        addMessage({ role: 'user',  content: message })
        console.log(messages)
        const response = await getOpenAIResponse(message);
        const reply = response.choices[0].message.content;
        const finishReason = response.choices[0]["finish_reason"];
        const newMessage = {  role: 'assistant', content: reply };
        addMessage(newMessage)
        console.log(messages)
        setMessage("");
        setLoading(false);
        
        const container = containerRef.current;
        container.scrollTop = container.scrollHeight;
        
    }

    const clearChat = () => {
        localStorage.clear();
        setMessages([]);
    }

    if(!isAPIKey){

    return (
        <div className="flex-col h-screen p-4 pb-12 bg-gray-200">
            
            <input onChange={(e)=>setAPIKey(e.target.value)} placeholder='Enter API Key'></input>
            <button type="button" className="bg-blue-400 text-white rounded p-2 text-xs" onClick={() => {setIsAPIKey(true)}}>Submit</button>
            
            
        </div>
    )

    }else{

    return (
        <div className="flex flex-col h-screen p-4 pb-12 bg-gray-200">
            <div className="fixed top-0 left-0 right-0 flex p-4 gap-4" >
                <div>
                <button type="button" className="bg-black text-white rounded p-2 text-xs" onClick={clearChat}>Clear</button>
                </div>
                <ModelSelection models={models} setModel={setModel} setMaxTokens={setMaxTokens} maxTokens={maxTokens}></ModelSelection>
            </div>
            <div className="flex-grow overflow-auto mb-4 mt-10" ref={containerRef}>
                {messages.map(msg => (
                    // <div key={msg.id} className={`my-2 p-2 rounded ${msg.sender === 'bot' ? 'bg-blue-500 text-white ml-2' : 'bg-green-500 text-white mr-2 self-end'}`}>
                    //     {renderText(msg.content)}
                    // </div>
                    <ChatMessage key={msg.id} text={msg.content} role={msg.role} sender={msg.role} />
                ))}
            </div>
            {
                loading? (
                <div className='flex flex-col text-center p-4 mb-10 gap-4'>
                    <div>
                    <p className='text-xl' >Getting response...</p>
                    </div>
                    <div>
                    <p className='text-xs'>Response comes in full and not word by word as in the official UI.</p>
                    </div>
                    <div>
                    <p className='text-xs'>Please wait...</p>
                    </div>
                </div>
                ) : (<></>)
            }
            
            <div className="mt-4 p-4">
                <form onSubmit={handleSend} className="fixed bottom-0 left-0 right-0 flex p-4">
                <div className="flex gap-4 w-full">
                    <textarea 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow rounded-l p-2"
                        placeholder="Type your message...  (Tab + Enter to submit)"
                    />
                    <button disabled={loading} type="submit" className="bg-black text-white rounded-r p-2 px-4">Send</button>
                </div>
                </form>
            </div>
        </div>
    );
}
}

export default ChatUI;
