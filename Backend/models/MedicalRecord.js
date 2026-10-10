import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(

  {

    userId: {

      type:
mongoose.Schema.Types.ObjectId,

      ref:
"User",

     
required: true,

      index:
true

    },

    title: {

      type:
String,

     
required: true

    },

    type: {

      type:
String,

      enum: [

       
"prescription",

       
"lab_report",

       
"diagnosis",

       
"vaccination",

       
"scan",

       
"discharge_summary",

       
"other"

      ],

     
default: "other"

    },

   
doctorName: {

      type:
String,

     
default: ""

    },

    hospital:
{

      type:
String,

     
default: ""

    },

    date: {

      type:
Date

    },

    notes: {

      type:
String,

     
default: ""

    }

  },

  {

   
timestamps: true

  }

);

export default mongoose.model(

 
"MedicalRecord",

 
medicalRecordSchema

);