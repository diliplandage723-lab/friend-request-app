import { UserProfile, Post, Story, Chat, CallRecord, Transaction, GameScore, ReportItem } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user_me',
  username: 'diliplandage',
  fullName: 'Dilip Landage',
  avatar: 'https://picsum.photos/id/64/150/150',
  bio: 'Living life one connection at a time. Tech explorer, gamer, and digital developer!',
  status: 'online',
  interests: ['Gaming', 'Fintech', 'Coding', 'Travel', 'Crypto'],
  location: 'Mumbai, India',
  phone: '+91 98765 43210',
  email: 'diliplandage723@gmail.com',
  verified: true,
  score: 1250
};

export const INITIAL_FRIENDS: UserProfile[] = [
  {
    id: 'user_alice',
    username: 'alice_vance',
    fullName: 'Alice Vance',
    avatar: 'https://picsum.photos/id/1025/150/150',
    bio: 'Product Designer & Coffee Addict. Always up for a Tic-Tac-Toe duel!',
    status: 'online',
    interests: ['Gaming', 'Design', 'Fintech'],
    location: 'San Francisco, USA',
    phone: '+1 415 555 2671',
    email: 'alice@vance.io',
    verified: true,
    score: 980
  },
  {
    id: 'user_bob',
    username: 'bob_miller',
    fullName: 'Bob Miller',
    avatar: 'https://picsum.photos/id/338/150/150',
    bio: 'Wanderlust explorer. Hiking through life 🌲 Crypto trader on weekends.',
    status: 'away',
    interests: ['Travel', 'Crypto', 'Music'],
    location: 'Munich, Germany',
    phone: '+49 89 20193',
    email: 'bob@miller.de',
    verified: false,
    score: 650
  },
  {
    id: 'user_charlie',
    username: 'charlie_t',
    fullName: 'Charlie Thompson',
    avatar: 'https://picsum.photos/id/1012/150/150',
    bio: 'Fullstack engineer. I turn coffee into clean, reusable typescript models ☕️',
    status: 'online',
    interests: ['Coding', 'Gaming', 'Tech'],
    location: 'London, UK',
    phone: '+44 20 7946 0912',
    email: 'charlie@codes.dev',
    verified: true,
    score: 1420
  },
  {
    id: 'user_dana',
    username: 'dana_rose',
    fullName: 'Dana Rose',
    avatar: 'https://picsum.photos/id/342/150/150',
    bio: 'Fitness coach. Mind, body, and secure digital finance. Lets motivate each other.',
    status: 'offline',
    interests: ['Fitness', 'Fintech', 'Travel'],
    location: 'Sydney, Australia',
    phone: '+61 2 9382 0184',
    email: 'dana.rose@fitness.fit',
    verified: true,
    score: 870
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'st_1',
    username: 'Your Story',
    avatar: 'https://picsum.photos/id/64/150/150',
    media: 'https://picsum.photos/id/48/400/700',
    viewed: false,
    type: 'image'
  },
  {
    id: 'st_2',
    username: 'alice_vance',
    avatar: 'https://picsum.photos/id/1025/150/150',
    media: 'https://picsum.photos/id/237/400/700',
    viewed: false,
    type: 'image'
  },
  {
    id: 'st_3',
    username: 'charlie_t',
    avatar: 'https://picsum.photos/id/1012/150/150',
    media: 'https://picsum.photos/id/22/400/700',
    viewed: false,
    type: 'image'
  },
  {
    id: 'st_4',
    username: 'bob_miller',
    avatar: 'https://picsum.photos/id/338/150/150',
    media: 'https://picsum.photos/id/10/400/700',
    viewed: true,
    type: 'image'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p_1',
    userId: 'user_alice',
    username: 'alice_vance',
    avatar: 'https://picsum.photos/id/1025/150/150',
    image: 'https://picsum.photos/id/1016/500/350',
    content: 'Just launched my new UI design concept! What do you guys think of the light and dark mode switches? Let me know in the comments! 🚀💅',
    likes: 42,
    liked: false,
    comments: [
      {
        id: 'c_1',
        username: 'charlie_t',
        avatar: 'https://picsum.photos/id/1012/150/150',
        content: 'Looks incredibly clean, Alice! Love the contrast.',
        createdAt: '2 hrs ago'
      }
    ],
    createdAt: '3 hrs ago',
    type: 'post'
  },
  {
    id: 'p_2',
    userId: 'user_charlie',
    username: 'charlie_t',
    avatar: 'https://picsum.photos/id/1012/150/150',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34281-large.mp4',
    content: 'Late night sessions coding in TypeScript and listening to lo-fi beats. Perfection ☕️💻 #developer #react #ts',
    likes: 80,
    liked: true,
    comments: [],
    createdAt: '5 hrs ago',
    type: 'reel'
  },
  {
    id: 'p_3',
    userId: 'user_bob',
    username: 'bob_miller',
    avatar: 'https://picsum.photos/id/338/150/150',
    image: 'https://picsum.photos/id/1035/500/350',
    content: 'High up in the Alps! The cold air is therapeutic. Who is joining me on the next trek?',
    likes: 124,
    liked: false,
    comments: [
      {
        id: 'c_2',
        username: 'dana_rose',
        avatar: 'https://picsum.photos/id/342/150/150',
        content: 'Unbelievable view Bob! Im definitely down for the next hike! ⛰️',
        createdAt: '1 hr ago'
      }
    ],
    createdAt: '1 day ago',
    type: 'post'
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_alice',
    name: 'Alice Vance',
    avatar: 'https://picsum.photos/id/1025/150/150',
    isGroup: false,
    members: ['user_me', 'user_alice'],
    messages: [
      {
        id: 'm1',
        senderId: 'user_alice',
        senderName: 'Alice Vance',
        content: 'Hey Dilip! How is your new applet coming along?',
        timestamp: '10:14 AM',
        type: 'text'
      },
      {
        id: 'm2',
        senderId: 'user_me',
        senderName: 'Dilip Landage',
        content: 'Hey Alice! Going great, just finishing the real-time calling and digital wallet sections today!',
        timestamp: '10:15 AM',
        type: 'text'
      },
      {
        id: 'm3',
        senderId: 'user_alice',
        senderName: 'Alice Vance',
        content: 'Awesome, can’t wait to play the Tap Duel with you inside the app!',
        timestamp: '10:16 AM',
        type: 'text'
      }
    ],
    unreadCount: 0,
    lastUpdated: '10:16 AM'
  },
  {
    id: 'chat_charlie',
    name: 'Charlie Thompson',
    avatar: 'https://picsum.photos/id/1012/150/150',
    isGroup: false,
    members: ['user_me', 'user_charlie'],
    messages: [
      {
        id: 'm4',
        senderId: 'user_charlie',
        senderName: 'Charlie Thompson',
        content: 'Hey, I sent you the split payment of $25 for dinner last night via Friend Request QR Pay!',
        timestamp: 'Yesterday',
        type: 'text'
      },
      {
        id: 'm5',
        senderId: 'user_me',
        senderName: 'Dilip Landage',
        content: 'Recieved! High five to that super fast transaction 💸🔥',
        timestamp: 'Yesterday',
        type: 'text'
      }
    ],
    unreadCount: 0,
    lastUpdated: 'Yesterday'
  },
  {
    id: 'chat_group',
    name: 'App Builders Club 🚀',
    avatar: 'https://picsum.photos/id/40/150/150',
    isGroup: true,
    members: ['user_me', 'user_alice', 'user_charlie', 'user_bob'],
    messages: [
      {
        id: 'mg1',
        senderId: 'user_bob',
        senderName: 'Bob Miller',
        content: 'What is our plan for the hackathon guys?',
        timestamp: 'Monday',
        type: 'text'
      },
      {
        id: 'mg2',
        senderId: 'user_alice',
        senderName: 'Alice Vance',
        content: 'We are definitely using "Friend Request" to coordinate payments and play post-hackathon games!',
        timestamp: 'Monday',
        type: 'text'
      },
      {
        id: 'mg3',
        senderId: 'user_charlie',
        senderName: 'Charlie Thompson',
        content: '100% agreed. I already pushed the repo setup.',
        timestamp: 'Monday',
        type: 'text'
      }
    ],
    unreadCount: 2,
    lastUpdated: 'Monday'
  }
];

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'c_rec_1',
    name: 'Alice Vance',
    avatar: 'https://picsum.photos/id/1025/150/150',
    type: 'video',
    direction: 'incoming',
    timestamp: 'Today, 11:30 AM',
    duration: '4m 12s'
  },
  {
    id: 'c_rec_2',
    name: 'Charlie Thompson',
    avatar: 'https://picsum.photos/id/1012/150/150',
    type: 'voice',
    direction: 'outgoing',
    timestamp: 'Yesterday, 5:45 PM',
    duration: '12m 4s'
  },
  {
    id: 'c_rec_3',
    name: 'Bob Miller',
    avatar: 'https://picsum.photos/id/338/150/150',
    type: 'video',
    direction: 'missed',
    timestamp: 'Yesterday, 2:15 PM'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'receive',
    amount: 25.00,
    peerName: 'Charlie Thompson',
    peerAvatar: 'https://picsum.photos/id/1012/150/150',
    status: 'completed',
    timestamp: 'Jun 10, 2026, 8:42 PM',
    paymentMethod: 'UPI'
  },
  {
    id: 'tx_2',
    type: 'send',
    amount: 12.50,
    peerName: 'Alice Vance',
    peerAvatar: 'https://picsum.photos/id/1025/150/150',
    status: 'completed',
    timestamp: 'Jun 09, 2026, 1:15 PM',
    paymentMethod: 'Wallet'
  },
  {
    id: 'tx_3',
    type: 'deposit',
    amount: 150.00,
    status: 'completed',
    timestamp: 'Jun 05, 2026, 10:00 AM',
    paymentMethod: 'Bank'
  },
  {
    id: 'tx_4',
    type: 'receive',
    amount: 45.00,
    peerName: 'Bob Miller',
    peerAvatar: 'https://picsum.photos/id/338/150/150',
    status: 'completed',
    timestamp: 'May 30, 2026, 6:30 PM',
    paymentMethod: 'Card'
  }
];

export const INITIAL_LEADERBOARD: GameScore[] = [
  { id: 'l1', gameName: 'Tap Duel', playerName: 'Charlie Thompson', avatar: 'https://picsum.photos/id/1012/150/150', score: 284, rank: 1, date: 'Jun 10, 2026' },
  { id: 'l2', gameName: 'Tap Duel', playerName: 'diliplandage', avatar: 'https://picsum.photos/id/64/150/150', score: 245, rank: 2, date: 'Jun 11, 2026' },
  { id: 'l3', gameName: 'Tap Duel', playerName: 'Alice Vance', avatar: 'https://picsum.photos/id/1025/150/150', score: 215, rank: 3, date: 'Jun 09, 2026' },
  { id: 'l4', gameName: 'Tic-Tac-Toe Arena', playerName: 'Alice Vance', avatar: 'https://picsum.photos/id/1025/150/150', score: 45, rank: 1, date: 'Jun 08, 2026' },
  { id: 'l5', gameName: 'Tic-Tac-Toe Arena', playerName: 'diliplandage', avatar: 'https://picsum.photos/id/64/150/150', score: 32, rank: 2, date: 'Jun 11, 2026' },
  { id: 'l6', gameName: 'Tic-Tac-Toe Arena', playerName: 'Bob Miller', avatar: 'https://picsum.photos/id/338/150/150', score: 28, rank: 3, date: 'Jun 10, 2026' }
];

export const INITIAL_REPORTS: ReportItem[] = [
  { id: 'rep_1', reporterName: 'Bob Miller', reportedName: 'spammer_99', reason: 'Spamming financial scam links under post comments.', status: 'pending', timestamp: 'Today, 1:04 AM' },
  { id: 'rep_2', reporterName: 'Alice Vance', reportedName: 'troll_bot', reason: 'Abusive language and harassment in public group chat.', status: 'resolved', timestamp: 'Yesterday, 4:20 PM' }
];

export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(`friend_req_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error('Error loading key: ', key, e);
    return defaultValue;
  }
};

export const saveData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`friend_req_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving key: ', key, e);
  }
};
