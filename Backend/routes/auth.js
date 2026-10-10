import express from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res)=> {

  try {

    const {

      name,

      email,

     
password

    } =
req.body;

    if (!name
|| !email || !password) {

      return res.status(400).json({

       
message: "Name, email and password are required"

      });

    }

    if
(password.length < 6) {

      return res.status(400).json({

       
message: "Password must be at least 6 characters"

      });

    }

    const
existingUser = await User.findOne({

      email

    });

    if
(existingUser) {

      return res.status(400).json({

       
message: "Email already registered"

      });

    }

    const
hashedPassword =

      await
bcrypt.hash(password, 10);

    const
user = await User.create({

      name,

      email,

     
password: hashedPassword

    });

    const
token = jwt.sign(

      {

       
userId: user._id

      },

     
process.env.JWT_SECRET,

      {

       
expiresIn: "7d"

      }

    );

   
res.status(201).json({

      token,

      user: {

        id:
user._id,

        name:
user.name,

       
email: user.email

      }

    });

  } catch
(error) {

   
console.error(error);

   
res.status(500).json({

     
message: "Signup failed"

    });

  }

});

router.post("/login", async (req, res)=> {

  try {

    const {

      email,

     
password

    } =
req.body;

    const
user = await User.findOne({

      email

    });

    if
(!user) {

      return res.status(401).json({

       
message: "Invalid email or password"

      });

    }

    const
valid =

      await
bcrypt.compare(

       
password,

       
user.password

      );

    if
(!valid) {

      return res.status(401).json({

       
message: "Invalid email or password"

      });

    }

    const
token = jwt.sign(

      {

       
userId: user._id

      },

     
process.env.JWT_SECRET,

      {

       
expiresIn: "7d"

      }

    );

   
res.json({

      token,

      user: {

        id:
user._id,

        name:
user.name,

       
email: user.email

      }

    });

  } catch
(error) {

   
console.error(error);

   
res.status(500).json({

     
message: "Login failed"

    });

  }

});

export default router;