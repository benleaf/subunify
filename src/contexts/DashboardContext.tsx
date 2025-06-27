import { ClusterResult, ProjectPreviewResult, ProjectResult } from "@/types/server/ProjectResult";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { isError } from "@/api/isError";
import { useUpload } from "./UploadContext";
import { Collaborator } from "@/types/Collaborator";

type Project = {
    projects: ProjectPreviewResult[],
    selectedProjectId: string,
    selectedProject?: ProjectResult,
    selectedCluster: ClusterResult,
    projectRole?: Collaborator['role'],
    projectCollaborators?: Collaborator[],
    page: 'projects' |
    'project' |
    'cluster' |
    'statistics' |
    'billing' |
    'settings' |
    'upload' |
    'account' |
    'addStorage' |
    'createProject' |
    'download' |
    'manageProject' |
    'advancedFileSettings' |
    'manageCollaborators'
}

interface DashboardType {
    loadProject: (projectId?: string) => Promise<void>
    loadProjects: () => Promise<void>
    updateProperties: (properties: Partial<Project>) => void,
    properties: Partial<Project>
}

const DashboardContext = createContext<DashboardType | undefined>(undefined)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authAction, user } = useAuth()
    const { setDataStored } = useUpload()
    const [project, setProject] = useState<Partial<Project>>({ page: 'projects' });

    const updateProperties = (properties: Partial<Project>) => {
        setProject(old => ({ ...old, ...properties }))
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
            updateProperties({ projectRole: userRole, projectCollaborators })
        }
    }

    const loadProject = async (projectId?: string) => {
        const contingentProjectId = projectId ?? project.selectedProjectId
        if (!contingentProjectId) return
        const projectResult = await authAction<ProjectResult>(`project/user-project/${contingentProjectId}`, 'GET')
        if (!isError(projectResult) && projectResult) {
            const bytesUploaded = projectResult.files
                .filter(file => file.created)
                .reduce((n, { bytes }) => n + +bytes, 0) ?? 0
            setDataStored(contingentProjectId, bytesUploaded)

            updateProperties({
                selectedProject: projectResult,
                selectedProjectId: projectResult.id
            })

            await getCollaborators(projectResult.id)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [])


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
