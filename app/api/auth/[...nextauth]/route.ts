import { handlers } from "@/lib/auth";
// This file is the API route for NextAuth authentication. 
// It uses the handlers exported from "@/lib/auth" to manage authentication-related requests. 
// The GET handler is used for fetching the current session, while the POST handler is used for signing in users. 
// By exporting these handlers, we allow Next.js to route authentication requests to the appropriate logic defined in "@/lib/auth".
export const { GET, POST } = handlers;