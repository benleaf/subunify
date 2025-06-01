import Cluster from "@/components/flows/dashboard/Cluster";
import Project from "@/components/flows/dashboard/Project";
import Projects from "@/components/flows/dashboard/Projects";
import Upload from "@/components/flows/dashboard/Upload";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import UserAccount from "../components/flows/dashboard/UserAccount";

const DashboardWithContext = () => {
    const { properties } = useDashboard()

    return <DashboardLayout>
        {properties.page == 'projects' && <Projects />}
        {properties.page == 'project' && <Project />}
        {properties.page == 'cluster' && <Cluster />}
        {properties.page == 'upload' && <Upload />}
        {properties.page == 'account' && <UserAccount />}
    </DashboardLayout>
}

const Dashboard = () => {
    return <DashboardProvider>
        <DashboardWithContext />
    </DashboardProvider>
}

export default Dashboard