import { useState } from "react";

import { Link, useNavigate } from
"react-router-dom";

import api from "../api";

export default function Signup() {

  const
navigate = useNavigate();

  const
[form, setForm] = useState({

    name:
"",

    email:
"",

    password:
""

  });

  const
[loading, setLoading] =

   
useState(false);

  const
[error, setError] =

   
useState("");

  const
handleChange = (e) => {

    setForm({

     
...form,

     
[e.target.name]: e.target.value

    });

  };

  const
handleSubmit = async (e) => {

   
e.preventDefault();

   
setError("");

   
setLoading(true);

    try {

      const
response =

        await
api.post(

         
"/auth/signup",

         
form

        );

     
const token = response.data?.token;
      if (!token) {
        throw new Error("The server did not return an authentication token.");
      }
      localStorage.setItem("token", token);
      await api.get("/profile");
      navigate("/dashboard", { replace: true });

    } catch
(error) {

     
localStorage.removeItem("token");
      setError(
        error.response?.data?.message ||
        error.message ||
        "Signup failed"
      );

    } finally
{

     
setLoading(false);

    }

  };

  return (

    <div
className="auth-page">

      <div
className="auth-card">

       
<div className="auth-logo">

         
HealthVault

       
</div>

       
<h1>

         
Create your account

       
</h1>

        <p
className="auth-subtitle">

         
Start managing your health

         
information in one secure place.

       
</p>

       
{error && (

         
<div className="error-message">

           
{error}

         
</div>

        )}

       
<form

         
onSubmit={handleSubmit}

        >

         
<label>

           
Full name

         
</label>

         
<input

           
name="name"

           
placeholder="John Doe"

           
value={form.name}

           
onChange={handleChange}

           
required

         
/>

         
<label>

           
Email

         
</label>

         
<input

           
name="email"

           
type="email"

           
placeholder="you@example.com"

           
value={form.email}

           
onChange={handleChange}

           
required

         
/>

         
<label>

           
Password

         
</label>

         
<input

           
name="password"

           
type="password"

           
placeholder="Minimum 6 characters"

           
value={form.password}

           
onChange={handleChange}

           
required

           
minLength="6"

         
/>

         
<button

           
className="primary-button full-width"

           
disabled={loading}

         
>

           
{loading

             
? "Creating account..."

             
: "Create account"}

         
</button>

       
</form>

        <p
className="auth-footer">

         
Already have an account?{" "}

         
<Link to="/login">

           
Login

         
</Link>

       
</p>

     
</div>

   
</div>

  );

}