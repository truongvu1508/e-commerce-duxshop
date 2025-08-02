import { prisma } from "config/client";
import bcrypt from "bcrypt";
import { ACCOUNT_TYPE } from "config/constant";
import { comparePassword, hashPassword } from "services/user.service";
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

const handleLogin = async (
  username: string,
  password: string,
  callback: any
) => {
  // check user exist in database
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    // error
    // throw new Error(`Username: ${username} not found`);
    return callback(null, false, {
      message: `Username/Password not found`,
    });
  }

  // compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    // error
    // throw new Error(`Invalid password`);
    return callback(null, false, {
      message: `Username/Password not found`,
    });
  }

  return callback(null, user);
};

const getUserWithRoleById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: +id },
    include: { role: true },
    omit: {
      password: true,
    },
  });
  return user;
};

export { isEmailExist, registerNewUser, handleLogin, getUserWithRoleById };
