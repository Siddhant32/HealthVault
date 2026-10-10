import mongoose from "mongoose";

const healthProfileSchema = new mongoose.Schema(

  {

    userId: {

      type:
mongoose.Schema.Types.ObjectId,

      ref:
"User",

     
required: true,

      unique:
true

    },

   
bloodGroup: {

      type:
String,

     
default: ""

    },

    height: {

      value:
{

        type:
Number,

       
default: 0

      },

      unit: {

        type:
String,

       
default: "cm"

      }

    },

    weight: {

      value:
{

        type:
Number,

       
default: 0

      },

      unit: {

        type:
String,

       
default: "kg"

      }

    },

   
allergies: [

      {

        name:
String,

       
reaction: String,

       
severity: String

      }

    ],

   
medicalConditions: [

      {

        name:
String,

       
diagnosedDate: Date,

       
status: String,

       
notes: String

      }

    ],

   
medications: [

      {

        name:
String,

       
dosage: String,

       
frequency: String,

       
active: {

         
type: Boolean,

         
default: true

        }

      }

    ],

   
emergencyContact: {

      name:
String,

     
relationship: String,

      phone:
String

    },

    doctors:
[

      {

        name:
String,

       
specialization: String,

       
hospital: String,

       
phone: String

      }

    ]

  },

  {

   
timestamps: true

  }

);

export default mongoose.model(

 
"HealthProfile",

 
healthProfileSchema

);