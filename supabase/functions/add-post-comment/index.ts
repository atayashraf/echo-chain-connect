
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
    const { postId, content } = await req.json();
    
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

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized: User must be logged in to comment");
    }

    // Insert the new comment
    const { data: newComment, error } = await supabaseClient
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content
      })
      .select(`
        id, 
        content, 
        created_at,
        user_id,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Format the new comment
    const formattedComment = {
      id: newComment.id,
      content: newComment.content,
      created_at: newComment.created_at,
      user: {
        name: newComment.profiles?.display_name || newComment.profiles?.username || "Anonymous User",
        username: newComment.profiles?.username || "anonymous",
        avatar_url: newComment.profiles?.avatar_url || ""
      }
    };

    // Return the new comment
    return new Response(JSON.stringify(formattedComment), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Error in add-post-comment function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
