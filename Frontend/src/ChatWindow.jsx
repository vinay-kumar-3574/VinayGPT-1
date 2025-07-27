// import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Plus, SlidersHorizontal, Mic } from 'lucide-react';
import { ShimmeringText } from '@/components/animate-ui/text/shimmering';
function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
            ]));
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-[#212121] h-screen w-full flex flex-col justify-between items-center text-center">
            {/* Navbar */}
            <div className="w-full flex justify-between items-center">
                <span className="m-4 text-white text-lg">
                    VinayGPT <i className="fa-solid fa-chevron-down"></i>
                </span>
                <div className="m-4" onClick={handleProfileClick}>
                    <span className="bg-[#339cff] h-[25px] w-[25px] rounded-full flex items-center justify-center cursor-pointer text-white">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {/* Dropdown */}
            {
                isOpen &&
                <div className="absolute top-16 right-16 w-[150px] bg-[#323232] p-2 rounded-md text-left z-[1000] shadow-md">
                    <div className="text-sm my-1 py-2 px-1 cursor-pointer hover:bg-white/10 rounded">
                        <i className="fa-solid fa-gear mr-2"></i> Settings
                    </div>
                    <div className="text-sm my-1 py-2 px-1 cursor-pointer hover:bg-white/10 rounded">
                        <i className="fa-solid fa-cloud-arrow-up mr-2"></i> Upgrade plan
                    </div>
                    <div className="text-sm my-1 py-2 px-1 cursor-pointer hover:bg-white/10 rounded">
                        <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i> Log out
                    </div>
                </div>
            }

            {/* Chat */}
            <Chat />

            {/* Loader */}
            <ScaleLoader color="#fff" loading={loading} />

            {/* Chat Input */}
            <div className="w-full flex flex-col justify-center items-center px-4">
                <div className="w-full max-w-[700px] relative flex items-center bg-[#1e1e1f] border border-[#2e2e2f] rounded-2xl px-4 py-3 shadow-lg gap-2">

                    {/* Input box (first in order) */}
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                        className="flex-1 bg-transparent text-white text-sm placeholder-[#888] focus:outline-none px-2"
                    />

                    {/* Right-side buttons */}
                    <div className="flex gap-2 items-center">
                        {/* Plus Button */}
                        <button className="hover:bg-[#2c2c2e] p-2 rounded-full transition-all duration-200">
                            <Plus className="h-4 w-4 text-[#a1a1aa]" />
                        </button>

                        {/* Tools Button */}
                        <button className="hover:bg-[#2c2c2e] p-2 rounded-full transition-all duration-200">
                            <SlidersHorizontal className="h-4 w-4 text-[#a1a1aa]" />
                        </button>

                        {/* Mic Button */}
                        <button className="hover:bg-[#2c2c2e] p-2 rounded-full transition-all duration-200">
                            <Mic className="h-4 w-4 text-[#a1a1aa]" />
                        </button>

                        {/* Ask Button */}
                        <InteractiveHoverButton onClick={getReply}>
                            Ask
                        </InteractiveHoverButton>
                    </div>
                </div>

                {/* Disclaimer animation text */}
                <ShimmeringText
                    className="text-sm text-[#b4b4b4] mt-2 text-center"
                    text="SigmaGPT can make mistakes. Check important info. See Cookie Preferences."
                    wave
                />
            </div>


        </div>
    );
}

export default ChatWindow;
