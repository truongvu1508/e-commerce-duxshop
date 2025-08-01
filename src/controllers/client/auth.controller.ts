import { Request, Response } from "express";
import {
  RegisterSchema,
  TRegisterSchema,
} from "src/validation/register.schema";
import { TProductSchema } from "src/validation/product.schema";
import { registerNewUser } from "services/client/auth.service";

const getLoginPage = async (req: Request, res: Response) => {
  const user = req.user;
  const { session } = req as any;
  const messages = session?.messages ?? [];
  return res.render("client/auth/login.ejs", { messages: messages });
};

const getRegisterPage = async (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    name: "",
    price: "",
    detailDesc: "",
    shortDesc: "",
    quantity: "",
    factory: "",
    target: "",
  };

  return res.render("client/auth/register.ejs", {
    errors: errors,
    oldData: oldData,
  });
};

const postRegister = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } =
    req.body as TRegisterSchema;

  const validate = await RegisterSchema.safeParseAsync(req.body);

  if (!validate.success) {
    // error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message} (${item.path[0]})`
    );
    const oldData = {
      fullName,
      email,
      password,
      confirmPassword,
    };
    return res.render("client/auth/register.ejs", {
      errors: errors,
      oldData: oldData,
    });
  }

  // success
  await registerNewUser(fullName, email, password);
  return res.redirect("/login");
};

export { getLoginPage, getRegisterPage, postRegister };
