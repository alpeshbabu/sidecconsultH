import { handlers } from "@/lib/auth";

// Use Node.js runtime to support bcrypt
export const runtime = "nodejs";

export const { GET, POST } = handlers;
