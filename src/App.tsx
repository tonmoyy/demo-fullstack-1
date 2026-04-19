import { Routes, Route } from "react-router-dom"

// Public
import Home from "./pages/Home"

// Auth
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

// Influencer
import InfluencerDashboard from "./pages/influencer/Dashboard"
import InfluencerCampaigns from "./pages/influencer/Campaigns"
import InfluencerApplications from "./pages/influencer/Applications"

// Brand
import BrandDashboard from "./pages/brand/Dashboard.tsx"
import BrandCampaigns from "./pages/brand/Campaigns"
import BrandApplications from "./pages/brand/Applications"

// Admin
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsers from "./pages/admin/Users"
import AdminReports from "./pages/admin/Reports"
import type {JSX} from "react"


function App(): JSX.Element {

    return (
        <Routes>

            {/* Public */}
            <Route path="/" element={<Home/>}/>

            {/* Auth */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>

            {/* Influencer */}
            <Route path="/influencer" element={<InfluencerDashboard/>}/>
            <Route path="/influencer/campaigns" element={<InfluencerCampaigns/>}/>
            <Route path="/influencer/applications" element={<InfluencerApplications/>}/>

            {/* Brand */}
            <Route path="/brand" element={<BrandDashboard/>}/>
            <Route path="/brand/campaigns" element={<BrandCampaigns/>}/>
            <Route path="/brand/applications" element={<BrandApplications/>}/>

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admin/users" element={<AdminUsers/>}/>
            <Route path="/admin/reports" element={<AdminReports/>}/>

        </Routes>
    )
}

export default App