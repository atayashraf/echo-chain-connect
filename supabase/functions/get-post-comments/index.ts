
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
    const { postId } = await req.json();
    
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

    // Get comments for the post with author information
    const { data: comments, error } = await supabaseClient
      .from("comments")
      .select(`
        id, 
        content, 
        created_at,
        user_id,
        profiles(username, display_name, avatar_url)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format comments data
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      user: {
        name: comment.profiles?.display_name || comment.profiles?.username || "Anonymous User",
        username: comment.profiles?.username || "anonymous",
        avatar_url: comment.profiles?.avatar_url || ""
      }
    }));

    // Return the comments
    return new Response(JSON.stringify(formattedComments), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-post-comments function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
