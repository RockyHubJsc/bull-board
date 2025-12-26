import { Router } from "express";
import passport from "../auth/googleStrategy";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failed" }),
  (req, res) => {
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect("/auth/failed");
      }
      res.redirect("/");
    });
  },
);

router.get("/auth/failed", (_req, res) => {
  res.send(
    '<h1>Authentication Failed</h1><a href="/auth/google">Try Again</a>',
  );
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
