import { NextResponse } from "next/server";
import { addUser, type AccountType } from "@/lib/auth-store";

type RegisterBody = {
  username?: string;
  email?: string;
  password?: string;
  type?: AccountType;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterBody | null;

  const username = body?.username?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const password = body?.password?.trim() ?? "";
  const type = body?.type;

  if (!username || !email || !password || !type) {
    return NextResponse.json(
      { ok: false, error: "All fields are required." },
      { status: 400 }
    );
  }

  if (type !== "Business" && type !== "Content Creator") {
    return NextResponse.json(
      { ok: false, error: "Invalid account type." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  try {
    const result = await addUser({ username, email, type, password });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, type: result.user.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json(
      {
        ok: false,
        error:
          process.env.NODE_ENV === "development"
            ? `Supabase error: ${message}`
            : "Registration is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
