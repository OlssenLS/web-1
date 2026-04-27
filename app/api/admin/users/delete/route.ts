import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

async function isAdmin() {
  const cookieStore = cookies();
  const adminSession = (await cookieStore).get("admin_session")?.value;
  return !!adminSession;
}

export async function DELETE(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { username } = body;

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  // Delete related data first
  await supabase.from("campaign_invitations").delete().eq("creator_username", username);
  await supabase.from("commissions").delete().eq("creator_username", username);

  // Delete the user
  const { error } = await supabase
    .from("app_users")
    .delete()
    .eq("username", username);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
