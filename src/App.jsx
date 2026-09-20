import './index.css'
import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landing-pages/LandingPage"
import AuthRequired from "./layouts/ProtectedRoute"

import Dashboard from "./pages/profile-pages/Dashboard"
import Goals from "./pages/profile-pages/Goals"
import StudySessions from "./pages/profile-pages/StudySessions"
import Goal from "./pages/profile-pages/Goal"

import LogIn from "./pages/landing-pages/LogIn"
import SignUp from "./pages/landing-pages/SignUp"
import LandingLayout from "./layouts/LandingLayout"
import AuthContextProvider from "./AuthContext"

import Skill from './pages/profile-pages/Skill'
import Milestones from './pages/profile-pages/skillPages/Milestones'
import Notes from './pages/profile-pages/skillPages/Notes'
import Resources from './pages/profile-pages/skillPages/Resources'
import Project from './pages/profile-pages/Project'
import SkillStudySessions from './pages/profile-pages/skillPages/SkillStudySessions'
import Settings from './pages/profile-pages/Settings'
import ProtectedRoute from './layouts/ProtectedRoute'
import AppLayout from './layouts/AppLayout'

export default function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<LandingLayout/>}>
          <Route index element={<LandingPage/>}/>
          <Route path="login" element={<LogIn/>}/>
          <Route path="signup" element={<SignUp/>}/>
        </Route>
        
        <Route element={<ProtectedRoute/>}>
          <Route path="user" element={<AppLayout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="goals" element={<Goals/>} />
            <Route path="goals/:goalId" element={<Goal/>}/>
            <Route path='goals/:goalId/projects/:projectId' element={<Project/>}/>
            <Route path='settings' element={<Settings/>}/>

            <Route path="goals/:goalId/skills/:skillId" element={<Skill/>}>
              <Route index element={<Milestones/>} />
              <Route path='notes' element={<Notes/>}/>
              <Route path='resources' element={<Resources/>}/>
              <Route path='study-sessions' element={<SkillStudySessions/>}/>
            </Route>

            <Route path="study-sessions" element={<StudySessions/>} />
          </Route>
          
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}
