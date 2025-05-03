import { verifyToken } from "@clerk/express";

export const authenticateUser = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const user = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });

    if (!user) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error(error);
    return next(new Error("Authentication error: Invalid token"));
  }
};
