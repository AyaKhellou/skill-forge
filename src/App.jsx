import './index.css'
import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landing-pages/LandingPage"
import Authrequired from "./layouts/Authrequired"

import Dashboard from "./pages/profile-pages/Dashboard"
import Goals from "./pages/profile-pages/Goals"
import StudySessions from "./pages/profile-pages/StudySessions"
import Achievements from "./pages/profile-pages/Achievements"
import Goal from "./pages/profile-pages/Goal"

import LogIn from "./pages/landing-pages/LogIn"
import SignUp from "./pages/landing-pages/SignUp"
import LandingLayout from "./layouts/LandingLayout"
import AuthContextProvider from "./authContext"

import Skill from './pages/profile-pages/Skill'
import Milestones from './pages/profile-pages/skillPages/Milestones'
import Notes from './pages/profile-pages/skillPages/Notes'
import Resourses from './pages/profile-pages/skillPages/Resourses'
import Projects from './pages/profile-pages/skillPages/Projects'
// import StudySessions from './pages/profile-pages/skillPages/StudySessions'

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
          <Route path="goals/:goal" element={<Goal/>}/>

          <Route path="goals/:goal/skills/:skill" element={<Skill/>}>
            <Route index element={<Milestones/>} />
            <Route path='notes' element={<Notes/>}/>
            <Route path='resourses' element={<Resourses/>}/>
            <Route path='projects' element={<Projects/>}/>
            {/* <Route path='study-sessions'/> */}
          </Route>

          <Route path="studysessions" element={<StudySessions/>} />
          <Route path="achievements" element={<Achievements/>} />
          
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}
