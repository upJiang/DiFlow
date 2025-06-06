import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);

    if (session) {
      return NextResponse.json({
        isAuthenticated: true,
        user: {
          id: session.userId,
          email: session.email,
          name: session.name,
        },
      });
    } else {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }
  } catch (error) {
    console.error("Auth status check error:", error);
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }
}
