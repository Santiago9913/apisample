const jwt = require("jsonwebtoken");
const { promisify } = require("util");

async function verifyToken(req, res, next) {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(400).json({
        error: "No valid token",
      });
    }

    const decode = await promisify(jwt.verify)(
      token,
      "1a90142e4a031eef0573cf7b6e4c1e25989af9a63f696da5d8e872c884a2c8ae5920e77c44cb8c7415d372dda53729a486824cd5ccecfab18b8b06ca6b58f06c"
    );

    if (!decode.role) {
      return res.status(400).json({
        error: "No valid token",
      });
    }

    req.user = decode;

    next();
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
}

const verification = { verifyToken };

module.exports = verification;
