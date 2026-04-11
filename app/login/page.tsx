"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AccountType = "Business" | "Content Creator";
type LoginResponse = {
  ok: boolean;
  error?: string;
  type?: AccountType;
};

export default function UserLoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<AccountType>("Business");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identity, password, type }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.ok || !data.type) {
        setError(data.error ?? "Unable to login.");
        return;
      }

      if (data.type === "Business") {
        router.push("/business/dashboard");
      } else {
        router.push("/creator/dashboard");
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-dark px-4 text-brand-light">
      <div className="pointer-events-none absolute top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-cyan/15 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-72 w-72 rounded-full bg-brand-purple/15 blur-[120px]" />

      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 shadow-[0_18px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-9">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.24em] text-brand-cyan/80 uppercase">
            Member Access
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Login</h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-light/65">
            For approved Business and Content Creator accounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="accountType" className="mb-2 block text-sm font-medium text-brand-light/85">
              Account Type
            </label>
            <div className="relative">
              <select
                id="accountType"
                value={type}
                onChange={(event) => setType(event.target.value as AccountType)}
                className="w-full appearance-none rounded-xl border border-white/12 bg-brand-dark/80 px-4 py-3 pr-11 text-brand-light focus:border-brand-cyan focus:outline-none"
              >
                <option value="Business">Business</option>
                <option value="Content Creator">Content Creator</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-brand-light/50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="identity" className="mb-2 block text-sm font-medium text-brand-light/85">
              Email or Username
            </label>
            <input
              id="identity"
              type="text"
              required
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              className="w-full rounded-xl border border-white/12 bg-brand-dark/80 px-4 py-3 text-brand-light placeholder-brand-light/30 focus:border-brand-cyan focus:outline-none"
              placeholder="Input email or username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-brand-light/85">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/12 bg-brand-dark/80 px-4 py-3 text-brand-light placeholder-brand-light/30 focus:border-brand-cyan focus:outline-none"
              placeholder="Input password"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-brand-pink/40 bg-brand-pink/10 px-3 py-2 text-sm text-brand-pink">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple py-3.5 text-base font-semibold text-brand-dark shadow-[0_10px_30px_rgba(0,240,255,0.22)] transition-all hover:brightness-110 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
