import { ClusterResult, ProjectPreviewResult, ProjectResult } from "@/types/server/ProjectResult";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { isError } from "@/api/isError";

type Project = {
    projects: ProjectPreviewResult[],
    selectedProjectId: string,
    selectedProject?: ProjectResult,
    selectedCluster: ClusterResult,
    page: 'projects' | 'project' | 'cluster' | 'statistics' | 'billing' | 'settings' | 'upload' | 'account' | 'addStorage' | 'createProject'
}

interface DashboardType {
    loadProject: (projectId?: string) => Promise<void>
    loadProjects: () => Promise<void>
    updateProperties: (properties: Partial<Project>) => void,
    properties: Partial<Project>
}

const DashboardContext = createContext<DashboardType | undefined>(undefined)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authAction } = useAuth()
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

    const loadProject = async (projectId?: string) => {
        if (!projectId || !project.selectedProjectId) return
        const projectResult = await authAction<ProjectResult>(`project/user-project/${projectId ?? project.selectedProjectId}`, 'GET')
        if (!isError(projectResult) && projectResult) {
            updateProperties({ selectedProject: projectResult, selectedProjectId: projectResult.id })
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
