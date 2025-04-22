
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
      throw new Error("Unauthorized: User must be logged in to view notifications");
    }

    // Get the user's notifications
    const { data: notifications, error } = await supabaseClient
      .from("notifications")
      .select(`
        id, 
        type, 
        user_id, 
        actor_id, 
        post_id, 
        content, 
        read, 
        created_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Get actor profile information
    const actorIds = notifications.map(notification => notification.actor_id).filter(Boolean);
    let actorProfiles = {};
    
    if (actorIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabaseClient
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", actorIds);
      
      if (profilesError) throw profilesError;
      
      actorProfiles = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
    }

    // Format notification data
    const formattedNotifications = notifications.map(notification => {
      const actor = actorProfiles[notification.actor_id] || null;
      
      return {
        id: notification.id,
        type: notification.type,
        user_id: notification.user_id,
        actor_id: notification.actor_id,
        post_id: notification.post_id,
        content: notification.content,
        read: notification.read,
        created_at: notification.created_at,
        actor: actor ? {
          username: actor.username || "anonymous",
          display_name: actor.display_name || actor.username || "Anonymous User",
          avatar_url: actor.avatar_url || ""
        } : {
          username: "anonymous",
          display_name: "Anonymous User",
          avatar_url: ""
        }
      };
    });

    // Return the notifications
    return new Response(JSON.stringify(formattedNotifications), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-user-notifications function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
