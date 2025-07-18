import { ClusterResult, ProjectPreviewResult, ProjectResult } from "@/types/server/ProjectResult";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { isError } from "@/api/isError";
import { useUpload } from "./UploadContext";
import { Collaborator } from "@/types/Collaborator";
import { Bundle } from "@/types/Bundle";
import { UpdateProperties } from "@/types/actions/UpdateProperties";
import { DashboardProperties } from "@/types/actions/DashboardProperties";

interface DashboardType {
    loadProject: (projectId?: string) => Promise<ProjectResult | undefined>
    loadProjects: () => Promise<void>
    updateProperties: UpdateProperties,
    properties: Partial<DashboardProperties>
}

const DashboardContext = createContext<DashboardType | undefined>(undefined)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authAction, user } = useAuth()
    const { setDataStored } = useUpload()
    const [project, setProject] = useState<Partial<DashboardProperties>>({ page: 'projects' });

    const updateProperties = (properties: Partial<DashboardProperties>) => {
        setProject(old => ({ ...old, ...properties }))
    }

    const loadBundles = async () => {
        const bundles = await authAction<Bundle[]>('bundle', 'GET')
        if (!isError(bundles) && bundles) {
            updateProperties({ bundles })
        }
    }

    const loadProjects = async () => {
        const projects = await authAction<ProjectPreviewResult[]>('project/user-projects', 'GET')
        if (!isError(projects) && projects) {
            updateProperties({ projects })
        }
    }

    const getCollaborators = async (projectId: string) => {
        const collaborators = await authAction<Partial<Collaborator[]>>(`project/collaborators/${projectId}`, 'GET')
        if (!isError(collaborators)) {
            const projectCollaborators = collaborators.filter(collaborator => collaborator !== undefined)
            const userRole = collaborators.find(collaborator => collaborator?.email == user.email)?.role
            updateProperties({ projectRole: userRole, collaborators: projectCollaborators })
        }
    }

    const loadProject = async (projectId?: string) => {
        const contingentProjectId = projectId ?? project.selectedProjectId
        if (!contingentProjectId) return
        const projectResult = await authAction<ProjectResult>(`project/user-project/${contingentProjectId}`, 'GET')
        if (!isError(projectResult) && projectResult) {
            const bytesUploaded = projectResult.files
                .filter(file => file.created)
                .map(file => file.bytes + file.proxyFiles.reduce((n, { bytes }) => n + +bytes, 0))
                .reduce((n, bytes) => n + +bytes, 0) ?? 0
            setDataStored(contingentProjectId, bytesUploaded)

            updateProperties({
                selectedProject: projectResult,
                selectedProjectId: projectResult.id
            })

            await getCollaborators(projectResult.id)
            return projectResult
        }
    }

    useEffect(() => {
        loadProjects()
        loadBundles()
    }, [project.page == 'projects'])


    return <DashboardContext.Provider
        value={{ properties: project, updateProperties, loadProject, loadProjects }}>
        {children}
    </DashboardContext.Provider>;
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error("useDashboard must be used within an DashboardProvider");
    return context;
};
