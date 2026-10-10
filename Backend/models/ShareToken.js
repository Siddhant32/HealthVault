import mongoose from "mongoose";

const shareTokenSchema = new mongoose.Schema(

  {

    token: {

      type:
String,

     
required: true,

      unique:
true,

      index:
true

    },

    userId: {

      type:
mongoose.Schema.Types.ObjectId,

      ref:
"User",

     
required: true

    },

   
expiresAt: {

      type:
Date,

     
required: true,

      index:
true

    },

    revoked:
{

      type:
Boolean,

     
default: false

    },

   
accessCount: {

      type:
Number,

     
default: 0

    }

  },

  {

   
timestamps: true

  }

);

shareTokenSchema.index(

  {
expiresAt: 1 },

  {

   
expireAfterSeconds: 0

  }

);

export default mongoose.model(

 
"ShareToken",

 
shareTokenSchema

);