import {

 
BrowserRouter,

  Routes,

  Route

} from "react-router-dom";

import Landing from "./pages/Landing";
import FindDoctors from "./pages/FindDoctors";

import Login from "./pages/Login";

import Signup from "./pages/Signup";

import Dashboard from
"./pages/Dashboard";

import Profile from "./pages/Profile";

import Records from "./pages/Records";

import Copilot from "./pages/Copilot";

import ShareHealth from
"./pages/ShareHealth";

import DoctorView from
"./pages/DoctorView";

import ProtectedRoute from "./components/ProtectedRoute";

function Protected({ children }) {

  return (

   
<ProtectedRoute>

     
{children}

   
</ProtectedRoute>

  );

}

export default function App() {

  return (

   
<BrowserRouter>

     
<Routes>

<Route
  path="/doctors"
  element={
    <Protected>
      <FindDoctors />
    </Protected>
  }
/>    

       
<Route

         
path="/"

         
element={<Landing />}

        />

       
<Route

         
path="/login"

         
element={<Login />}

        />

       
<Route

         
path="/signup"

         
element={<Signup />}

        />

       
<Route

         
path="/dashboard"

         
element={

           
<Protected>

             
<Dashboard />

           
</Protected>

          }

        />

       
<Route

         
path="/profile"

         
element={

           
<Protected>

             
<Profile />

           
</Protected>

          }

        />

       
<Route

         
path="/records"

         
element={

           
<Protected>

             
<Records />

           
</Protected>

          }

        />

       
<Route

         
path="/copilot"

         
element={

           
<Protected>

             
<Copilot />

           
</Protected>

          }

        />

       
<Route

         
path="/share"

         
element={

           
<Protected>

             
<ShareHealth />

           
</Protected>

          }

        />

       
<Route

         
path="/doctor/:token"

         
element={<DoctorView />}

        />

     
</Routes>

   
</BrowserRouter>

  );

}