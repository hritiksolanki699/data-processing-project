import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
  const { loginIdentifier, password } = req.body; 

  try {
   
    const user = await User.findOne({
      $or: [
        { username: loginIdentifier },
        { mobileNumber: loginIdentifier },
        { email: loginIdentifier },
      ],
    });

    if (!user) return res.status(400).send("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid credentials");

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30D", // Token expiry
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });


    res.send({
      message: "Login successful",
      role: user.role,
      token: token,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};


export const logout = (req, res) => {
  res.clearCookie('token'); 
  res.send({ message: 'Logged out successfully' });
};