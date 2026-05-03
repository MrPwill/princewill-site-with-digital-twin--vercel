import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const isDev = process.env.NODE_ENV === "development";
  const backendUrl = isDev 
    ? "http://127.0.0.1:8000/api" 
    : `https://${process.env.VERCEL_URL || "localhost:3000"}/api`;

  const backendRes = await fetch(`${backendUrl}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return new Response(backendRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "session_id parameter required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  const isDev = process.env.NODE_ENV === "development";
  const backendUrl = isDev 
    ? "http://127.0.0.1:8000/api" 
    : `https://${process.env.VERCEL_URL || "localhost:3000"}/api`;
  
  await fetch(`${backendUrl}/chat/session/${sessionId}`, {
    method: "DELETE",
  });
  
  return new Response(JSON.stringify({ cleared: sessionId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}