import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
  res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,        // Force to true so cross-site cookies work flawlessly
  sameSite: 'none',    // Crucial for letting Vercel talk securely to Render
  maxAge: (parseInt(process.env.COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000,
});
return token;
};
