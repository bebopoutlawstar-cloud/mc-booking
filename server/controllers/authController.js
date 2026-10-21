const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with that email already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 2. If either one is missing, send status 400 with a message
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 3. Find the user by email (hint: User.findOne, and lowercase the email)
    const user = await User.findOne({ email: email.toLowerCase() });

    // 4. If there's no user, OR matchPassword(password) is false,
    //    send status 401 with "Invalid email or password"
    //    (hint: matchPassword is async, so it needs await)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 5. Send back a token and the user's details,
    //    in the same shape as your register response
    res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };