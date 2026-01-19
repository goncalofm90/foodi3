import { NextResponse } from "next/server";
import { databases } from "@/lib/client"; // Use server client
import { Query, Permission, Role, ID } from "node-appwrite"; // Use node-appwrite

export async function POST(req: Request) {
  try {
    const { userId, itemId, name, type, thumbnail } = await req.json();

    const doc = await databases.createDocument(
      "696e11bf0018c296817c",
      "favourites",
      ID.unique(),
      { userId, itemId, name, type, thumbnail },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    return NextResponse.json(doc);
  } catch (error: any) {
    console.error("Error creating favourite:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create favourite" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const docs = await databases.listDocuments(
      "696e11bf0018c296817c",
      "favourites",
      [Query.equal("userId", userId)]
    );

    return NextResponse.json(docs.documents);
  } catch (error: any) {
    console.error("Error fetching favourites:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch favourites" },
      { status: 500 }
    );
  }
}