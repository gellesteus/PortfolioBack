import User from "../../models/User";

export default async (req, res, next) => {
  const token = req.get("authorization");

  User.findOne({ sessionToken: token })
    .then(user => {
      if (user) {
        console.log(user._id);
        console.log(user);
        console.log(user.role);
        if (user.role == "admin") {
          /* TODO: replace with actual logging */
          console.log("Admin only resoruce accessed");
          next();
        } else {
          res.status(403).json({
            success: false,
            message: "You are not authorized to access this resource"
          });
        }
      } else {
        res.status(403).json({
          success: false,
          message: "User not found"
        });
      }
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "An unknown error has occurred"
      });
    });
};
