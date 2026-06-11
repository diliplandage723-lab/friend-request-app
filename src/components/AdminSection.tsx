import React, { useState } from 'react';
import { UserProfile, ReportItem } from '../types';
import { ShieldAlert, Users, Ban, ClipboardCheck, CheckCircle2, XCircle, TrendingUp, DollarSign, Star, Search, Trash2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminSectionProps {
  friends: UserProfile[];
  setFriends: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  reports: ReportItem[];
  setReports: React.Dispatch<React.SetStateAction<ReportItem[]>>;
  currentUser: UserProfile;
}

const ANALYTICS_DATA = [
  { day: 'Mon', activeUsers: 140, paymentsVolume: 220 },
  { day: 'Tue', activeUsers: 210, paymentsVolume: 410 },
  { day: 'Wed', activeUsers: 190, paymentsVolume: 350 },
  { day: 'Thu', activeUsers: 280, paymentsVolume: 610 },
  { day: 'Fri', activeUsers: 340, paymentsVolume: 820 },
  { day: 'Sat', activeUsers: 420, paymentsVolume: 940 },
  { day: 'Sun', activeUsers: 390, paymentsVolume: 780 }
];

export default function AdminSection({ friends, setFriends, reports, setReports, currentUser }: AdminSectionProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'reports'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleVerify = (userId: string) => {
    setFriends(friends.map(f => f.id === userId ? { ...f, verified: !f.verified } : f));
  };

  const handleRewardCoinsBy50 = (userId: string) => {
    setFriends(friends.map(f => f.id === userId ? { ...f, score: f.score + 50 } : f));
  };

  const handleBanUser = (userId: string, username: string) => {
    if (confirm(`Are you absolutely sure you want to block/suspend @${username}?`)) {
      setFriends(friends.filter(f => f.id !== userId));
      alert(`User @${username} was suspended and logged out from Friend Request nodes.`);
    }
  };

  const handleResolveReport = (reportId: string, status: ReportItem['status']) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
    alert(`Report status changed to: ${status}`);
  };

  const filteredUsers = friends.filter(friend => 
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] overflow-y-auto pb-24 scrollbar-none animate-fade-in" id="admin-panel">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-[#11131A] border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white font-display uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={15} className="text-red-500 animate-pulse" /> Security Command
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-display uppercase tracking-widest mt-0.5">Global Admin Oversight Dashboard</p>
        </div>
        <span className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-[8.5px] font-bold uppercase tracking-widest font-display p-1.5 px-3 rounded-full">
          Level 4 ROOT
        </span>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white dark:bg-[#11131A] border-b border-slate-150 dark:border-white/5 text-[10px] text-center font-bold uppercase font-display tracking-wider">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-3 border-b-2 transition-all font-display duration-200 ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          id="admin-tab-analytics"
        >
          <TrendingUp className="inline mr-1" size={12} /> Charts
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 border-b-2 transition-all font-display duration-200 ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          id="admin-tab-users"
        >
          <Users className="inline mr-1" size={12} /> Users ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-3 border-b-2 transition-all font-display duration-200 ${activeTab === 'reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          id="admin-tab-reports"
        >
          <ClipboardCheck className="inline mr-1" size={12} /> Audits ({reports.length})
        </button>
      </div>

      {/* CORE 1: STATISTICS ANALYTICS CHART */}
      {activeTab === 'analytics' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 p-4 rounded-[24px] shadow-xs text-left">
              <span className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl inline-block mb-2">
                <Users size={15} />
              </span>
              <h5 className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display">Active Conns</h5>
              <p className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">11,280 Nodes</p>
              <span className="text-[8px] text-green-500 font-bold uppercase tracking-wider font-display block mt-1">+14.2% Growth</span>
            </div>

            <div className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 p-4 rounded-[24px] shadow-xs text-left">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block mb-2">
                <DollarSign size={15} />
              </span>
              <h5 className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display">Remitted</h5>
              <p className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">$45,280.00</p>
              <span className="text-[8px] text-green-500 font-bold uppercase tracking-wider font-display block mt-1">+22.8% Trans</span>
            </div>
          </div>

          {/* Area Chart visualization of volume */}
          <div className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 rounded-[28px] p-4.5 shadow-xs text-xs">
            <h4 className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display mb-4">DAU Connections Area Wave</h4>
            <div className="w-full h-44" id="dau-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" tick={{ fontSize: 8 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 8 }} stroke="#94a3b8" />
                  <Tooltip wrapperStyle={{ fontSize: 9 }} />
                  <Area type="monotone" dataKey="activeUsers" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Money Volume Chart */}
          <div className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 rounded-[28px] p-4.5 shadow-xs text-xs">
            <h4 className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display mb-4">Transfer Value Volume Wave</h4>
            <div className="w-full h-44" id="remit-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" tick={{ fontSize: 8 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 8 }} stroke="#94a3b8" />
                  <Tooltip wrapperStyle={{ fontSize: 9 }} />
                  <Area type="monotone" dataKey="paymentsVolume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPay)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* CORE 2: ACCOUNT/USER MANAGEMENT DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-4 space-y-3">
          {/* Search bar */}
          <div className="flex bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 px-3 py-2.5 rounded-xl items-center gap-2 shadow-xs">
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs outline-none flex-1 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-3">
            {filteredUsers.map((friend) => (
              <div key={friend.id} className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 p-4 rounded-[24px] flex flex-col gap-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <img src={friend.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-white/10" alt="" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {friend.fullName} {friend.verified && '★'}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">@{friend.username} • {friend.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-slate-600 dark:text-slate-400 bg-[#F4F5F8] dark:bg-[#1C1F28] p-1.5 px-3 rounded-xl border border-slate-200/20">
                    <span>{friend.score} Coins</span>
                  </div>
                </div>

                {/* Quick Moderation control row */}
                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
                  <button
                    onClick={() => handleToggleVerify(friend.id)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-404 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer active-press uppercase tracking-wider font-display"
                  >
                    {friend.verified ? 'Revoke Verify' : 'Grant Verify'}
                  </button>

                  <button
                    onClick={() => handleRewardCoinsBy50(friend.id)}
                    className="flex-1 bg-yellow-50 hover:bg-yellow-105 text-yellow-600 dark:bg-yellow-950/15 dark:text-yellow-450 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-0.5 cursor-pointer active-press uppercase tracking-wider font-display"
                  >
                    <Star size={10} fill="currentColor" /> +50 Coins
                  </button>

                  <button
                    onClick={() => handleBanUser(friend.id, friend.username)}
                    className="bg-red-50 hover:bg-red-100 text-red-505 dark:bg-red-950/20 py-1.5 px-3 rounded-lg cursor-pointer active-press"
                    title="Ban Account"
                  >
                    <Ban size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CORE 3: REPORT MANAGEMENT & AUDITS */}
      {activeTab === 'reports' && (
        <div className="p-4 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-slate-400">All audit cases cleared. No complaints filed!</p>
            </div>
          ) : (
            reports.map((item) => (
              <div key={item.id} className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 p-4 rounded-[24px] space-y-3.5 shadow-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] text-red-500 font-extrabold bg-red-500/10 border border-red-500/20 p-1 px-2.5 rounded-md uppercase tracking-wider font-display">
                    ⚠️ ALERT COMPLAINT
                  </span>
                  <span className="text-[9px] text-slate-400">{item.timestamp}</span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-slate-600 dark:text-slate-400">
                    Reporter: <b className="text-slate-800 dark:text-slate-100">@{item.reporterName}</b>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Reported Defendant: <b className="text-red-550 font-bold">@{item.reportedName}</b>
                  </p>
                  <div className="bg-[#F4F5F8] dark:bg-[#1C1F28] p-3 rounded-2xl border border-slate-200/40 dark:border-white/5 text-[11px] text-slate-500 mt-1.5 leading-relaxed italic">
                    "{item.reason}"
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-white/5 text-xs text-[10px] font-bold">
                  <div>
                    <span className={`px-2.5 py-1 rounded-md text-[8.5px] font-display uppercase tracking-widest font-black ${
                      item.status === 'resolved' ? 'bg-green-55/10 text-green-600 dark:bg-green-950/20' : item.status === 'dismissed' ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-yellow-55/10 text-yellow-600 dark:bg-yellow-950/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {item.status === 'pending' && (
                    <div className="flex gap-1.5 font-display text-[9px] uppercase tracking-wider">
                      <button
                        onClick={() => handleResolveReport(item.id, 'dismissed')}
                        className="py-1 px-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-slate-500 border border-slate-200/40 dark:border-white/10 rounded cursor-pointer active-press"
                      >
                        <XCircle size={11} className="inline mr-0.5" /> Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(item.id, 'resolved')}
                        className="py-1 px-2.5 bg-green-500 text-white hover:bg-green-600 rounded cursor-pointer active-press"
                      >
                        <CheckCircle2 size={11} className="inline mr-0.5" /> Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
