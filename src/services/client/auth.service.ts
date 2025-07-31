import { prisma } from "config/client";
import bcrypt from "bcrypt";
import { ACCOUNT_TYPE } from "config/constant";
const saltRounds = 10;

const isEmailExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { username: email },
  });
  if (user) {
    return true;
  }
  return false;
};

const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, saltRounds);
};

const registerNewUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const newPassword = await hashPassword(password);

  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (userRole) {
    const newUser = await prisma.user.create({
      data: {
        fullName: fullName,
        username: email,
        password: newPassword,
        accountType: ACCOUNT_TYPE.SYSTEM,
        roleId: userRole.id,
      },
    });
    return newUser;
  } else {
    throw new Error("Role không tồn tại");
  }
};

export { isEmailExist, registerNewUser };
