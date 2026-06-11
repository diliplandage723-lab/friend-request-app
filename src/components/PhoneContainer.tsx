import React, { useState, useEffect } from 'react';
import { Network, BatteryFull, Wifi, Coins, Bell, X } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserScore: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'message' | 'payment' | 'game' | 'system';
}

export default function PhoneContainer({ children, activeTab, setActiveTab, currentUserScore }: PhoneContainerProps) {
  const [deviceTime, setDeviceTime] = useState('');
  const [isWideLayout, setIsWideLayout] = useState(false);
  const [screenOff, setScreenOff] = useState(false);
  
  // Simulated Notifications Queue
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Update Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDeviceTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dispatch periodic simulated notifications to test payment/chat loops
  useEffect(() => {
    const alerts: Omit<NotificationItem, 'id'>[] = [
      { title: '💸 QR Transfer Completed', body: 'Charlie Thompson sent you $25.00 via QR payee.', type: 'payment' },
      { title: '🏆 Leaderboard Alert', body: 'Alice Vance surpassed your Tap Duel highscore!', type: 'game' },
      { title: '💬 App Builders Club', body: 'Bob Miller: "What time is the conference call?"', type: 'message' },
      { title: '💖 New Like on Reel', body: 'Dana Rose liked your newly filtered lo-fi coding video!', type: 'system' }
    ];

    const pickAndNotify = () => {
      if (screenOff) return;
      
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      const newNotif = {
        ...randomAlert,
        id: `notif_${Date.now()}`
      };

      setNotifications([newNotif]);

      // Automatically slide up/remove alert after 4.5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
      }, 4500);
    };

    // Trigger first alert in 12 seconds, then every 24 seconds
    const initialDelay = setTimeout(pickAndNotify, 12000);
    const interval = setInterval(pickAndNotify, 24000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [screenOff]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const navTabs = [
    { id: 'feed', label: 'Feed', emoji: '🎴' },
    { id: 'chats', label: 'Chats', emoji: '💬' },
    { id: 'calls', label: 'Calls', emoji: '📞' },
    { id: 'games', label: 'Arcade', emoji: '🎮' },
    { id: 'wallet', label: 'Wallet', emoji: '💳' },
    { id: 'profile', label: 'Profile', emoji: '⚙️' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F5F8] dark:bg-[#0A0B10] p-2 sm:p-4 text-slate-800 dark:text-slate-100 relative transition-colors duration-300">
      {/* Upper Layout Toggle Buttons */}
      <div className="absolute top-3 left-4 z-50 flex gap-2">
        <button
          onClick={() => setIsWideLayout(!isWideLayout)}
          className="bg-white/90 dark:bg-[#11131A]/90 backdrop-blur-md border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 text-[10px] font-bold px-4 py-2 rounded-full shadow hover:bg-slate-50 dark:hover:bg-[#1C1F28] transition-colors select-none font-display tracking-wider uppercase"
        >
          {isWideLayout ? '📱 Constrain to Smartphone' : '💻 Toggle Fullscreen Web'}
        </button>
      </div>

      {/* Main Framework Frame */}
      <div
        className={`relative transition-all duration-500 ease-out flex ${
          isWideLayout 
            ? 'w-full max-w-5xl h-[85vh] rounded-[32px] border-4' 
            : 'w-full max-w-[340px] aspect-[9/18.5] h-[680px] rounded-[48px] border-[10px]'
        } border-[#0A0B10] dark:border-[#1E212E] bg-white dark:bg-[#0A0B10] shadow-2xl overflow-hidden`}
        id="smartphone-shell"
      >
        {/* PHYSICAL HARDWARE NOTCH (only on classic constraint smartphone mode) */}
        {!isWideLayout && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0A0B10] dark:bg-[#1E212E] rounded-b-2xl z-50 flex items-center justify-center">
            {/* Camera sensor eye and earphone slit */}
            <div className="w-10 h-1 bg-[#1C1F28] rounded-full mb-1"></div>
            <div className="w-2 h-2 bg-[#1C1F28] rounded-full ml-1 mb-1"></div>
          </div>
        )}

        {/* SCREEN OFF OVERLAY (Power Button simulation) */}
        {screenOff && (
          <div
            onClick={() => setScreenOff(false)}
            className="absolute inset-0 bg-[#0A0B10] z-[1001] cursor-pointer flex flex-col items-center justify-center text-center animate-fade-in"
          >
            <span className="text-2xl animate-pulse">🌙</span>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-3 font-display">Touch screen to wake</p>
          </div>
        )}

        {/* MAIN DEVICE CONTENT PANEL */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#F8F9FA] dark:bg-[#0A0B10]">
          
          {/* SYSTEM TOP STATE TRAY */}
          <div className="h-8 bg-white dark:bg-[#11131A] px-5 flex justify-between items-center text-[10px] font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-white/5 shrink-0 select-none z-30">
            {/* Left Column: Live Clock */}
            <span className="font-mono tracking-wider">{deviceTime || '08:00 AM'}</span>
            
            {/* Center spacing if notch active */}
            {!isWideLayout && <div className="w-24"></div>}

            {/* Right Column: Connection signal meters */}
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Network size={12} className="text-blue-500" />
              <Wifi size={12} />
              <div className="flex items-center gap-1">
                <BatteryFull size={12} className="text-emerald-500" />
                <span className="text-[8px] opacity-75 font-mono">100%</span>
              </div>
            </div>
          </div>

          {/* SIMULATED SLIDE-DOWN PUSH NOTIFICATIONS */}
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="absolute top-10 left-3 right-3 bg-white/95 dark:bg-[#11131A]/95 backdrop-blur-md border border-slate-150 dark:border-white/10 rounded-2xl p-3.5 shadow-2xl z-[900] flex items-start gap-2.5 animate-[slide-down_0.3s_ease-out] border-l-4 border-l-blue-600"
              id={`push-${notif.id}`}
            >
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-blue-500 shrink-0 mt-0.5">
                <Bell size={13} className="animate-swing" />
              </span>
              <div className="flex-1 min-w-0 text-left">
                <h5 className="text-[10px] font-extrabold text-slate-900 dark:text-white leading-none font-display uppercase tracking-wider">{notif.title}</h5>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{notif.body}</p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X size={11} />
              </button>
            </div>
          ))}

          {/* INNER VIEWPORTS OUTLET SCREEN */}
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>

          {/* BOTTOM NAVIGATION FIXED BAR */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#11131A]/90 backdrop-blur-md border-t border-slate-200 dark:border-white/5 p-1 px-2 pb-2.5 flex justify-around items-center z-40 select-none shrink-0 shadow-lg">
            {navTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center p-1 py-1.5 rounded-2xl transition-all duration-200 active-press cursor-pointer ${
                    active 
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold scale-105' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  <span className="text-base mb-0.5 leading-none">{tab.emoji}</span>
                  <span className="text-[7.5px] tracking-widest uppercase font-black font-display">{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* HARDWARE VOLUME BUTTON MECHANICAL SWITCHES */}
        {!isWideLayout && (
          <>
            <button
              onClick={() => { alert('Volume Increased 🔊'); }}
              className="absolute -left-3 top-20 w-1 h-10 bg-slate-900 dark:bg-slate-800 rounded-l cursor-pointer z-50 hover:bg-slate-800"
              title="Volume Up"
            />
            <button
              onClick={() => { alert('Volume Decreased 🔉'); }}
              className="absolute -left-3 top-32 w-1 h-10 bg-slate-900 dark:bg-slate-800 rounded-l cursor-pointer z-50 hover:bg-slate-800"
              title="Volume Down"
            />
            <button
              onClick={() => setScreenOff(!screenOff)}
              className="absolute -right-3 top-24 w-1 h-12 bg-slate-900 dark:bg-slate-800 rounded-r cursor-pointer z-50 hover:bg-slate-800"
              title="Power Sleep Toggle"
            />
          </>
        )}
      </div>
    </div>
  );
}
