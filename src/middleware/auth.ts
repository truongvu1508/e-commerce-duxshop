import { NextFunction, Request, Response } from "express";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    res.redirect("/");
  } else {
    next();
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (user?.role?.name === "ADMIN") {
    res.redirect("/admin");
  } else {
    res.redirect("/");
  }
};

export { isLogin, isAdmin };
