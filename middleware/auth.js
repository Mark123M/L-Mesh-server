const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = res.locals.cookie.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie('token', {secure: true, sameSite: 'none', httpOnly: true});
    res.status(403).json('Unauthorized');
  };
};
