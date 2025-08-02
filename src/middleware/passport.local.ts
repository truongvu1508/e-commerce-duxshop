import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserWithRoleById, handleLogin } from "services/client/auth.service";
import { getUserById } from "services/user.service";

const configPassportLocal = () => {
  passport.use(
    new LocalStrategy({ passReqToCallback: true }, function verify(
      req,
      username,
      password,
      callback
    ) {
      const { session } = req as any;

      if (session?.messages?.length) {
        session.messages = [];
      }

      return handleLogin(username, password, callback);
    })
  );

  // save data in session
  passport.serializeUser(function (user: any, callback) {
    callback(null, {
      id: user.id,
      username: user.username,
    });
  });

  passport.deserializeUser(async function (user: any, callback) {
    const { id, username } = user;

    // query database
    const userInDatabase = await getUserWithRoleById(id);

    return callback(null, { ...userInDatabase });
  });
};
export default configPassportLocal;
