import AuthButton from "@/components/auth/AuthButton";
import { useSession } from "next-auth/react";

export default function Test() {
  return (
    <div>
      <h1>Test Page</h1>
      <AuthButton />
    </div>
  );
}
