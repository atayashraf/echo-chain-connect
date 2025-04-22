
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get the request body
    const { tagName } = await req.json();
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the current user for checking likes
    const { data: { session } } = await supabaseClient.auth.getSession();
    const userId = session?.user.id;

    // Query posts containing the specified tag
    const { data: posts, error } = await supabaseClient
      .from("posts")
      .select(`
        id, 
        content, 
        created_at, 
        likes_count, 
        post_type,
        user_id,
        profiles:user_id (id, username, display_name, avatar_url, reputation_score),
        comments:comments(count),
        likes(user_id)
      `)
      .ilike("content", `%#${tagName}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    // Format posts data
    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at,
      likes_count: post.likes_count || 0,
      post_type: post.post_type,
      user: {
        id: post.user_id,
        username: post.profiles?.username || "anonymous",
        display_name: post.profiles?.display_name || post.profiles?.username || "Anonymous User",
        avatar_url: post.profiles?.avatar_url || "",
        reputation_score: post.profiles?.reputation_score || 0
      },
      comments_count: post.comments?.length || 0,
      user_has_liked: userId ? post.likes?.some((like: any) => like.user_id === userId) : false
    }));

    // Return the posts
    return new Response(JSON.stringify(formattedPosts), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-posts-by-tag function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
