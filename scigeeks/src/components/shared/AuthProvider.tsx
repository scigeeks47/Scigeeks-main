"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // 1. Session and Profile Lifecycle: Runs once on mount, updates only on session auth changes
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (accessToken: string, retries = 2) => {
      if (isMounted) setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          if (retries > 0) {
            await new Promise(r => setTimeout(r, 600));
            if (isMounted) return fetchProfile(accessToken, retries - 1);
          }
          await supabase.auth.signOut();
          if (isMounted) {
            setUser(null);
            router.push("/login?error=profile_not_found");
          }
          return;
        }

        const profileData = await res.json();
        if (profileData.success && profileData.user) {
          if (isMounted) setUser(profileData.user);
        } else {
          if (retries > 0) {
            await new Promise(r => setTimeout(r, 600));
            if (isMounted) return fetchProfile(accessToken, retries - 1);
          }
          await supabase.auth.signOut();
          if (isMounted) {
            setUser(null);
            router.push("/login?error=profile_not_found");
          }
        }
      } catch (err) {
        console.error("AuthGuard profile fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.access_token);
      } else {
        if (isMounted) setLoading(false);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (isMounted) setLoading(true);
          await fetchProfile(session.access_token);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // 2. Client-side Navigation Route Guard: Redirects immediately on pathname transition if unauthorized
  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/ai", "/teacher/dashboard"];
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

    if (!loading && isProtected && !user) {
      router.push("/login");
    } else if (!loading && user && pathname.startsWith("/teacher/dashboard") && user.role !== "teacher") {
      router.push("/dashboard");
    }
  }, [pathname, user, loading, router]);
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
