import { Routes, Route } from "react-router-dom"
import './index.css'
import LandingPage from "./pages/LandingPage"
import Authrequired from "./pages/Authrequired"
import Dashboard from "./pages/Dashboard"
import SignIn from "./pages/SignIn"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}>
        <Route path="signin" element={<SignIn/>}/>
      </Route>
      <Route element={<Authrequired/>}>
        <Route path="/dashboard" element={<Dashboard/>} />
      </Route>
    </Routes>
  )
}
