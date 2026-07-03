import { Routes, Route } from "react-router-dom"
import './index.css'
import LandingPage from "./pages/LandingPage"
import Authrequired from "./layouts/Authrequired"
import Dashboard from "./pages/Dashboard"
import LogIn from "./pages/LogIn"
import SignUp from "./pages/SignUp"
import LandingLayout from "./layouts/LandingLayout"
import AuthContextProvider from "./authContext"

export default function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<LandingLayout/>}>
          <Route index element={<LandingPage/>}/>
          <Route path="login" element={<LogIn/>}/>
          <Route path="signup" element={<SignUp/>}/>
        </Route>

        <Route element={<Authrequired/>}>
          <Route path="dashboard" element={<Dashboard/>} />
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}
