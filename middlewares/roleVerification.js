function verifyRole(role) {
  return async (req, res, next) => {
    const { user } = req.user;

    console.log(req.user);

    if (req.user.role === role) {
      return next();
    }

    return res.status(400).json({
      error: "Not authorized for this action",
    });
  };
}

const roleVerification = { verifyRole };

module.exports = roleVerification;
