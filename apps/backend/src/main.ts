import express from "express";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Initialize express app
const app = express();

// Use Clerk middleware to validate session with your apiKey
app.use(clerkMiddleware({ secretKey: process.env.CLERK_API_KEY }));

// Example route to get the user list (protected route)
app.get("/users", requireAuth(), async (req, res) => {
  const user = getAuth(req);

  if (user) {
    try {
      res.json({ message: "Authenticated user data", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching user list" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized: No valid user found" });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Backend server running on http://localhost:3001");
});
