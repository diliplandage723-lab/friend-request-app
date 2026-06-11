import React, { useState, useEffect, useRef } from 'react';
import { Chat, Message, UserProfile } from '../types';
import { Send, FileText, Mic, Laugh, Paperclip, Sticker, Image, Users, CheckCheck, Play, Pause, ChevronLeft, Trash2 } from 'lucide-react';

interface ChatSectionProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  currentUser: UserProfile;
}

const STICKERS = ['🐱 Meow', '🔥 Hot', '🎉 Cheers', '💯 Perfect', '🦊 Cool', '🍩 Yummy'];
const GIFS = [
  'https://media.giphy.com/media/l41YmQjdoKs4tk39S/giphy.gif', // code
  'https://media.giphy.com/media/31lPv5L3a15qGrw91T/giphy.gif', // celebration
  'https://media.giphy.com/media/26AHONQ79FdYgWeR2/giphy.gif', // gaming
];

const CHAT_BOT_RESPONSES: { [userId: string]: string[] } = {
  user_alice: [
    "Oh I love that! Let me redesign the interface for you tonight. 💻🎀",
    "Should we hop on a quick video call? I want to show you the vector drafts.",
    "That sounds perfect! Let's check our wallet transactions. Did you receive my split?",
    "Haha totally, let's play Tap Duel next. I bet I can beat your record this time! 🎮🔥"
  ],
  user_bob: [
    "Just got back from the trails! Stunning views. What are you up to? 🏕️",
    "Exactly! We should definitely trade some decentralized tokens on that.",
    "Nice! I will put it into my calendar right away.",
    "Cool! Did you see my alpine story yet?"
  ],
  user_charlie: [
    "TypeScript definitions are all resolved! Let's build and push to production.",
    "Sure! Let's split the payment via UPI. Can you trigger the request?",
    "Got it! Let me code that feature up. Will take like 10 minutes max.",
    "Haha, epic. Classic recursion joke right there! 😂"
  ]
};

export default function ChatSection({ chats, setChats, currentUser }: ChatSectionProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioPlaybackId, setAudioPlaybackId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedChatId]);

  // Handle Recording Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (voiceRecording) {
      timer = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [voiceRecording]);

  const activeChat = chats.find(c => c.id === selectedChatId) || null;

  const sendMessage = (content: string, type: Message['type'] = 'text', attachmentUrl?: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      attachmentUrl,
      voiceDuration: type === 'voice' ? `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}` : undefined
    };

    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastUpdated: newMessage.timestamp,
            typing: true
          };
        }
        return chat;
      })
    );

    setInputText('');
    setShowEmojiPicker(false);
    setShowStickerPicker(false);

    // Trigger AI Simulated Reply after 1.5 seconds
    setTimeout(() => {
      triggerBotReply(selectedChatId, type);
    }, 1500);
  };

  const triggerBotReply = (chatId: string, userMessageType: string) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          // Find bot details
          let botName = chat.name;
          let replyContent = "Awesome! Let's stay connected.";
          
          if (!chat.isGroup) {
            const peerId = chat.members.find(id => id !== currentUser.id) || 'user_alice';
            const responses = CHAT_BOT_RESPONSES[peerId] || ["Sounds fantastic!"];
            replyContent = responses[Math.floor(Math.random() * responses.length)];
          } else {
            // Group chat replies
            const groupResps = [
              "I am putting together a slide presentation for this! 📊",
              "Count me in. Let's do a group voice call soon.",
              "Nice, I just sent 20 coins reward in our Tap Game!",
              "Is anyone else experiencing high coffee exhaustion?"
            ];
            replyContent = groupResps[Math.floor(Math.random() * groupResps.length)];
            botName = 'Alice Vance'; // Simulated speaker in group
          }

          const botMessage: Message = {
            id: `msg_bot_${Date.now()}`,
            senderId: chat.isGroup ? 'user_alice' : chat.members.find(id => id !== currentUser.id) || 'user_alice',
            senderName: chat.isGroup ? 'Alice Vance' : chat.name,
            content: replyContent,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
          };

          return {
            ...chat,
            messages: [...chat.messages, botMessage],
            unreadCount: 0,
            lastUpdated: botMessage.timestamp,
            typing: false
          };
        }
        return chat;
      })
    );
  };

  const handleStartVoice = () => {
    setVoiceRecording(true);
  };

  const handleStopVoice = () => {
    if (!voiceRecording) return;
    setVoiceRecording(false);
    const durationStr = recordingSeconds > 0 ? recordingSeconds : 3;
    sendMessage(`Voice Message (${durationStr}s)`, 'voice');
  };

  const toggleAudioPlayback = (msgId: string) => {
    if (audioPlaybackId === msgId) {
      setAudioPlaybackId(null);
    } else {
      setAudioPlaybackId(msgId);
      // Automatically end playback after 3s
      setTimeout(() => {
        setAudioPlaybackId(prev => prev === msgId ? null : prev);
      }, 3000);
    }
  };

  const deleteChatHistory = (chatId: string) => {
    if (confirm("Are you sure you want to clear chat history?")) {
      setChats(chats.map(c => c.id === chatId ? { ...c, messages: [], lastUpdated: 'Cleared' } : c));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] overflow-hidden pb-16" id="chat-section">
      {!activeChat ? (
        // Chats List View
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-[#11131A] border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white font-display uppercase tracking-wider">Friends Chats</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-display uppercase tracking-widest block mt-0.5">Real-time chat & voice loops</p>
            </div>
            <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest font-display py-1.5 px-3 rounded-full flex items-center gap-1">
              <Users size={11} /> ACTIVE
            </span>
          </div>

          {/* List */}
          <div className="p-4 space-y-2.5 flex-1">
            {chats.map(chat => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const desc = lastMsg
                ? lastMsg.type === 'voice' ? '🎙️ Voice Note' 
                  : lastMsg.type === 'sticker' ? '🎨 Sticker Sent'
                  : lastMsg.type === 'file' ? '📁 Attached Doc'
                  : lastMsg.content
                : 'No conversations yet';

              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className="w-full flex items-center gap-4.5 p-4 bg-white dark:bg-[#11131A] rounded-[24px] border border-slate-150 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-200 active-press text-left"
                  id={`chat-item-${chat.id}`}
                >
                  <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-white/10" alt={chat.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-display">{chat.name}</h4>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-display font-medium">{chat.lastUpdated}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1">{desc}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white font-bold font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md shadow-blue-500/20">
                      {chat.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Active Chat Thread View
        <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] relative">
          {/* Active Header */}
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-[#11131A] border-b border-slate-200/60 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSelectedChatId(null)}
                className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-250 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C1F28] active-press transition-colors"
                id="back-to-chat-list"
              >
                <ChevronLeft size={16} />
              </button>
              <img src={activeChat.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-150 dark:border-white/10" alt="" />
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white font-display select-text">{activeChat.name}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold font-display uppercase tracking-wider">{activeChat.typing ? 'TYPING...' : 'ACTIVE NOW'}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => deleteChatHistory(activeChat.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all"
              title="Clear Chat History"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Active Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
            {activeChat.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <span className="text-3xl">🤫</span>
                <h5 className="text-[10px] uppercase tracking-widest font-black font-display text-slate-700 dark:text-slate-300 mt-3">End-to-End Encrypted</h5>
                <p className="text-[9.5px] text-slate-550 dark:text-slate-500 mt-1.5 max-w-[170px] leading-relaxed">Messages and files are encrypted. Chats are simulated securely locally.</p>
              </div>
            ) : (
              activeChat.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[78%] ${isMe ? 'ml-auto items-end animate-fade-in' : 'mr-auto items-start animate-fade-in'}`}
                  >
                    {!isMe && activeChat.isGroup && (
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold mb-1 ml-1">{msg.senderName}</span>
                    )}

                    <div
                      className={`p-3.5 rounded-[20px] text-xs leading-relaxed shadow-xs border ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none border-blue-600'
                          : 'bg-white dark:bg-[#11131A] text-slate-800 dark:text-slate-200 rounded-bl-none border-slate-150 dark:border-white/5'
                      }`}
                    >
                      {/* Text Bubble */}
                      {msg.type === 'text' && <p>{msg.content}</p>}

                      {/* Voice Note Bubble */}
                      {msg.type === 'voice' && (
                        <div className="flex items-center gap-2.5 min-w-[120px]">
                          <button
                            onClick={() => toggleAudioPlayback(msg.id)}
                            className={`p-1.5 rounded-full flex items-center justify-center ${isMe ? 'bg-blue-750 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                          >
                            {audioPlaybackId === msg.id ? <Pause size={10} className="fill-current" /> : <Play size={10} className="fill-current" />}
                          </button>
                          <div className="flex-1">
                            {/* Waveforms simulator */}
                            <div className="flex gap-0.5 items-end h-4 w-16">
                              <span className={`w-0.5 h-1 rounded ${audioPlaybackId === msg.id ? 'animate-[bounce_0.6s_infinite_100ms] h-3' : ''} ${isMe ? 'bg-white' : 'bg-slate-500'}`} />
                              <span className={`w-0.5 h-2 rounded ${audioPlaybackId === msg.id ? 'animate-[bounce_0.6s_infinite_200ms] h-4' : ''} ${isMe ? 'bg-white' : 'bg-slate-500'}`} />
                              <span className={`w-0.5 h-3 rounded ${audioPlaybackId === msg.id ? 'animate-[bounce_0.6s_infinite_300ms] h-1' : ''} ${isMe ? 'bg-white' : 'bg-slate-500'}`} />
                              <span className={`w-0.5 h-1.5 rounded ${audioPlaybackId === msg.id ? 'animate-[bounce_0.6s_infinite_400ms] h-3.5' : ''} ${isMe ? 'bg-white' : 'bg-slate-500'}`} />
                              <span className={`w-0.5 h-2 rounded ${audioPlaybackId === msg.id ? 'animate-[bounce_0.6s_infinite_500ms] h-2' : ''} ${isMe ? 'bg-white' : 'bg-slate-500'}`} />
                            </div>
                            <span className="text-[8px] opacity-75 mt-0.5 block">{msg.voiceDuration || '0:03'}</span>
                          </div>
                        </div>
                      )}

                      {/* Sticker Bubble */}
                      {msg.type === 'sticker' && (
                        <div className="text-xl py-1">{msg.content}</div>
                      )}

                      {/* Attachment URL (GIF or File) */}
                      {msg.type === 'file' && (
                        <div className="flex flex-col gap-1 text-[11px]">
                          <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${isMe ? 'bg-blue-700' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <FileText size={14} className="text-red-400" />
                            <span className="truncate max-w-[110px]">{msg.content}</span>
                          </div>
                          {msg.attachmentUrl && (
                            <img src={msg.attachmentUrl} className="w-32 h-20 object-cover rounded-lg" alt="Attachment" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center gap-1 mt-1 text-[8px] text-slate-400 dark:text-slate-500">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck size={11} className="text-blue-500" />}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Stickers & Emojis Panel Popups */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-3 right-3 bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-2xl p-2.5 shadow-xl grid grid-cols-6 gap-2 z-20">
              {['👍', '🎉', '🔥', '💖', '😂', '👋', '👀', '🎮', '💡', '💰', '🚀', '💯'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { sendMessage(emoji); setShowEmojiPicker(false); }}
                  className="py-1.5 text-base hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {showStickerPicker && (
            <div className="absolute bottom-16 left-3 right-3 bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-2xl p-2.5 shadow-xl grid grid-cols-3 gap-2.5 z-20">
              {STICKERS.map(stick => (
                <button
                  key={stick}
                  onClick={() => sendMessage(stick, 'sticker')}
                  className="py-2.5 text-xs bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold rounded-xl text-slate-700 dark:text-slate-300"
                >
                  {stick}
                </button>
              ))}
            </div>
          )}

          {/* Chat Inputs Bar */}
          <div className="bg-white dark:bg-[#11131A] px-3.5 py-3 border-t border-slate-200/65 dark:border-white/5 shrink-0 flex items-center gap-2 relative">
            {voiceRecording ? (
              <div className="flex-1 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs px-4 py-2.5 rounded-2xl flex justify-between items-center animate-pulse">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Mic size={14} className="animate-bounce" /> Recording Voice... {recordingSeconds}s
                </span>
                <button
                  onClick={handleStopVoice}
                  className="bg-red-600 text-white font-bold px-3 py-1 rounded-xl text-[9px]"
                >
                  Stop & Send
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowStickerPicker(false); }}
                  className={`p-1.5 text-slate-400 hover:text-blue-500 rounded-full transition-colors ${showEmojiPicker ? 'text-blue-500' : ''}`}
                  title="Emoji"
                  id="btn-emoji"
                >
                  <Laugh size={18} />
                </button>

                <button
                  onClick={() => { setShowStickerPicker(!showStickerPicker); setShowEmojiPicker(false); }}
                  className={`p-1.5 text-slate-400 hover:text-blue-500 rounded-full transition-colors ${showStickerPicker ? 'text-blue-500' : ''}`}
                  title="Stickers"
                  id="btn-sticker"
                >
                  <Sticker size={18} />
                </button>

                {/* Simulated file attachments */}
                <button
                  onClick={() => {
                    const gifUrl = GIFS[Math.floor(Math.random() * GIFS.length)];
                    sendMessage('Code_Snapshot.png', 'file', gifUrl);
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-500 rounded-full transition-colors"
                  title="Attach File Simulator"
                >
                  <Paperclip size={18} />
                </button>

                <input
                  type="text"
                  placeholder="Type a secure message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(inputText); }}
                  className="flex-1 bg-slate-50 dark:bg-[#1C1F28] text-slate-850 dark:text-slate-100 text-xs rounded-2xl p-2.5 px-4 outline-none border border-slate-200 dark:border-white/5 focus:border-blue-500/50 transition-all font-sans"
                />

                {inputText.trim() ? (
                  <button
                    onClick={() => sendMessage(inputText)}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-transform active-press shadow-md shadow-blue-500/20"
                    id="btn-send-message"
                  >
                    <Send size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleStartVoice}
                    className="p-2.5 bg-slate-50 dark:bg-[#1C1F28] text-slate-500 dark:text-slate-450 hover:text-blue-500 rounded-2xl transition-all active-press"
                    title="Press to Record Voice"
                    id="btn-mic"
                  >
                    <Mic size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
