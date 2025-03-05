import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart } from "lucide-react";

// Initialize the JS client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const Supabase = createClient(supabaseUrl, supabaseKey);


interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_email: string;
  likes: number;
}

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [supabaseEvent, setSupabaseEvent] = useState({})

  // Create a function to handle inserts

  useEffect(() => {
    fetchPosts()
    // Listen to inserts
    const channel = Supabase.channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          console.log("Change received!", payload);
          setSupabaseEvent(payload)
        }
      )
      .subscribe();

      return () => {
        supabase.removeChannel(channel); // Cleanup on unmount
      };
  }, [supabaseEvent]);


  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.trim()) return;

    try {
      const { error } = await supabase.from("posts").insert([
        {
          content: newPost,
          user_id: user.id,
          user_email: user.email,
        },
      ]);

      if (error) throw error;
      setNewPost("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
        </form>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                {post.user_email?.[0].toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium">{post.user_email}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="text-gray-800">{post.content}</p>
            <div className="mt-4 flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <Heart className="w-5 h-5" />
                <span>{post.likes || 0}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <MessageSquare className="w-5 h-5" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
