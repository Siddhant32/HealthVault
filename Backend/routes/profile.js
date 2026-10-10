import express from "express";

import auth from "../middleware/auth.js";

import User from "../models/User.js";

import HealthProfile from
"../models/HealthProfile.js";

const router = express.Router();

router.get("/", auth, async (req, res)=> {

  try {

    const
user = await User.findById(req.userId)

     
.select("-password");

    if (!user) {
      return res.status(401).json({ message: "Account not found, please log in again" });
    }


    let
profile =

      await
HealthProfile.findOne({

       
userId: req.userId

      });

    if
(!profile) {

      profile
=

        await
HealthProfile.create({

         
userId: req.userId

        });

    }

   
res.json({

      user,

      profile

    });

  } catch
(error) {
    console.error("Profile load error:", error);

   
res.status(500).json({

     
message: "Could not load profile"

    });

  }

});

router.put("/user", auth, async (req,
res) => {

  try {

    const {

      name,

     
dateOfBirth,

      phone,

      gender

    } =
req.body;

    const
user =

      await
User.findByIdAndUpdate(

       
req.userId,

        {

         
name,

         
dateOfBirth,

         
phone,

         
gender

        },

        {

         
new: true

        }

      ).select("-password");

   
res.json(user);

  } catch
(error) {

   
res.status(500).json({

     
message: "Could not update user"

    });

  }

});

router.put("/", auth, async (req, res)=> {

  try {

    const
profile =

      await
HealthProfile.findOneAndUpdate(

        {

         
userId: req.userId

        },

        {

         
...req.body,

         
userId: req.userId

        },

        {

         
new: true,

         
upsert: true

        }

      );

   
res.json(profile);

  } catch
(error) {

    console.error(error);

   
res.status(500).json({

     
message: "Could not update health profile"

    });

  }

});

export default router;