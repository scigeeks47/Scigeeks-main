import { ClassItem } from "../types/classroom";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/student`;

export async function joinClass(
  token: string,
  joinCode: string
): Promise<{ success: boolean; class?: ClassItem; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/classes/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ joinCode }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("API joinClass error:", err);
    return { success: false, message: "Network connection failed" };
  }
}

export async function listClasses(
  token: string
): Promise<{ success: boolean; classes?: { joined_at: string; class: ClassItem }[]; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/classes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: any) {
    console.error("API listClasses error:", err);
    return { success: false, message: "Network connection failed" };
  }
}

export async function getClass(
  token: string,
  classId: string
): Promise<{ success: boolean; joined_at?: string; class?: ClassItem; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/classes/${classId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: any) {
    console.error("API getClass error:", err);
    return { success: false, message: "Network connection failed" };
  }
}
