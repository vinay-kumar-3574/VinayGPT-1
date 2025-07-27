'use client';

import {
  BookOpen,
  NotebookPen,
  Book,
  Search,
  MoreVertical,
  Share2,
  Pencil,
  Archive,
  Trash2,
} from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { MyContext } from './MyContext';
import { v1 as uuidv1 } from 'uuid';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu"; // ✅ this now works
;
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/thread');
        const json = await res.json();
        setAllThreads(json.map((t) => ({ threadId: t.threadId, title: t.title })));
      } catch (e) {
        console.error(e);
      }
    };
    fetchThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt('');
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (id) => {
    setCurrThreadId(id);
    try {
      const res = await fetch(`http://localhost:8080/api/thread/${id}`);
      const data = await res.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteThread = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/thread/${id}`, { method: 'DELETE' });
      setAllThreads((prev) => prev.filter((t) => t.threadId !== id));
      if (id === currThreadId) createNewChat();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside
      className={cn(
        'bg-[#202123] text-white h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-white/10',
        collapsed ? 'w-[56px]' : 'w-[260px]'
      )}
    >
      {/* Logo and Collapse */}
      <div className="flex items-center justify-between px-3 py-4">
        {!collapsed && (
          <div className="bg-white p-1 rounded">
            <img src="/Chatgpt.svg.png" alt="Logo" className="w-6 h-6" />
          </div>
        )}
        <Button
          onClick={() => setCollapsed(!collapsed)}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <BookOpen size={18} />
        </Button>
      </div>

      {/* New Chat */}
      <div className="px-3 space-y-2">
        <Button
          onClick={createNewChat}
          variant="outline"
          className="w-full justify-start gap-2 text-white border-white/20 bg-transparent hover:bg-white/5 text-sm"
        >
          <NotebookPen size={16} />
          {!collapsed && 'New chat'}
        </Button>

        {/* Search and Library buttons (moved up here) */}
        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/5">
          <Search size={16} />
          {!collapsed && 'Search chats'}
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/5">
          <Book size={16} />
          {!collapsed && 'Library'}
        </Button>
      </div>

      {/* Chats Section */}
      <ScrollArea className="flex-1 px-1 mt-3">
        {!collapsed && (
          <div className="text-[11px] text-white/40 px-4 pb-2 font-semibold uppercase tracking-wider">
            Chats
          </div>
        )}
        <ul className="space-y-1 px-2">
          {allThreads?.map((thread) => (
            <li
              key={thread.threadId}
              onClick={() => changeThread(thread.threadId)}
              className={cn(
                'group flex items-center justify-between text-sm px-3 py-2 rounded-md cursor-pointer truncate',
                thread.threadId === currThreadId ? 'bg-[#343541]' : 'hover:bg-white/5'
              )}
            >
              {!collapsed ? (
                <>
                  <span className="truncate w-[170px]">{thread.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-white/40 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-[#343541] text-white border-white/10">
                      <DropdownMenuItem className="gap-2 hover:bg-white/10">
                        <Share2 size={14} /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 hover:bg-white/10">
                        <Pencil size={14} /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 hover:bg-white/10">
                        <Archive size={14} /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-red-500 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteThread(thread.threadId);
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <NotebookPen size={16} />
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>

      {/* Account Info */}
      <div className="border-t border-white/10 px-3 py-4 flex items-center gap-2 text-white/60 text-xs">
        <div className="h-6 w-6 rounded-full bg-blue-500 text-center leading-6 font-bold">V</div>
        {!collapsed && (
          <div>
            <div className="font-semibold text-white">vinay</div>
            <div className="text-white/40 text-[11px]">Free</div>
          </div>
        )}
      </div>
    </aside>
  );
}
