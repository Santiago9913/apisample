const jwt = require("jsonwebtoken");
const prisma = require("../lib/prismaClient");

function requestToken(user) {
  try {
    const token = jwt.sign(
      user,
      "1a90142e4a031eef0573cf7b6e4c1e25989af9a63f696da5d8e872c884a2c8ae5920e77c44cb8c7415d372dda53729a486824cd5ccecfab18b8b06ca6b58f06c",
      {
        expiresIn: "48h",
      }
    );

    return token;
  } catch (e) {
    return e;
  }
}

async function logIn(req, res) {
  try {
    const { username } = req.body;

    if (username === undefined || username === "") {
      return res.status(400).json({
        error: "no username",
      });
    }

    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user === null) {
      return res.status(400).json({
        errorl: "No user found",
      });
    }

    const token = requestToken(user);
    user.token = token;
    user.role = undefined;

    return res.status(200).json({
      user,
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function signUp(req, res) {
  try {
    const { username } = req.body;
    const { role } = req.body;

    if (username === undefined || username === "" || role === undefined || role === "") {
      return res.status(400).json({
        error: "no username",
      });
    }

    await prisma.$connect();

    const user = await prisma.user.create({
      data: {
        username,
        role,
      },
    });

    if (user) {
      const token = requestToken(user);
      user.token = token;
    }

    user.role = undefined;

    return res.status(200).json({
      user,
    });
  } catch (e) {
    res.status(400).json({
      eroor: e,
    });
  } finally {
    await prisma.$disconnect();
  }
}

const user = { requestToken, signUp, logIn };

module.exports = user;
