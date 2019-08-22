export default (req, res, next) => {
  if (!req.accepts('application.json')) {
    res.status(406).json({
      success: false,
      message: 'Must accept JSON to receive data from this API',
    });
  } else {
    next();
  }
};
