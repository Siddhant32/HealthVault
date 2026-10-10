import express from "express";

import crypto from "crypto";

import auth from "../middleware/auth.js";

import User from "../models/User.js";

import HealthProfile from
"../models/HealthProfile.js";

import MedicalRecord from
"../models/MedicalRecord.js";

import ShareToken from
"../models/ShareToken.js";

const router = express.Router();

router.post("/create", auth, async (req,
res) => {

  try {

    const
token =

     
crypto.randomBytes(32).toString("hex");

    const
expiresAt = new Date(

     
Date.now() + 60 * 60 * 1000

    );

    await
ShareToken.create({

      token,

      userId:
req.userId,

     
expiresAt

    });

    const url
=

     
`http://localhost:5173/doctor/${token}`;

   
res.json({

      url,

     
expiresAt

    });

  } catch
(error) {

   
res.status(500).json({

     
message: "Could not create share link"

    });

  }

});

router.get("/my-links", auth, async (req,
res) => {

  try {

    const
links =

      await
ShareToken.find({

       
userId: req.userId

     
}).sort({

       
createdAt: -1

      });

    res.json(links);

  } catch
(error) {

   
res.status(500).json({

     
message: "Could not load share links"

    });

  }

});

router.delete("/:id", auth, async (req,
res) => {

  try {

    await
ShareToken.findOneAndUpdate(

      {

        _id:
req.params.id,

       
userId: req.userId

      },

      {

       
revoked: true

      }

    );

   
res.json({

     
message: "Share link revoked"

    });

  } catch
(error) {

   
res.status(500).json({

     
message: "Could not revoke link"

    });

  }

});

router.get("/view/:token", async (req,
res) => {

  try {

    const
share =

      await
ShareToken.findOne({

       
token: req.params.token,

       
revoked: false,

       
expiresAt: {

         
$gt: new Date()

        }

      });

    if
(!share) {

      return res.status(404).json({

       
message: "Link expired or invalid"

      });

    }

   
share.accessCount += 1;

    await
share.save();

    const
user =

      await
User.findById(share.userId)

       
.select("-password");

    const
profile =

      await
HealthProfile.findOne({

       
userId: share.userId

      });

    const
records =

      await
MedicalRecord.find({

       
userId: share.userId

     
}).sort({

        date:
-1

      });

   
res.json({

      user,

     
profile,

      records

    });

  } catch
(error) {

   
console.error(error);

   
res.status(500).json({

     
message: "Could not load shared information"

    });

  }

});

export default router;