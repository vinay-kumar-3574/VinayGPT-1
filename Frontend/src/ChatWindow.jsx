// import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

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
            <div className="w-full flex flex-col justify-center items-center">
                <div className="w-full max-w-[700px] relative flex justify-between items-center">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                        className="w-full bg-white/5 p-5 text-sm rounded-[14px] shadow-[0_54px_55px_rgba(0,0,0,0.05),0_-12px_30px_rgba(0,0,0,0.05),0_4px_6px_rgba(0,0,0,0.05),0_12px_3px_rgba(0,0,0,0.05),0_-3px_5px_rgba(0,0,0,0.05)] text-white focus:outline-none"
                    />
                    <div
                        id="submit"
                        onClick={getReply}
                        className="cursor-pointer h-[35px] w-[35px] text-[20px] absolute right-[15px] flex items-center justify-center text-white hover:text-white"
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="text-sm p-2 text-[#b4b4b4]">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;
