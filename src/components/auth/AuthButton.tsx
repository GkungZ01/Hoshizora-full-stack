'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import { use, useEffect } from "react";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <h1>Signed in as {session?.user?.email}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn("github")}>Sign in</button>
      )}
    </div>
  );
};
