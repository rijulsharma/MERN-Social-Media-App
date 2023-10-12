import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    console.log("well newwww");
    console.log(req.body);
    const {
      firstName,
      picturePath,
      lastName,
      email,
      password,
      location,
      occupation,
    } = req.body;
    // console.log(firstName);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends: [],
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/*
This function receives a request (req) and a response (res) object from the Express.js framework.
It extracts user registration data from the request body (e.g., firstName, lastName, email, password, etc.).
It uses the bcrypt library to generate a salt and hash the user's password for secure storage.
A new User model instance is created with the hashed password and other user details.
The new user is saved to the database, and the saved user details are sent as a JSON response with a status of 201 (created).
If an error occurs during this process, it sends a JSON response with a status of 500 (internal server error).
*/
/* LOGGING IN */
export const login = async (req, res) => {
  console.log("well newwww");
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/*
It extracts email and password from the request body.
It looks up the user in the database based on the provided email.
If the user does not exist, it responds with a 400 status and a message indicating that the user does not exist.
If the user exists, it uses bcrypt.compare to check if the provided password matches the hashed password stored in the database.
If the passwords match, it generates a JSON Web Token (JWT) using the jsonwebtoken library.
The JWT and user details (with the password removed) are sent as a JSON response with a status of 200 (OK).
If an error occurs, it sends a JSON response with a status of 500 (internal server error).

*/

