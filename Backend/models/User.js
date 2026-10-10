import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

  {

    name: {

      type:
String,

     
required: true,

      trim:
true

    },

    email: {

      type:
String,

     
required: true,

      unique:
true,

     
lowercase: true,

      trim:
true

    },

    password:
{

      type:
String,

     
required: true

    },

   
dateOfBirth: {

      type:
Date

    },

    phone: {

      type:
String

    },

    gender: {

      type:
String

    },

   
profileImage: {

      type:
String

    }

  },

  {

   
timestamps: true

  }

);

export default mongoose.model("User",
userSchema);