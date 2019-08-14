import user from "../../models/User";

/* Middleware to prevent banned users from accessing the protected resource */
export default (req, res, next) => {
  const token = req.get("authorization");
  user
    .findOne({ sessionToken: token })
    .then(user => {
      if (user) {
        if (user.validated) {
          next();
        } else {
          res.status(403).json({
            success: false,
            message:
              "Accounts that have not been validated cannot perform this action"
          });
        }
      } else {
        res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource"
        });
      }
    })
    .catch(e => {
      res
        .status(500)
        .json({ success: false, message: "An unknown error occured" });
    });
};
