import { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Post, 
  Story, 
  Chat, 
  CallRecord, 
  Transaction, 
  GameScore, 
  ReportItem 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_FRIENDS, 
  INITIAL_STORIES, 
  INITIAL_POSTS, 
  INITIAL_CHATS, 
  INITIAL_CALLS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_LEADERBOARD, 
  INITIAL_REPORTS,
  loadData,
  saveData
} from './data/mockData';

import PhoneContainer from './components/PhoneContainer';
import FeedSection from './components/FeedSection';
import ChatSection from './components/ChatSection';
import CallSection from './components/CallSection';
import GameSection from './components/GameSection';
import WalletSection from './components/WalletSection';
import ProfileSection from './components/ProfileSection';
import AdminSection from './components/AdminSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Core Persistent States inside App
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => 
    loadData<UserProfile>('user', INITIAL_USER)
  );
  
  const [friends, setFriends] = useState<UserProfile[]>(() => 
    loadData<UserProfile[]>('friends', INITIAL_FRIENDS)
  );

  const [stories, setStories] = useState<Story[]>(() => 
    loadData<Story[]>('stories', INITIAL_STORIES)
  );

  const [posts, setPosts] = useState<Post[]>(() => 
    loadData<Post[]>('posts', INITIAL_POSTS)
  );

  const [chats, setChats] = useState<Chat[]>(() => 
    loadData<Chat[]>('chats', INITIAL_CHATS)
  );

  const [calls, setCalls] = useState<CallRecord[]>(() => 
    loadData<CallRecord[]>('calls', INITIAL_CALLS)
  );

  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadData<Transaction[]>('transactions', INITIAL_TRANSACTIONS)
  );

  const [leaderboard, setLeaderboard] = useState<GameScore[]>(() => 
    loadData<GameScore[]>('leaderboard', INITIAL_LEADERBOARD)
  );

  const [reports, setReports] = useState<ReportItem[]>(() => 
    loadData<ReportItem[]>('reports', INITIAL_REPORTS)
  );

  const [walletBalance, setWalletBalance] = useState<number>(() => 
    loadData<number>('walletBalance', 150.00)
  );

  // Synchronizers
  useEffect(() => {
    saveData('user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveData('friends', friends);
  }, [friends]);

  useEffect(() => {
    saveData('stories', stories);
  }, [stories]);

  useEffect(() => {
    saveData('posts', posts);
  }, [posts]);

  useEffect(() => {
    saveData('chats', chats);
  }, [chats]);

  useEffect(() => {
    saveData('calls', calls);
  }, [calls]);

  useEffect(() => {
    saveData('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveData('leaderboard', leaderboard);
  }, [leaderboard]);

  useEffect(() => {
    saveData('reports', reports);
  }, [reports]);

  useEffect(() => {
    saveData('walletBalance', walletBalance);
  }, [walletBalance]);

  // Handle section routing
  const renderTabContent = () => {
    if (showAdminPanel && activeTab === 'profile') {
      return (
        <AdminSection
          friends={friends}
          setFriends={setFriends}
          reports={reports}
          setReports={setReports}
          currentUser={currentUser}
        />
      );
    }

    switch (activeTab) {
      case 'feed':
        return (
          <FeedSection
            posts={posts}
            setPosts={setPosts}
            stories={stories}
            setStories={setStories}
            currentUser={currentUser}
          />
        );
      case 'chats':
        return (
          <ChatSection
            chats={chats}
            setChats={setChats}
            currentUser={currentUser}
          />
        );
      case 'calls':
        return (
          <CallSection
            calls={calls}
            setCalls={setCalls}
            currentUser={currentUser}
          />
        );
      case 'games':
        return (
          <GameSection
            leaderboard={leaderboard}
            setLeaderboard={setLeaderboard}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        );
      case 'wallet':
        return (
          <WalletSection
            transactions={transactions}
            setTransactions={setTransactions}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            friends={friends}
          />
        );
      case 'profile':
      default:
        return (
          <ProfileSection
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            showAdminPanel={showAdminPanel}
            setShowAdminPanel={(val) => { setShowAdminPanel(val); }}
          />
        );
    }
  };

  return (
    <div className={isDarkMode ? 'dark bg-slate-950 w-full' : 'bg-slate-50 w-full'} id="app-theme-wrapper">
      <div className="dark:bg-slate-950 dark:text-white transition-colors duration-300">
        <PhoneContainer
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            // Auto exit admin view when switching tabs
            if (tab !== 'profile') setShowAdminPanel(false);
          }}
          currentUserScore={currentUser.score}
        >
          {renderTabContent()}
        </PhoneContainer>
      </div>
    </div>
  );
}
