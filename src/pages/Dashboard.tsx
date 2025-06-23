import Cluster from "@/components/flows/dashboard/Cluster";
import Project from "@/components/flows/dashboard/Project";
import Projects from "@/components/flows/dashboard/Projects";
import Upload from "@/components/flows/dashboard/Upload";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import UserAccount from "../components/flows/dashboard/UserAccount";
import AddStorage from "@/components/flows/dashboard/AddStorage";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import CreateProject from "@/components/flows/dashboard/CreateProject";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import Download from "@/components/flows/dashboard/Download";

const DashboardWithContext = () => {
    const { properties, loadProject } = useDashboard()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const projectId = searchParams.get('projectId')
        if (projectId) {
            loadProject(projectId)
            navigate('/dashboard')
        }
    }, [searchParams])

    return <DashboardLayout>
        {properties.page == 'projects' && <Projects />}
        {properties.page == 'project' && <Project />}
        {properties.page == 'download' && <Download />}
        {properties.page == 'cluster' && <Cluster />}
        {properties.page == 'upload' && <Upload />}
        {properties.page == 'account' && <UserAccount />}
        {properties.page == 'addStorage' && <AddStorage />}
        {properties.page == 'createProject' && <CreateProject />}
    </DashboardLayout>
}

const Dashboard = () => {
    return <DashboardProvider>
        <ThumbnailProvider>
            <DashboardWithContext />
        </ThumbnailProvider>
    </DashboardProvider>
}

export default Dashboard