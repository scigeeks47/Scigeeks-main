import { ClassItem, CreateClassInput } from "../types/classroom";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/teacher`;

export async function createClass(
  token: string,
  input: CreateClassInput
): Promise<{ success: boolean; class?: ClassItem; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });
    return await res.json();
  } catch (err: any) {
    console.error("API createClass error:", err);
    return { success: false, message: "Network connection failed" };
  }
}

export async function listClasses(
  token: string
): Promise<{ success: boolean; classes?: ClassItem[]; message?: string }> {
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
): Promise<{ success: boolean; class?: ClassItem; message?: string }> {
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

export async function deleteClass(
  token: string,
  classId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/classes/${classId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: any) {
    console.error("API deleteClass error:", err);
    return { success: false, message: "Network connection failed" };
  }
}
