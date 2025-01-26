"use clinet";

import { SessionProvider, SessionProviderProps } from "next-auth/react";

export default function Provider({ session, children } : SessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
