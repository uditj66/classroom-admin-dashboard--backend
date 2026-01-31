import type { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";
const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "test") return next();

  try {
    const role: RateLimitRole = req.user?.role ?? "guest";
    let limit: number;
    let message: string;
    switch (role) {
      case "admin":
        limit = 20;
        message = "Admin request limit excedded (20 /minute).Slow Down";
        break;

      case "teacher":
      case "student":
        limit = 10;
        message =
          "User request limit excedded (10/minute).Please try after sometime";
        break;
      default:
        limit = 5;
        message =
          "Guest request limit excedded (5/minute).Please try after sometime or sign-up to get higher limits";
    }
    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
      })
    );

    const arcjetRequest: ArcjetNodeRequest = {
      headers: req.headers,
      method: req.method,
      url: req.originalUrl ?? req.url,
      socket: {
        remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
      },
    };

    const decision = await client.protect(arcjetRequest);
    if (decision.isDenied() && decision.reason) {
      if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Automated rqst are not allowed",
          error: "FORBIDDEN",
        });
      }

      if (decision.reason.isShield()) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Request blocked by security Policy ",
        });
      }
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "FORBIDDEN",
          message,
        });
      }
    }
    next();
  } catch (error) {
    console.error("Arcjet Middleware Error", error);
    res.status(500).json({
      error: "Internal Error",
      message: "Something went wrong with security middleware",
    });
  }
};
export default securityMiddleware;
