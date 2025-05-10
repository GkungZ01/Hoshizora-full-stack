'use client'

import React, { useEffect, useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiGithub, FiLogIn, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import styles from "./SignIn.module.css";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for registration success
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      setSuccessMessage("ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบด้วยบัญชีที่สร้างไว้");
    }

    if (status === "authenticated") {
      router.push("/");
    }

    // Create starry background
    if (starsRef.current) {
      const starsContainer = starsRef.current;
      starsContainer.innerHTML = '';

      const numStars = 80;
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = styles.star;

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;

        const scale = Math.random() * 1.2 + 0.3;
        const opacity = Math.random() * 0.5 + 0.2;
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * 2;

        star.style.setProperty('--scale', scale.toString());
        star.style.setProperty('--opacity', opacity.toString());
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `${delay}s`);

        starsContainer.appendChild(star);
      }
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
    <div className="w-full h-full flex items-center justify-center px-4 relative">
      <div className={styles.starryBackground}></div>
      <div className={styles.stars} ref={starsRef}></div>

      <div className={styles.glassCard}>
        <h1 className={styles.pageTitle}>ยินดีต้อนรับกลับ</h1>

        {successMessage && (
          <div className={styles.alertSuccess}>
            <FiCheckCircle className="text-lg" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className={styles.alertError}>
            <FiAlertCircle className="text-lg" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              อีเมล
            </label>
            <div className="relative">
              <FiMail className={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              รหัสผ่าน
            </label>
            <div className="relative">
              <FiLock className={styles.inputIcon} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <a href="#" className={styles.forgotPasswordLink}>
              ลืมรหัสผ่าน?
            </a>
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? (
              <>กำลังเข้าสู่ระบบ...</>
            ) : (
              <>
                <FiLogIn size={18} />
                เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>

        <div className={styles.divider}>หรือ</div>

        <button
          className={styles.secondaryButton}
          onClick={() => signIn("github")}
        >
          <FiGithub size={18} />
          เข้าสู่ระบบด้วย GitHub
        </button>

        <p className={styles.footerText}>
          ยังไม่มีบัญชี?{" "}
          <a href="/auth/signUp" className={styles.footerLink}>
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
}
