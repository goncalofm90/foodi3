import { NextResponse } from "next/server";
import { client } from "@/lib/client";
import { TablesDB } from "appwrite";

const tables = new TablesDB(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, name, avatar = "", oauthProvider = "" } = body;

    try {
      // First, try to get the existing row
      const existingRow = await tables.getRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!,
        rowId: userId,
      });

      return NextResponse.json({ 
        message: "User already exists",
        user: existingRow,
        action: "skipped"
      });
      
    } catch (getError: any) {
      if (getError.code === 404 || getError.type === 'document_not_found') {
        
        const row = await tables.createRow({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!,
          rowId: userId,
          data: { 
            email, 
            name,
            avatar,
            oauthProvider,
            createdAt: new Date().toISOString()
          },
          read: [`user:${userId}`],
          write: [`user:${userId}`],
        });

        return NextResponse.json({ 
          message: "User created",
          user: row,
          action: "created"
        });
      }
      
      // If it's a different error, throw it
      throw getError;
    }
    
  } catch (err: any) {
    console.error("❌ API Error:", err);
    return NextResponse.json({ 
      error: err.message,
      code: err.code,
      type: err.type
    }, { status: 500 });
  }
}