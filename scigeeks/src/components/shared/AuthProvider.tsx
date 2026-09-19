"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/ai", "/teacher/dashboard"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (accessToken: string, retries = 2) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      if (isMounted) setLoading(true);

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/api/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          if (retries > 0) {
            fetchingRef.current = false;
            await new Promise((r) => setTimeout(r, 1000));
            if (isMounted) return fetchProfile(accessToken, retries - 1);
          }
          // Profile not found in backend or invalid token
          await supabase.auth.signOut();
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const profileData = await res.json();
        if (profileData.success && profileData.user) {
          if (isMounted) setUser(profileData.user);
        } else {
          if (retries > 0) {
            fetchingRef.current = false;
            await new Promise((r) => setTimeout(r, 1000));
            if (isMounted) return fetchProfile(accessToken, retries - 1);
          }
          await supabase.auth.signOut();
          if (isMounted) setUser(null);
        }
      } catch (err) {
        console.error("Auth profile fetch error:", err);
      } finally {
        fetchingRef.current = false;
        if (isMounted) setLoading(false);
      }
    };

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetchProfile(session.access_token);
        } else {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token) {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await fetchProfile(session.access_token);
        }
      } else if (event === "SIGNED_OUT") {
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
  }, []);

  // Route protection guard
  useEffect(() => {
    if (loading) return;

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtected && !user) {
      router.replace("/login");
    } else if (user && pathname.startsWith("/teacher/dashboard") && user.role !== "teacher") {
      router.replace("/dashboard");
    }
  }, [pathname, user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

