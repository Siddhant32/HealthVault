import { useEffect, useState } from
"react";

import { Link } from "react-router-dom";

import Navbar from
"../components/Navbar";

import api from "../api";

function errorText(error) {
  if (!error.response) return "Cannot reach the server. Make sure the backend is running on port 5000.";
  return error.response.data?.message || "Something went wrong.";
}

export default function Dashboard() {

  const [loadError, setLoadError] = useState("");

  const
[data, setData] =

   
useState(null);

  const
[records, setRecords] =

   
useState([]);

 
useEffect(() => {

    const
load = async () => {

      try {

        const
profile =

         
await api.get("/profile");

        const
recordsResponse =

         
await api.get("/records");

       
setData(profile.data);

       
setRecords(

         
recordsResponse.data

        );

      } catch
(error) {
        console.error(error);
        setLoadError(errorText(error));

      }

    };

    load();

  }, []);

  if (!data)
{

    return (

     
<>

       
<Navbar />

       
<main className="page">

         
<p>{loadError || "Loading dashboard..."}</p>

       
</main>

     
</>

    );

  }

  const
profile = data.profile;

  const user
= data.user;

  const
activeMedications =

   
profile.medications?.filter(

      (m)=> m.active !== false

    ) || [];

  return (

    <>

     
<Navbar />

     
<main className="page">

       
<section className="dashboard-heading">

         
<div>

           
<p className="eyebrow">

             
HEALTH DASHBOARD

           
</p>

           
<h1>

             
Welcome, {user?.name || ""} 👋

           
</h1>

           
<p>

             
Here's an overview of your

             
health information.

           
</p>

         
</div>

         
<Link

           
to="/share"

           
className="primary-button"

         
>

           
Share with Doctor

         
</Link>

       
</section>

       
<div className="stats-grid">

         
<div className="stat-card">

           
<span>Blood Group</span>

           
<strong>

             
{profile.bloodGroup ||

               
"Not added"}

           
</strong>

         
</div>

         
<div className="stat-card">

           
<span>Medications</span>

           
<strong>

             
{activeMedications.length}

           
</strong>

         
</div>

         
<div className="stat-card">

           
<span>Allergies</span>

           
<strong>

             
{profile.allergies?.length || 0}

           
</strong>

         
</div>

         
<div className="stat-card">

           
<span>Medical Records</span>

           
<strong>

             
{records.length}

           
</strong>

         
</div>

       
</div>

       
<div className="dashboard-grid">

         
<section className="panel">

           
<div className="panel-heading">

             
<h2>

               
Health Overview

             
</h2>

             
<Link to="/profile">

               
Edit

             
</Link>

           
</div>

           
<div className="overview-list">

             
<div>

               
<span>Height</span>

               
<strong>

                 
{profile.height?.value

                   
? `${profile.height.value} ${profile.height.unit}`

                   
: "Not added"}

               
</strong>

             
</div>

             
<div>

               
<span>Weight</span>

               
<strong>

                 
{profile.weight?.value

                   
? `${profile.weight.value} ${profile.weight.unit}`

                   
: "Not added"}

               
</strong>

             
</div>

             
<div>

               
<span>Allergies</span>

               
<strong>

                 
{profile.allergies?.length

                   
? profile.allergies

                        .map(

                          (a) => a.name

                        )

                        .join(", ")

                   
: "None listed"}

               
</strong>

             
</div>

           
</div>

         
</section>

         
<section className="copilot-promo">

           
<span className="copilot-icon">

             
✦

           
</span>

           
<h2>

             
Health Copilot

           
</h2>

           
<p>

             
Ask questions about your

             
stored health information.

           
</p>

           
<Link to="/copilot">

             
Open Copilot →

           
</Link>

         
</section>

       
</div>

       
<section className="panel">

         
<div className="panel-heading">

           
<h2>

             
Recent Medical Records

           
</h2>

           
<Link to="/records">

             
View all

           
</Link>

         
</div>

         
{records.length === 0 ? (

           
<div className="empty-state">

             
No medical records added yet.

           
</div>

          ) :
(

           
<div className="record-list">

             
{records

               
.slice(0, 5)

               
.map((record) => (

                 
<div

                   
className="record-row"

                   
key={record._id}

                 
>

                   
<div>

                      <strong>

                        {record.title}

                      </strong>

                      <span>

                        {record.type}

                      </span>

                   
</div>

                   
<small>

                      {record.date

                        ? new Date(

                            record.date

                         
).toLocaleDateString()

                        : ""}

                   
</small>

                 
</div>

               
))}

           
</div>

          )}

       
</section>

     
</main>

    </>

  );

}