import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Camera, ShieldCheck, Mail, MapPin, Phone, Edit3, Settings, Moon, Sun, ToggleLeft, ToggleRight, Lock, Eye, Check } from 'lucide-react';

interface ProfileSectionProps {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (val: boolean) => void;
}

export default function ProfileSection({
  currentUser,
  setCurrentUser,
  isDarkMode,
  setIsDarkMode,
  showAdminPanel,
  setShowAdminPanel
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(currentUser.fullName);
  const [tempBio, setTempBio] = useState(currentUser.bio);
  const [tempLocation, setTempLocation] = useState(currentUser.location);
  const [interestInput, setInterestInput] = useState('');

  // Privacy and Security states
  const [enable2FA, setEnable2FA] = useState(true);
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [unrequestedNotification, setUnrequestedNotification] = useState(true);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      fullName: tempName,
      bio: tempBio,
      location: tempLocation
    };
    setCurrentUser(updated);
    localStorage.setItem('friend_req_user', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleStatusChange = (status: UserProfile['status']) => {
    const updated = { ...currentUser, status };
    setCurrentUser(updated);
    localStorage.setItem('friend_req_user', JSON.stringify(updated));
  };

  const addInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    if (currentUser.interests.includes(interestInput.trim())) return;

    const updatedInterests = [...currentUser.interests, interestInput.trim()];
    const updated = {
      ...currentUser,
      interests: updatedInterests
    };
    setCurrentUser(updated);
    localStorage.setItem('friend_req_user', JSON.stringify(updated));
    setInterestInput('');
  };

  const removeInterest = (item: string) => {
    const updatedInterests = currentUser.interests.filter(i => i !== item);
    const updated = {
      ...currentUser,
      interests: updatedInterests
    };
    setCurrentUser(updated);
    localStorage.setItem('friend_req_user', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] overflow-y-auto pb-24 scrollbar-none" id="profile-section">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-[#11131A] border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white font-display uppercase tracking-wider">My Settings</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-display uppercase tracking-widest block mt-0.5">Profile & system credentials</p>
        </div>
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className={`text-[9px] py-1.5 px-3 rounded-full font-bold border font-display uppercase tracking-wider transition-all duration-200 cursor-pointer active-press ${
            showAdminPanel 
              ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30' 
              : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
          }`}
          id="btn-toggle-admin"
        >
          {showAdminPanel ? 'Exit Admin Mode ⛔️' : 'Admin Panel ⚙️'}
        </button>
      </div>

      {/* Main Avatar / Card view */}
      <div className="p-4 bg-gradient-to-b from-blue-50/10 via-white/5 to-transparent dark:from-[#11131A]/20 dark:via-transparent pt-6 text-center select-none shrink-0">
        <div className="relative inline-block">
          <img
            src={currentUser.avatar}
            className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white dark:border-[#11131A] shadow-md p-0.5"
            alt="My avatar representation"
          />
          {/* Active status bubble overlay */}
          <span className={`absolute bottom-1 right-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#0A0B10] ${
            currentUser.status === 'online' ? 'bg-green-500' : currentUser.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
          }`} />
          <button
            onClick={() => alert('Change profile photo simulator launched!')}
            className="absolute bottom-0 left-0 bg-blue-600 font-bold text-white rounded-full p-2 border border-white dark:border-white/10 shadow-xs hover:bg-blue-700 active-press transition"
          >
            <Camera size={10} />
          </button>
        </div>

        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-3.5 flex items-center justify-center gap-1 font-display uppercase tracking-wide">
          {currentUser.fullName}
          <ShieldCheck size={14} className="text-blue-500" />
        </h3>
        <p className="text-[10px] text-slate-400 font-mono mt-1">@{currentUser.username}</p>

        {/* Bio */}
        <p className="text-[11px] text-slate-600 dark:text-slate-400 italic max-w-[230px] mx-auto mt-2.5 leading-relaxed font-sans">
          "{currentUser.bio}"
        </p>
      </div>

      {/* EDIT PROFILE MODAL TRIGGER */}
      <div className="px-4 pb-2">
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-[#11131A] p-4.5 rounded-[28px] border border-slate-150 dark:border-white/5 space-y-4 text-xs text-left shadow-xs">
            <h4 className="font-extrabold text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Edit Personal Details</h4>
            
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-display">Full Name:</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1C1F28] p-3 rounded-xl outline-none text-slate-805 dark:text-slate-100 border border-slate-200 dark:border-white/5 font-sans"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-display">Bio Capsule:</label>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1C1F28] p-3 rounded-xl outline-none text-slate-805 dark:text-slate-100 border border-slate-200 dark:border-white/5 font-sans"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-display">Base Location:</label>
              <input
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1C1F28] p-3 rounded-xl outline-none text-slate-805 dark:text-slate-100 border border-slate-200 dark:border-white/5 font-sans"
                required
              />
            </div>

            <div className="flex gap-2.5 pt-1.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-100 dark:bg-[#1C1F28] py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider font-display text-[10px] active-press"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 py-2.5 rounded-xl text-white font-bold uppercase tracking-widest font-display text-[10px] active-press"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => {
              setTempName(currentUser.fullName);
              setTempBio(currentUser.bio);
              setTempLocation(currentUser.location);
              setIsEditing(true);
            }}
            className="w-full bg-white dark:bg-[#11131A] border border-slate-200 dark:border-white/5 font-bold text-slate-700 dark:text-slate-300 py-3 rounded-2xl flex items-center justify-center gap-1.5 text-[10px] font-display uppercase tracking-widest shadow-xs hover:border-blue-500/10 active-press transition duration-200"
            id="btn-edit-profile"
          >
            <Edit3 size={11} /> Edit Profile Info
          </button>
        )}
      </div>

      {/* Account Info list */}
      <div className="p-4 pt-2 space-y-4">
        <div className="bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-[24px] p-4.5 text-xs space-y-3.5 shadow-xs">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display block mb-1">Personal Identity</span>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Mail size={13} className="text-blue-500" />
            <span className="truncate font-sans font-medium">{currentUser.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Phone size={13} className="text-green-500" />
            <span className="font-sans font-medium">{currentUser.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <MapPin size={13} className="text-red-500" />
            <span className="font-sans font-medium">{currentUser.location}</span>
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-[24px] p-4.5 text-xs shadow-xs">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display block mb-2.5">My Interests</span>
          
          {/* Tags list */}
          <div className="flex flex-wrap gap-2 mb-3.5">
            {currentUser.interests.length === 0 ? (
              <p className="text-[9px] text-slate-400 font-display uppercase tracking-wider">No tags added yet. Add below!</p>
            ) : (
              currentUser.interests.map((item) => (
                <span
                  key={item}
                  onClick={() => removeInterest(item)}
                  className="bg-blue-50 dark:bg-blue-950/20 text-blue-605 dark:text-blue-400 border border-blue-500/10 font-bold text-[9px] uppercase tracking-wider font-display px-2.5 py-1 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-500 transition duration-150 shadow-xs"
                  title="Click to remove interest"
                >
                  #{item} ×
                </span>
              ))
            )}
          </div>

          <form onSubmit={addInterest} className="flex gap-2">
            <input
              type="text"
              placeholder="Type e.g., 'Music', 'Fitness'..."
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              className="flex-1 bg-[#F4F5F8] dark:bg-[#1C1F28] text-slate-800 dark:text-slate-200 text-xs p-2.5 rounded-xl outline-none border border-slate-200/40 dark:border-white/5"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold p-2 px-4.5 rounded-xl hover:bg-blue-700 font-display uppercase tracking-widest text-[10px] active-press"
            >
              Add
            </button>
          </form>
        </div>

        {/* Dynamic Status Picker */}
        <div className="bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-[24px] p-4.5 text-xs shadow-xs">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display block mb-3">Set Active Status</span>
          <div className="grid grid-cols-3 gap-2 text-center">
            {(['online', 'away', 'offline'] as const).map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`py-2 px-0.5 rounded-xl font-bold uppercase text-[9px] font-display tracking-widest border transition-all duration-200 active-press ${
                  currentUser.status === status
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                    : 'bg-slate-50 dark:bg-[#1C1F28] border-slate-205 text-slate-500'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Security & System Settings */}
        <div className="bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-[24px] p-4.5 text-xs space-y-3 shadow-xs">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display block mb-1">System Settings</span>

          {/* Theme toggler */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-[#151821] p-3 rounded-2xl border border-slate-200/20 dark:border-white/5">
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon size={13} className="text-yellow-400" /> : <Sun size={13} className="text-yellow-600" />}
              <div>
                <h5 className="font-extrabold text-[10px] text-slate-800 dark:text-slate-200 font-display uppercase tracking-wide">Device Interface</h5>
                <p className="text-[8px] text-slate-455 dark:text-slate-500 uppercase tracking-widest mt-0.5 font-display font-medium">Toggles cosmic dark / daylight</p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-slate-400 hover:text-blue-500 transition-colors"
              id="theme-toggler-btn"
            >
              {isDarkMode ? <ToggleRight size={22} className="text-blue-500" /> : <ToggleLeft size={22} />}
            </button>
          </div>

          {/* 2FA toggler */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-[#151821] p-3 rounded-2xl border border-slate-200/20 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Lock size={13} className="text-blue-500" />
              <div>
                <h5 className="font-extrabold text-[10px] text-slate-800 dark:text-slate-200 font-display uppercase tracking-wide">Two-Factor Auth (2FA)</h5>
                <p className="text-[8px] text-slate-455 dark:text-slate-500 uppercase tracking-widest mt-0.5 font-display font-medium">Add secure credentials verification</p>
              </div>
            </div>
            <button
              onClick={() => setEnable2FA(!enable2FA)}
              className="text-slate-400 hover:text-blue-500"
            >
              {enable2FA ? <ToggleRight size={22} className="text-blue-500" /> : <ToggleLeft size={22} />}
            </button>
          </div>

          {/* Private visibility */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-[#151821] p-3 rounded-2xl border border-slate-200/20 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Eye size={13} className="text-pink-500" />
              <div>
                <h5 className="font-extrabold text-[10px] text-slate-800 dark:text-slate-200 font-display uppercase tracking-wide">Private visibility</h5>
                <p className="text-[8px] text-slate-455 dark:text-slate-500 uppercase tracking-widest mt-0.5 font-display font-medium">Hide profile bio from public feeds</p>
              </div>
            </div>
            <button
              onClick={() => setProfilePrivate(!profilePrivate)}
              className="text-slate-400 hover:text-blue-500"
            >
              {profilePrivate ? <ToggleRight size={22} className="text-blue-500" /> : <ToggleLeft size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
