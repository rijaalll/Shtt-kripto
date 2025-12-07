"use server";

export async function getSystemInfoAction() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${BACKEND_URL}`, { 
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil info server");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error fetching system info:", error);
    return null;
  }
}