// src/app/api/favourites/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/client";
import { TablesDB } from "appwrite";


const tables = new TablesDB(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const FAVOURITES_TABLE_ID = process.env.NEXT_PUBLIC_APPWRITE_FAVOURITES_TABLE_ID!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, itemId, name, type, thumbnail } = body;

    if (!userId || !itemId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create favourite row (unique per user + item)
    const doc = await tables.createRow({
    databaseId: DATABASE_ID,
    tableId: FAVOURITES_TABLE_ID,
    data: { userId, itemId, name, type, thumbnail },
    permissions: [`user:${userId}`], 
    rowId: `${itemId}_${userId}`,
  });

    return NextResponse.json(doc);
  } catch (err: any) {
    console.error("Error saving favourite:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // List rows in favourites table for this user
    const docs = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: FAVOURITES_TABLE_ID,
      queries: [`userId = "${userId}"`],
    });

    return NextResponse.json(docs.rows);
  } catch (err: any) {
    console.error("Error fetching favourites:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}