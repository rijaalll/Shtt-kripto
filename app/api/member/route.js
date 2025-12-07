import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";

// Referensi root database untuk members
const MEMBERS_REF = "members";

/**
 * GET: Ambil semua data member
 */
export async function GET() {
  try {
    const ref = db.ref(MEMBERS_REF);
    const snapshot = await ref.once("value");
    const data = snapshot.val();

    // Jika data kosong, return object kosong
    return NextResponse.json(data || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Tambah member baru
 * Body: { "key": "member5", "data": { ... } } atau { ...data } (auto-generate key)
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const ref = db.ref(MEMBERS_REF);

    // Jika user mengirimkan specific key (misal: "member5") di dalam body
    // Contoh body: { "key": "member1", "data": { ... } }
    if (body.key && body.data) {
        await ref.child(body.key).set(body.data);
        return NextResponse.json({ message: "Data saved", key: body.key, data: body.data });
    } 
    
    // Jika ingin push data baru dengan auto-generated ID dari firebase
    const newRef = ref.push();
    await newRef.set(body);

    return NextResponse.json({ message: "Member added", key: newRef.key, data: body });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT: Update data member
 * URL: /api/member?id=member1
 * Body: { "name": "Nama Baru", ... }
 */
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Ambil ID dari URL (misal: member1)

    if (!id) {
      return NextResponse.json({ error: "Parameter 'id' required" }, { status: 400 });
    }

    const body = await req.json();
    const ref = db.ref(`${MEMBERS_REF}/${id}`);

    // Cek apakah data ada sebelum update
    const snapshot = await ref.once("value");
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Lakukan update (hanya field yang dikirim yang berubah)
    await ref.update(body);

    return NextResponse.json({ message: "Member updated", id, updatedData: body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Hapus member
 * URL: /api/member?id=member1
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Parameter 'id' required" }, { status: 400 });
    }

    const ref = db.ref(`${MEMBERS_REF}/${id}`);
    await ref.remove();

    return NextResponse.json({ message: "Member deleted", id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}