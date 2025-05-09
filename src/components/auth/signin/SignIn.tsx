'use client'

import { signIn, useSession, signOut } from "next-auth/react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiGithub } from "react-icons/fi";
import styles from "./SignIn.module.css";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      setSuccessMessage("ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบด้วยบัญชีที่สร้างไว้");
    }

    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className={styles.glassCard}>
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>

        {successMessage && (
          <div className="alert alert-success mb-4">
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="input input-bordered pl-10 w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered pl-10 w-full"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>

          <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="divider my-6">OR</div>

        <button className="btn btn-outline w-full gap-2"
          onClick={() => signIn("github")}>
          <FiGithub className="w-5 h-5" />
          Continue with GitHub
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/auth/signUp" className="link link-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
