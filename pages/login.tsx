import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const router = useRouter();

  async function signInWithEmail() {
    try {
      if (email && password) {
        const res = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (res.error) throw res.error;
        const userId = res.data.user?.id;
        console.log("User ID authenticated:", userId);
        router.push("/");
      }
    } catch {
      console.log("Error signing up with email");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="mt-4 text-2xl font-bold text-center">
        Barebones Linktree
      </h1>
      <div className="w-full max-w-xs form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="joe@joe.com"
          className="w-full max-w-xs input input-bordered"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="w-full max-w-xs form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="w-full max-w-xs input input-bordered"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="mt-4 btn" onClick={() => signInWithEmail()}>
        Login
      </button>
    </div>
  );
}
