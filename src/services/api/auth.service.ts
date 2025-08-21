import { prisma } from "config/client";
import { comparePassword } from "services/user.service";
import jwt from "jsonwebtoken";
import "dotenv/config";

const handleUserLogin = async (username: string, password: string) => {
  // check user exist in database
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid username or password");
  }

  // access token
  const payload = {
    id: user.id,
    username: user.username,
    role: user.roleId,
  };
  const secret = process.env.JKT_SECRET;
  const access_token = jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
  return access_token;
};

export { handleUserLogin };
