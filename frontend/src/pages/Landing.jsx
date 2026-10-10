import { Link } from "react-router-dom";

export default function Landing() {

  return (

   
<div>

      <nav
className="navbar landing-nav">

       
<Link

         
to="/"

         
className="logo"

        >

         
HealthVault

       
</Link>

       
<div className="nav-links">

         
<Link to="/login">

           
Login

         
</Link>

         
<Link

           
to="/signup"

           
className="nav-button"

         
>

           
Get Started

         
</Link>

       
</div>

     
</nav>

     
<section className="hero">

       
<div className="hero-content">

         
<span className="badge">

           
Your health, organized

         
</span>

         
<h1>

           
Your complete health

           
<span> profile in one place.</span>

         
</h1>

         
<p>

           
Securely manage your health

           
information, medical records,

           
medications and emergency

           
information — and share a

           
read-only summary with your

           
doctor using a secure link or QR

           
code.

         
</p>

         
<div className="hero-buttons">

           
<Link

             
to="/signup"

             
className="primary-button"

           
>

             
Create Health Profile

           
</Link>

           
<Link

             
to="/login"

             
className="secondary-button"

           
>

             
Login

           
</Link>

         
</div>

       
</div>

       
<div className="health-card">

         
<div className="card-header">

           
<div>

             
<small>HEALTH PROFILE</small>

             
<h3>Alex Johnson</h3>

           
</div>

           
<span className="verified">

             
✓

           
</span>

         
</div>

         
<div className="health-stats">

           
<div>

             
<small>Blood Group</small>

             
<strong>O+</strong>

           
</div>

           
<div>

             
<small>Medications</small>

             
<strong>02</strong>

           
</div>

           
<div>

             
<small>Allergies</small>

             
<strong>01</strong>

           
</div>

         
</div>

         
<div className="health-status">

           
<span></span>

           
Profile up to date

         
</div>

       
</div>

     
</section>

     
<section className="features-section">

       
<h2>

         
Your health, thoughtfully connected

       
</h2>

       
<div className="feature-grid">

         
<div className="feature-card">

           
<div className="feature-icon">

             
👤

           
</div>

           
<h3>

             
Personal Profile

           
</h3>

           
<p>

             
Store your basic information,

             
allergies, conditions,

             
medications and emergency

             
contacts.

           
</p>

         
</div>

         
<div className="feature-card">

           
<div className="feature-icon">

             
📋

           
</div>

           
<h3>

             
Medical Records

           
</h3>

           
<p>

             
Keep your medical history

             
organized and accessible from

             
one dashboard.

           
</p>

         
</div>

         
<div className="feature-card">

           
<div className="feature-icon">

             
🤖

           
</div>

           
<h3>

             
Health Copilot

           
</h3>

           
<p>

             
Ask questions about information

             
stored in your health profile.

           
</p>

         
</div>

         
<div className="feature-card">

           
<div className="feature-icon">

             
QR

           
</div>

           
<h3>

             
Doctor Sharing

           
</h3>

           
<p>

             
Create a temporary read-only

             
link and QR code for your doctor.

           
</p>

         
</div>

       
</div>

     
</section>

   
</div>

  );

}