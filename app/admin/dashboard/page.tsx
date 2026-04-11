"use client";

import { FormEvent, useState } from "react";

type UserType = "Business" | "Content Creator";

export default function AdminDashboardPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("Business");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Placeholder behavior for preparation stage (no database yet).
    setNotice(`User ${username} prepared as ${userType}.`);

    setUsername("");
    setEmail("");
    setUserType("Business");
    setPassword("");
  }

  return (
    <main className="min-h-screen bg-brand-dark px-4 py-16 text-brand-light">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-brand-surface/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-lg sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight">Register</h1>
        <p className="mt-2 text-sm text-brand-light/70">
          For approved candidates only.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-brand-light/85">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-white/12 bg-brand-dark/80 px-4 py-3 text-brand-light placeholder-brand-light/30 transition-colors focus:border-brand-cyan focus:outline-none"
              placeholder="Input username"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-light/85">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/12 bg-brand-dark/80 px-4 py-3 text-brand-light placeholder-brand-light/30 transition-colors focus:border-brand-cyan focus:outline-none"
              placeholder="name@email.com"
            />
          </div>

          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-medium text-brand-light/85">
              Type
            </label>
            <div className="relative">
              <select
                id="type"
                value={userType}
                onChange={(event) => setUserType(event.target.value as UserType)}
                className="w-full appearance-none rounded-xl border border-white/12 bg-brand-dark/80 px-4 py-3 text-brand-light transition-colors focus:border-brand-cyan focus:outline-none"
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
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-brand-light/85">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/12 bg-brand-dark/80 px-4 py-3 text-brand-light placeholder-brand-light/30 transition-colors focus:border-brand-cyan focus:outline-none"
              placeholder="Create temporary password"
            />
          </div>

          {notice ? (
            <p className="rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-2 text-sm text-brand-cyan">
              {notice}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple py-3.5 text-base font-semibold text-brand-dark shadow-[0_10px_30px_rgba(0,240,255,0.22)] transition-all hover:brightness-110 active:scale-[0.99]"
          >
            Register User
          </button>
        </form>
      </div>
    </main>
  );
}
