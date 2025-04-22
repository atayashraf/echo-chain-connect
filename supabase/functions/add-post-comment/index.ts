
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
    const { data: commentData, error: commentError } = await supabaseClient
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content
      })
      .select()
      .single();

    if (commentError) throw commentError;

    // Now fetch user profile data separately
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    // Format the new comment with user data
    const formattedComment = {
      id: commentData.id,
      content: commentData.content,
      created_at: commentData.created_at,
      user: {
        name: profileData?.display_name || profileData?.username || "Anonymous User",
        username: profileData?.username || "anonymous",
        avatar_url: profileData?.avatar_url || ""
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
