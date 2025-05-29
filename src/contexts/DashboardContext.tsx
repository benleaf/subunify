import { ClusterResult, ProjectPreviewResult, ProjectResult } from "@/types/server/ProjectResult";
import React, { createContext, useState, useContext } from "react";

const exampleProjects = [
    { id: '1', color: 'red', name: 'Apple V1', description: 'This is an example project to show what navigation in subunify might look like', uploaded: 1.5, collaborators: 2, daysToArchive: 90 },
    { id: '2', color: 'yellow', name: 'Samsung Project Duo', description: 'This is an example project to show what navigation in subunify might look like', uploaded: 2.1, collaborators: 43, daysToArchive: 69 },
    { id: '3', color: 'blue', name: `Trader Joe's Project #5`, description: 'This is an example project to show what navigation in subunify might look like', uploaded: 4.2, collaborators: 24, daysToArchive: 28 },
    { id: '4', color: 'green', name: 'FedEx Synth Wave Commercial', description: 'This is an example project to show what navigation in subunify might look like', uploaded: 0.2, collaborators: 97, daysToArchive: 5 },
]

type Project = {
    projects: Partial<ProjectPreviewResult>[],
    selectedProject: ProjectResult,
    selectedCluster: ClusterResult,
    page: 'projects' | 'project' | 'cluster' | 'statistics' | 'billing' | 'settings' | 'upload'
}

interface DashboardType {
    updateProperties: (properties: Partial<Project>) => void,
    properties: Partial<Project>
}

const DashboardContext = createContext<DashboardType | undefined>(undefined)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [project, setProject] = useState<Partial<Project>>({ projects: exampleProjects, page: 'projects' });

    const updateProperties = (properties: Partial<Project>) => {
        setProject(old => ({ ...old, ...properties }))
    }

    return <DashboardContext.Provider
        value={{ properties: project, updateProperties }}>
        {children}
    </DashboardContext.Provider>;
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error("useDashboard must be used within an DashboardProvider");
    return context;
};
