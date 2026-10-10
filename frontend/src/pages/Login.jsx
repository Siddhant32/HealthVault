import { useState } from "react";

import { Link, useNavigate } from
"react-router-dom";

import api from "../api";
import { DEMO_CREDENTIALS, DEMO_TOKEN } from "../mockApi";

export default function Login() {

  const
navigate = useNavigate();

  const
[email, setEmail] =

   
useState("");

  const
[password, setPassword] =

   
useState("");

  const
[error, setError] =

   
useState("");

  const
[loading, setLoading] =

   
useState(false);

  const login
= async (e) => {

   
e.preventDefault();

   
setError("");

   
setLoading(true);

    try {
      if (
        import.meta.env.DEV &&
        email.trim().toLowerCase() === DEMO_CREDENTIALS.email
      ) {
        if (password !== DEMO_CREDENTIALS.password) {
          throw new Error("Invalid demo email or password.");
        }

        localStorage.setItem("token", DEMO_TOKEN);
        navigate("/dashboard", { replace: true });
        return;
      }

      const
response =

        await
api.post(

         
"/auth/login",

          {

           
email,

           
password

          }

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
        "Login failed"
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

         
Welcome back

       
</h1>

        <p
className="auth-subtitle">

         
Login to access your health

         
dashboard.

       
</p>
        {import.meta.env.DEV && (
          <p className="auth-subtitle">
            Demo login: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </p>
        )}

       
{error && (

         
<div className="error-message">

           
{error}

         
</div>

        )}

       
<form onSubmit={login}>

         
<label>

           
Email

         
</label>

         
<input

           
type="email"

           
placeholder="you@example.com"

           
value={email}

           
onChange={(e) =>

             
setEmail(e.target.value)

            }

           
required

         
/>

         
<label>

           
Password

         
</label>

         
<input

           
type="password"

           
placeholder="Your password"

           
value={password}

           
onChange={(e) =>

             
setPassword(e.target.value)

            }

           
required

         
/>

         
<button

           
className="primary-button full-width"

           
disabled={loading}

         
>

           
{loading

             
? "Logging in..."

             
: "Login"}

         
</button>

       
</form>

        <p
className="auth-footer">

         
Don't have an account?{" "}

         
<Link to="/signup">

           
Create one

         
</Link>

       
</p>

     
</div>

   
</div>

  );

}