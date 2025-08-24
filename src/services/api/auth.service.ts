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
    roleId: user.roleId,
    accountType: user.accountType,
    avatar: user.avatar,
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn: any = process.env.JWT_EXPIRES_IN;

  const access_token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return access_token;
};

export { handleUserLogin };
