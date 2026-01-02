import { Router } from "express";
import passport from "../auth/googleStrategy";
import { renderAuthFailed } from "../views/authFailed";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    failureMessage: true,
  }),
  (req, res) => {
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect("/auth/failed?error=session_save_failed");
      }
      res.redirect("/");
    });
  },
);

router.get("/auth/failed", (req, res) => {
  const session = req.session as any;
  const message = session.messages?.[0] || (req.query.error as string);
  res.send(renderAuthFailed(message));
  if (session.messages) {
    session.messages = [];
  }
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
