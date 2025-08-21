import { Request, Response } from "express";
import { handleUserLogin } from "services/api/auth.service";

const loginAPI = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const access_token = await handleUserLogin(username, password);
    res.status(200).json({
      data: { access_token },
    });
  } catch (error) {
    res.status(401).json({
      data: null,
      message: error.message,
    });
  }
};

export { loginAPI };
