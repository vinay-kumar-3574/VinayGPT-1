
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <>
            {newChat && <h1 className="text-white text-center my-4">Start a New Chat!</h1>}
            <div
                className="max-w-[750px] w-full flex-1 overflow-y-auto py-8 pr-6 pl-2 mx-auto min-h-0 
                scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#232323] 
                [&::-webkit-scrollbar]:w-[10px] 
                [&::-webkit-scrollbar-track]:bg-[#232323] 
                [&::-webkit-scrollbar-track]:rounded-lg 
                [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(135deg,_#444_40%,_#339cff_100%)] 
                [&::-webkit-scrollbar-thumb]:rounded-lg 
                [&::-webkit-scrollbar-thumb]:border-2 
                [&::-webkit-scrollbar-thumb]:border-[#232323] 
                [&::-webkit-scrollbar-thumb:hover]:bg-[linear-gradient(135deg,_#339cff_40%,_#444_100%)]"
            >
                {prevChats?.slice(0, -1).map((chat, idx) => (
                    <div
                        className={chat.role === "user" ? "flex justify-end text-sm mb-2" : "text-left text-sm mb-2"}
                        key={idx}
                    >
                        {chat.role === "user" ? (
                            <p className="bg-[#323232] text-white px-5 py-2 rounded-[14px] ml-[15rem] max-w-[500px] w-fit">
                                {chat.content}
                            </p>
                        ) : (
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {chat.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}

                {prevChats.length > 0 && (
                    <>
                        {latestReply === null ? (
                            <div className="text-left text-sm mb-2" key={"non-typing"}>
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {prevChats[prevChats.length - 1].content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="text-left text-sm mb-2" key={"typing"}>
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {latestReply}
                                </ReactMarkdown>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Chat;
