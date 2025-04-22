
import { ProfileCard } from "@/components/ProfileCard";
import { PostCard } from "@/components/PostCard";
import { TrendingTopics } from "@/components/TrendingTopics";
import { Header } from "@/components/Header";

// Mock user profile data
const profile = {
  name: "Crypto Enthusiast",
  address: "0xf3D58e5B2984a5E8802B869e5bC425Af7dd5a2B",
  bio: "Building the decentralized future. Web3 developer and crypto enthusiast.",
  followers: 245,
  following: 128,
  posts: 42,
  reputation: 87
};

// Mock post data
const posts = [
  {
    id: "1",
    author: {
      name: "Crypto Enthusiast",
      address: "0xf3D58e5B2984a5E8802B869e5bC425Af7dd5a2B",
      reputation: 87
    },
    content: "Just deployed my first smart contract! Building the decentralized future one step at a time. #Ethereum #Web3",
    timestamp: "2h ago",
    likes: 24,
    comments: 5,
    isNFT: true
  },
  {
    id: "2",
    author: {
      name: "Crypto Enthusiast",
      address: "0xf3D58e5B2984a5E8802B869e5bC425Af7dd5a2B",
      reputation: 87
    },
    content: "Thoughts on the latest EIP? I think it's a game changer for scaling solutions.",
    timestamp: "1d ago",
    likes: 32,
    comments: 8
  },
  {
    id: "3",
    author: {
      name: "Crypto Enthusiast",
      address: "0xf3D58e5B2984a5E8802B869e5bC425Af7dd5a2B",
      reputation: 87
    },
    content: "The future is decentralized. Don't let anyone tell you otherwise.",
    timestamp: "3d ago",
    likes: 56,
    comments: 12
  }
];

const Profile = () => {
  return (
    <>
      <Header />
      <div className="container py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ProfileCard profile={profile} isCurrentUser={true} />
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
        <div>
          <TrendingTopics />
        </div>
      </div>
    </>
  );
};

export default Profile;
