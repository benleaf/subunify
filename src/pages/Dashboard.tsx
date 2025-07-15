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
import ManageProject from "@/components/flows/dashboard/ManageProject";
import AdvancedFileSettings from "@/components/flows/dashboard/AdvancedFileSettings";
import ManageCollaborators from "@/components/flows/dashboard/ManageCollaborators";
import Bundle from "@/components/flows/dashboard/Bundle";
import { ActionProvider } from "@/contexts/actions/infrastructure/ActionContext";
import WipeProject from "@/components/flows/dashboard/WipeProject";
import Billing from "@/components/flows/dashboard/Billing";
import TutorialModal from "@/components/modal/TutorialModal";
import GlassText from "@/components/glassmorphism/GlassText";
import GlassSpace from "@/components/glassmorphism/GlassSpace";

const DashboardWithContext = () => {
    const { properties, loadProject, updateProperties } = useDashboard()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const projectId = searchParams.get('projectId')
        const bundleId = searchParams.get('bundleId')
        if (projectId) {
            loadProject(projectId)
            navigate('/dashboard')
        }
        if (bundleId) {
            updateProperties({ page: 'bundle', selectedBundleId: bundleId })
        }
    }, [searchParams])

    return <DashboardLayout>
        {properties.page == 'projects' && <Projects />}
        {properties.page == 'billing' && <Billing />}
        {properties.page == 'project' && <Project />}
        {properties.page == 'download' && <Download />}
        {properties.page == 'cluster' && <Cluster />}
        {properties.page == 'upload' && <Upload />}
        {properties.page == 'account' && <UserAccount />}
        {properties.page == 'addStorage' && <AddStorage />}
        {properties.page == 'bundle' && <Bundle />}
        {properties.page == 'createProject' && <CreateProject />}
        {properties.page == 'manageProject' && <ManageProject />}
        {properties.page == 'advancedFileSettings' && <AdvancedFileSettings />}
        {properties.page == 'manageCollaborators' && <ManageCollaborators />}
        {properties.page == 'wipeProject' && <WipeProject />}

        <TutorialModal modalName="introToDashboard">
            <GlassSpace size="small">
                <GlassText size="big" style={{ textAlign: 'center' }}>
                    Welcome to the <b>Dashboard</b>!
                </GlassText>
                <GlassText size="moderate" style={{ textAlign: 'center' }}>
                    Create or join a project to get started. Invite collaborators, upload footage, and manage your footage all in one place.
                </GlassText>
            </GlassSpace>
        </TutorialModal>
    </DashboardLayout>
}

const Dashboard = () => {
    return <DashboardProvider>
        <ActionProvider>
            <ThumbnailProvider>
                <DashboardWithContext />
            </ThumbnailProvider>
        </ActionProvider>
    </DashboardProvider>
}

export default Dashboard