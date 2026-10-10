import { useEffect, useState } from
"react";

import Navbar from
"../components/Navbar";

import api from "../api";

function errorText(error) {
  if (!error.response) return "Cannot reach the server. Make sure the backend is running on port 5000.";
  return error.response.data?.message || "Something went wrong.";
}

export default function Profile() {

  const [loadError, setLoadError] = useState("");

  const
[user, setUser] =

   
useState(null);

  const
[profile, setProfile] =

   
useState(null);

  const
[message, setMessage] =

   
useState("");

 
useEffect(() => {

   
api.get("/profile")

     
.then((response) => {

       
setUser(response.data.user);

       
setProfile(response.data.profile || {});

      })

     
.catch((error) => {
        console.error(error);
        setLoadError(errorText(error));
      });

  }, []);

  const
updateUser = (field, value) => {

    setUser({

     
...user,

     
[field]: value

    });

  };

  const save
= async () => {

    try {

      await
api.put(

       
"/profile/user",

        user

      );

      await
api.put(

       
"/profile",

       
profile

      );

     
setMessage(

       
"Profile saved successfully."

      );

     
setTimeout(

        ()=> setMessage(""),

        3000

      );

    } catch
(error) {

     
setMessage(

       
"Could not save profile."

      );

    }

  };

  if (!user
|| !profile) {

    return (

     
<>

       
<Navbar />

       
<main className="page">
          {loadError || "Loading profile..."}

       
</main>

     
</>

    );

  }

  return (

    <>

     
<Navbar />

     
<main className="page">

       
<div className="page-title">

         
<p className="eyebrow">

           
PERSONAL INFORMATION

         
</p>

         
<h1>

           
My Health Profile

         
</h1>

         
<p>

           
Keep your important health

           
information up to date.

         
</p>

       
</div>

       
{message && (

         
<div className="success-message">

           
{message}

         
</div>

        )}

       
<section className="panel">

         
<h2>

           
Personal Information

         
</h2>

         
<div className="form-grid">

           
<div>

             
<label>

               
Full name

             
</label>

             
<input

               
value={user.name || ""}

               
onChange={(e) =>

                 
updateUser(

                   
"name",

                   
e.target.value

                 
)

               
}

             
/>

           
</div>

           
<div>

             
<label>

               
Email

             
</label>

             
<input

               
value={user.email || ""}

               
disabled

             
/>

           
</div>

           
<div>

             
<label>

               
Date of Birth

             
</label>

             
<input

               
type="date"

className="profile-date-input"
               
value={

                 
user.dateOfBirth

                   
? new Date(

                        user.dateOfBirth

                      )

                        .toISOString()

                       
.split("T")[0]

                   
: ""

               
}

               
onChange={(e) =>

                 
updateUser(

                   
"dateOfBirth",

                   
e.target.value

                 
)

               
}

             
/>

           
</div>

           
<div>

             
<label>

               
Phone

             
</label>

             
<input

               
value={user.phone || ""}

               
onChange={(e) =>

                 
updateUser(

                   
"phone",

                   
e.target.value

                 
)

               
}

             
/>

           
</div>

           
<div>

             
<label>

               
Gender

             
</label>

             
<select

               
value={user.gender || ""}

               
onChange={(e) =>

                 
updateUser(

                   
"gender",

                   
e.target.value

                 
)

               
}

             
>

               
<option value="">

                 
Select

               
</option>

               
<option value="male">

                 
Male

               
</option>

               
<option value="female">

                 
Female

               
</option>

               
<option value="other">

                 
Other

               
</option>

               
<option value="prefer_not_to_say">

                 
Prefer not to say

               
</option>

             
</select>

           
</div>

           
<div>

             
<label>

               
Blood Group

             
</label>

             
<select

               
value={

                 
profile.bloodGroup || ""

               
}

               
onChange={(e) =>

                 
setProfile({

                   
...profile,

                   
bloodGroup:

                      e.target.value

                 
})

               
}

             
>

               
<option value="">

                 
Select

               
</option>

               
<option>O+</option>

               
<option>O-</option>

               
<option>A+</option>

               
<option>A-</option>

               
<option>B+</option>

               
<option>B-</option>

               
<option>AB+</option>

               
<option>AB-</option>

             
</select>

           
</div>

           
<div>

             
<label>

               
Height (cm)

             
</label>

             
<input

               
type="number"

               
value={

                 
profile.height?.value || ""

               
}

               
onChange={(e) =>

                 
setProfile({

                   
...profile,

                   
height: {

                      ...profile.height,

                      value:

                        Number(

                          e.target.value

                        )

                   
}

                 
})

               
}

             
/>

           
</div>

           
<div>

             
<label>

               
Weight (kg)

             
</label>

             
<input

               
type="number"

               
value={

                 
profile.weight?.value || ""

               
}

               
onChange={(e) =>

                 
setProfile({

                   
...profile,

                   
weight: {

                      ...profile.weight,

                      value:

                        Number(

                          e.target.value

                        )

                   
}

                 
})

               
}

             
/>

           
</div>

         
</div>

       
</section>

       
<section className="panel">

         
<h2>

           
Allergies

         
</h2>

         
<input

           
placeholder="Example: Penicillin, peanuts"

           
value={

             
profile.allergies

               
?.map(

                 
(a) => a.name

               
)

               
.join(", ") || ""

            }

           
onChange={(e) => {

             
const allergies =

               
e.target.value

                 
.split(",")

                 
.map(

                   
(name) =>

                      name.trim()

                 
)

                 
.filter(Boolean)

                 
.map((name) => ({

                   
name,

                   
reaction: "",

                   
severity: ""

                 
}));

             
setProfile({

               
...profile,

               
allergies

             
});

           
}}

         
/>

       
</section>

       
<section className="panel">

         
<h2>

           
Emergency Contact

         
</h2>

         
<div className="form-grid">

           
<div>

             
<label>

               
Name

             
</label>

             
<input

               
value={

                 
profile.emergencyContact

                   
?.name || ""

               
}

               
onChange={(e) =>

                 
setProfile({

                   
...profile,

                   
emergencyContact: {

                     
...profile.emergencyContact,

                      name: e.target.value

                   
}

                 
})

               
}

             
/>

           
</div>

           
<div>

             
<label>

               
Relationship

             
</label>

             
<input

               
value={

                 
profile.emergencyContact

                   
?.relationship || ""

               
}

               
onChange={(e) =>

                 
setProfile({

                   
...profile,

                   
emergencyContact: {

                     
...profile.emergencyContact,

                      relationship:

                        e.target.value

                   
}

                 
})

               
}

             
/>

           
</div>

           
<div>

             
<label>

               
Phone

             
</label>

             
<input

               
value={

                 
profile.emergencyContact

                   
?.phone || ""

               
}

               
onChange={(e) =>

                 
setProfile({

                   
...profile,

                   
emergencyContact: {

                     
...profile.emergencyContact,

                      phone: e.target.value

                   
}

                 
})

               
}

             
/>

           
</div>

         
</div>

       
</section>

       
<button

         
className="primary-button"

         
onClick={save}

        >

         
Save Profile

       
</button>

     
</main>

    </>

  );

}