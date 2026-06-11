import React, { useState, useEffect } from 'react';
import { Post, Story, UserProfile } from '../types';
import { Heart, MessageSquare, Send, Share2, Plus, Sparkles, Filter, X, Film, Image as ImageIcon } from 'lucide-react';

interface FeedSectionProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  currentUser: UserProfile;
}

const PHOTO_PRESETS = [
  { name: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500' },
  { name: 'Mountain Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500' },
  { name: 'Tropical Paradise', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500' },
  { name: 'Cyberpunk Streets', url: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=500' },
];

const FILTERS = [
  { id: 'none', name: 'Normal', class: '' },
  { id: 'sepia', name: 'Sepia Vintage', class: 'sepia brightness-95 contrast-105' },
  { id: 'grayscale', name: 'Ink Slate', class: 'grayscale contrast-125' },
  { id: 'warm', name: 'Sunset Warm', class: 'hue-rotate-15 saturate-150' },
  { id: 'neon', name: 'Cyber Glow', class: 'saturate-200 contrast-110 brightness-110 hue-rotate-180' }
];

export default function FeedSection({ posts, setPosts, stories, setStories, currentUser }: FeedSectionProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  
  // Post Creator State
  const [newPostText, setNewPostText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('none');
  const [isReelType, setIsReelType] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Post Interaction States
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [activeSection, setActiveSection] = useState<'posts' | 'reels'>('posts');

  // Story Viewer Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 2; // Increments over 2.5 seconds roughly
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  const handleNextStory = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex(s => s.id === activeStory.id);
    if (currentIndex < stories.length - 1) {
      const nextStory = stories[currentIndex + 1];
      setActiveStory(nextStory);
      setStories(stories.map(s => s.id === nextStory.id ? { ...s, viewed: true } : s));
    } else {
      setActiveStory(null);
    }
  };

  const triggerStory = (story: Story) => {
    setActiveStory(story);
    setStories(stories.map(s => s.id === story.id ? { ...s, viewed: true } : s));
  };

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedPhoto) return;

    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content: newPostText,
      image: isReelType ? undefined : (selectedPhoto || undefined),
      video: isReelType ? 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34281-large.mp4' : undefined,
      likes: 0,
      liked: false,
      comments: [],
      createdAt: 'Just now',
      type: isReelType ? 'reel' : 'post',
      filter: activeFilter !== 'none' ? FILTERS.find(f => f.id === activeFilter)?.class : undefined
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setSelectedPhoto(null);
    setActiveFilter('none');
    setIsReelType(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c_${Date.now()}`,
              username: currentUser.username,
              avatar: currentUser.avatar,
              content: text,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts = posts.filter(post => {
    if (activeSection === 'posts') return post.type === 'post';
    return post.type === 'reel';
  });

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] overflow-y-auto pb-24 scrollbar-none" id="feed-section">
      {/* Stories Tray */}
      <div className="flex items-center space-x-4 p-4 bg-white dark:bg-[#11131A] border-b border-slate-200 dark:border-white/5 shrink-0 overflow-x-auto scrollbar-none">
        {/* Your Story Trigger */}
        <div className="flex flex-col items-center shrink-0 cursor-pointer active-press">
          <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl p-0.5 mb-1 relative flex items-center justify-center">
            <div className="w-full h-full bg-slate-100 dark:bg-[#1C1F28] rounded-[11px] overflow-hidden flex items-center justify-center">
              <img src={currentUser.avatar} className="w-full h-full object-cover" alt="My avatar" />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border border-white dark:border-[#11131A] shadow-lg">
              <Plus size={9} className="stroke-[3]" />
            </div>
          </div>
          <span className="text-[9px] text-slate-500 dark:text-slate-450 font-semibold font-display uppercase tracking-wider">My Story</span>
        </div>

        {/* Dynamic Stories */}
        {stories.filter(s => s.username !== 'Your Story').map((story) => (
          <button
            key={story.id}
            onClick={() => triggerStory(story)}
            className="flex flex-col items-center shrink-0 cursor-pointer active-press focus:outline-none"
            id={`story-button-${story.id}`}
          >
            <div className={`w-14 h-14 bg-gradient-to-tr ${story.viewed ? 'from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800' : 'from-yellow-400 via-red-500 to-pink-500'} rounded-2xl p-0.5 mb-1 flex items-center justify-center`}>
              <div className="w-full h-full bg-[#11131A] rounded-[11px] overflow-hidden">
                <img src={story.avatar} className="w-full h-full object-cover" alt={story.username} />
              </div>
            </div>
            <span className="text-[9px] text-slate-500 dark:text-slate-450 font-semibold font-display uppercase tracking-wider truncate max-w-[64px]">{story.username}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Switches: Feed vs Reels */}
      <div className="flex bg-white dark:bg-[#11131A] border-b border-slate-200 dark:border-white/5 shrink-0">
        <button
          onClick={() => setActiveSection('posts')}
          className={`flex-1 py-3.5 text-center text-[10px] font-black uppercase tracking-widest font-display flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeSection === 'posts' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          id="tab-posts"
        >
          <ImageIcon size={13} /> MEMORIES
        </button>
        <button
          onClick={() => setActiveSection('reels')}
          className={`flex-1 py-3.5 text-center text-[10px] font-black uppercase tracking-widest font-display flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeSection === 'reels' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          id="tab-reels"
        >
          <Film size={13} /> REELS
        </button>
      </div>

      {/* Post Creator Panel */}
      <div className="bg-white dark:bg-[#11131A] border-b border-slate-200 dark:border-white/5 p-4 mb-3">
        <form onSubmit={handleNewPost}>
          <div className="flex gap-3">
            <img src={currentUser.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-150 dark:border-white/10" alt="Me" />
            <div className="flex-1">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={isReelType ? "Paste vertical video URL or write caption for short reel..." : `Whats on your mind, ${currentUser.fullName.split(' ')[0]}?`}
                className="w-full text-xs bg-slate-50 dark:bg-[#1C1F28] text-slate-800 dark:text-slate-100 rounded-2xl p-3 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none border border-slate-200 dark:border-white/5 focus:border-blue-500/50"
                rows={2}
              />

              {/* Photo Preview & Filter Selection */}
              {selectedPhoto && !isReelType && (
                <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-900">
                  <img
                    src={selectedPhoto}
                    alt="Upload Preview"
                    className={`w-full max-h-48 object-cover transition-all ${FILTERS.find(f => f.id === activeFilter)?.class}`}
                  />
                  <div className="absolute top-2 right-2 flex gap-1 bg-black/60 backdrop-blur-md rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="p-1.5 hover:text-blue-400 text-white transition-colors"
                      title="Apply Filter"
                    >
                      <Filter size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPhoto(null); setActiveFilter('none'); }}
                      className="p-1.5 hover:text-red-405 text-white transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  {/* Filter Overlay Drawer */}
                  {showFilterDropdown && (
                    <div className="absolute bottom-0 left-0 right-0 bg-[#0A0B10]/90 backdrop-blur-md p-2 flex gap-2 overflow-x-auto scrollbar-none">
                      {FILTERS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setActiveFilter(f.id)}
                          className={`flex flex-col items-center flex-shrink-0 px-2 py-1 rounded-xl text-[9px] font-display uppercase tracking-wider ${activeFilter === f.id ? 'bg-blue-600 text-white' : 'text-slate-350'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-slate-700 m-0.5 overflow-hidden ${f.class}`}>
                            <img src={selectedPhoto} className="w-full h-full object-cover" alt="" />
                          </div>
                          <span>{f.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Photos Presets Selector if creating a standard Post */}
              {!isReelType && !selectedPhoto && (
                <div className="mt-2.5 text-[10px] text-slate-400 font-display uppercase tracking-wider">
                  <span className="block mb-1 font-semibold opacity-60">Quick Photo Templates:</span>
                  <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
                    {PHOTO_PRESETS.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhoto(photo.url)}
                        className="flex-shrink-0 rounded-xl overflow-hidden relative border border-slate-200 dark:border-white/5 hover:scale-105 active:scale-95 transition-all text-left"
                      >
                        <img src={photo.url} className="w-16 h-12 object-cover brightness-80 hover:brightness-100" alt={photo.name} />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[7px] text-white text-center py-0.5 truncate font-sans">{photo.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Creator Controls bar */}
              <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setIsReelType(false); setSelectedPhoto(selectedPhoto || PHOTO_PRESETS[0].url); }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold font-display uppercase tracking-wider transition-colors active-press ${!isReelType ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' : 'text-slate-450 hover:text-slate-650 dark:hover:text-slate-200'}`}
                  >
                    <Sparkles size={11} /> FEED
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsReelType(true); setSelectedPhoto(null); }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold font-display uppercase tracking-wider transition-colors active-press ${isReelType ? 'bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400' : 'text-slate-450 hover:text-slate-650 dark:hover:text-slate-200'}`}
                  >
                    <Film size={11} /> VIDEO REEL
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newPostText.trim() && !selectedPhoto}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-4 py-1.5 text-[10px] font-bold font-display uppercase tracking-widest flex items-center gap-1 transition-all active-press"
                >
                  POST <Send size={9} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Feed Posts List */}
      <div className="space-y-4 p-4">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#11131A] rounded-[32px] border border-slate-200 dark:border-white/5 text-center">
            <span className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl text-blue-500 mb-2">
              <Sparkles size={20} />
            </span>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-300">Nothing shared here yet</h4>
            <p className="text-[10px] text-slate-450 mt-1 max-w-[180px]">Be the first of your friends to share a post or post a reel video!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-[#11131A] rounded-[32px] border border-slate-150 dark:border-white/5 p-6 shadow-xs" id={`post-${post.id}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-150 dark:border-white/10" alt={post.username} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">@{post.username}</h5>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display block mt-0.5">{post.createdAt}</span>
                  </div>
                </div>
                {post.userId !== currentUser.id ? (
                  <span className="bg-slate-100 dark:bg-[#1C1F28] text-slate-600 dark:text-slate-400 text-[8px] uppercase tracking-widest px-3 py-1 rounded-full font-black font-display">Friend</span>
                ) : (
                  <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[8px] uppercase tracking-widest px-3 py-1 rounded-full font-black font-display">You</span>
                )}
              </div>

              {/* Text content */}
              <p className="text-xs text-slate-700 dark:text-slate-200 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

              {/* Media Container */}
              {post.type === 'reel' && post.video ? (
                <div className="relative mb-4 aspect-[9/16] max-h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-150 dark:border-white/5">
                  <video
                    src={post.video}
                    controls
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-pink-600 text-white font-black text-[8px] uppercase px-3 py-1 rounded-full tracking-widest shadow-lg font-display">
                    REEL ⚡️
                  </div>
                </div>
              ) : post.image ? (
                <div className="relative mb-4 rounded-2xl overflow-hidden border border-slate-150 dark:border-white/5 bg-slate-950">
                  <img
                    src={post.image}
                    loading="lazy"
                    className={`w-full max-h-72 object-cover ${post.filter || ''}`}
                    alt="Shared post"
                  />
                  {post.filter && (
                    <span className="absolute bottom-2.5 right-2.5 bg-[#0A0B10]/80 text-[8px] uppercase tracking-widest font-bold font-display text-white px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      Filtered
                    </span>
                  )}
                </div>
              ) : null}

              {/* Interaction Panel */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-450">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-[10px] p-2 px-3 rounded-xl transition-all font-bold uppercase tracking-wider font-display active-press ${post.liked ? 'text-red-500 bg-red-50 dark:bg-red-950/20 font-black scale-105' : 'hover:bg-slate-50 dark:hover:bg-[#1C1F28]'}`}
                >
                  <Heart size={14} fill={post.liked ? 'currentColor' : 'none'} className="transition-transform" />
                  <span className="font-mono tabular-nums">{post.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 text-[10px] p-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C1F28] font-bold uppercase tracking-wider font-display active-press"
                >
                  <MessageSquare size={14} />
                  <span className="font-mono tabular-nums">{post.comments.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Link Copied! Share @${post.username}'s memory with external boards.`)}
                  className="flex items-center gap-1.5 text-[10px] p-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C1F28] font-bold uppercase tracking-wider font-display active-press"
                >
                  <Share2 size={14} />
                  <span>SHARE</span>
                </button>
              </div>

              {/* Comments drawer */}
              {expandedComments[post.id] && (
                <div className="mt-3 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2.5 animate-fade-in">
                  <div className="max-h-36 overflow-y-auto space-y-2 scrollbar-none">
                    {post.comments.length === 0 ? (
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-display text-center py-2 opacity-65">No comments yet. Start the conversation!</p>
                    ) : (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 text-[11px] bg-slate-50 dark:bg-[#1C1F28] p-2.5 rounded-2xl border border-slate-100 dark:border-white/5">
                          <img src={comment.avatar} className="w-5 h-5 rounded-full object-cover" alt="" />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100">@{comment.username}</span>
                            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{comment.content}</p>
                            <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1">{comment.createdAt}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      placeholder="Add an elegant comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      className="flex-1 bg-slate-50 dark:bg-[#1C1F28] text-slate-800 dark:text-slate-200 outline-none p-2.5 px-4 rounded-xl text-xs border border-slate-200 dark:border-white/5"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 text-white rounded-xl px-4 flex items-center justify-center hover:bg-blue-700 transition-colors active-press"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col justify-between p-4 pb-12 animate-fade-in text-white select-none">
          {/* Progress Indicators */}
          <div className="flex gap-1.5 w-full pt-2">
            <div className="relative flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 bg-white transition-all duration-75"
                style={{ width: `${storyProgress}%` }}
              />
            </div>
          </div>

          {/* Story Header */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <img src={activeStory.avatar} className="w-8 h-8 rounded-full border border-white/20 object-cover" alt="" />
              <span className="text-xs font-bold text-white tracking-wide">{activeStory.username}</span>
              <span className="text-[9px] text-white/60">Live Story</span>
            </div>
            <button
              onClick={() => setActiveStory(null)}
              className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Story Main Media */}
          <div className="flex-1 my-6 flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 bg-black/40">
            <img src={activeStory.media} className="w-full h-full object-contain" alt="Story Media" />
          </div>

          {/* Story Reply Panel */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder={`Reply to ${activeStory.username}...`}
              className="flex-1 bg-white/15 text-white placeholder-white/50 text-xs py-2.5 px-4 rounded-full border border-white/10 focus:bg-white/20 outline-none"
              onKeyDown={(e) => { if (e.key === 'Enter') { alert('Reply sent as direct message!'); setActiveStory(null); } }}
            />
            <button
              onClick={() => { alert('Story Liked!'); setActiveStory(null); }}
              className="p-2.5 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition"
            >
              <Heart size={15} fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
