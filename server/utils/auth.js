const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: ({ req }) => {
    let authToken = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      authToken = authToken.split(' ').pop().trim();
    }

    if (!authToken) {
      return req
    }

    try {
      const { data } = jwt.verify(authToken, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: ({ username, email, _id }) => {
    const payload = { username, email, _id };
    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    console.log('Generated Token:', token); // log token
    return token;
  },
  };
