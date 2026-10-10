import express from "express";

import auth from "../middleware/auth.js";

import MedicalRecord from
"../models/MedicalRecord.js";

const router = express.Router();

router.get("/", auth, async (req, res)=> {

  try {

    const
records =

      await
MedicalRecord.find({

       
userId: req.userId

     
}).sort({

        date:
-1

      });

   
res.json(records);

  } catch
(error) {

   
res.status(500).json({

     
message: "Could not load records"

    });

  }

});

router.post("/", auth, async (req, res)=> {

  try {

    const
record =

      await
MedicalRecord.create({

       
...req.body,

       
userId: req.userId

      });

   
res.status(201).json(record);

  } catch
(error) {

   
res.status(500).json({

     
message: "Could not create record"

    });

  }

});

router.delete("/:id", auth, async (req,
res) => {

  try {

    const
record =

      await
MedicalRecord.findOneAndDelete({

        _id:
req.params.id,

       
userId: req.userId

      });

    if
(!record) {

      return res.status(404).json({

       
message: "Record not found"

      });

    }

   
res.json({

     
message: "Record deleted"

    });

  } catch
(error) {

   
res.status(500).json({

     
message: "Could not delete record"

    });

  }

});

export default router;