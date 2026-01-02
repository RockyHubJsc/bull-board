import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req?.isAuthenticated?.()) {
    return next();
  }
  console.log(
    "🚀 ~ isAuthenticated ~ req?.isAuthenticated?.():",
    req?.isAuthenticated?.(),
    req.authInfo,
    req.user,
  );
  res.redirect("/auth/google");
};
