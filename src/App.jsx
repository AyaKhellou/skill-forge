import { Routes, Route } from "react-router-dom"
import './index.css'
import LandingPage from "./pages/landing-pages/LandingPage"
import Authrequired from "./layouts/Authrequired"

import Dashboard from "./pages/profile-pages/Dashboard"
import Goals from "./pages/profile-pages/Goals"
import Skills from "./pages/profile-pages/Skills"
import Projects from "./pages/profile-pages/Projects"
import StudySessions from "./pages/profile-pages/StudySessions"
import Achievements from "./pages/profile-pages/Achievements"

import LogIn from "./pages/landing-pages/LogIn"
import SignUp from "./pages/landing-pages/SignUp"
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
        
        <Route path="user" element={<Authrequired/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="goals" element={<Goals/>} />
          <Route path="skills" element={<Skills/>} />
          <Route path="projects" element={<Projects/>} />
          <Route path="studysessions" element={<StudySessions/>} />
          <Route path="achievements" element={<Achievements/>} />
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}
