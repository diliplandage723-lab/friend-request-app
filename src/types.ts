export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  status: 'online' | 'offline' | 'away';
  interests: string[];
  location: string;
  phone: string;
  email: string;
  verified: boolean;
  score: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  image?: string;
  video?: string;
  content: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  createdAt: string;
  type: 'post' | 'reel';
  filter?: string;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  media: string;
  viewed: boolean;
  type: 'image' | 'video';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'voice' | 'sticker' | 'file';
  attachmentUrl?: string;
  voiceDuration?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  members: string[]; // User IDs
  messages: Message[];
  unreadCount: number;
  lastUpdated: string;
  typing?: boolean;
}

export interface CallRecord {
  id: string;
  name: string;
  avatar: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw';
  amount: number;
  peerName?: string;
  peerAvatar?: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  paymentMethod: 'Wallet' | 'UPI' | 'Card' | 'Bank';
}

export interface GameScore {
  id: string;
  gameName: string;
  playerName: string;
  avatar: string;
  score: number;
  rank: number;
  date: string;
}

export interface ReportItem {
  id: string;
  reporterName: string;
  reportedName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}
