import CSRF from "../../models/CSRF";

export default async (req, res, next) => {
  if (req.method !== "GET") {
    const token = req.body.CSRF;
    const validToken = await CSRF.findOne({ value: token });
    if (!validToken) {
      res.status(400).json({ success: false, message: "Invalid CSRF token" });
    } else {
      validToken.remove();
      next();
    }
  } else {
    /* Get requests are not protected by CSRF middleware */
    next();
  }
};
