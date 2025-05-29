import React, { createContext, useState, useContext } from "react";
import { User } from "@/types/User";

type Project = {
    name: string,
    codeName: string,
    description: string,
    id: string,
    projectType: 'large' | 'pro' | 'enterprise'
    collaborators: Partial<User>[],
}

interface CreateProjectType {
    updateProject: (properties: Partial<Project>) => void,
    project: Partial<Project>
}

const CreateProjectContext = createContext<CreateProjectType | undefined>(undefined)

export const CreateProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [project, setProject] = useState<Partial<Project>>({});

    const updateProject = (properties: Partial<Project>) => {
        setProject(old => ({ ...old, ...properties }))
    }

    return <CreateProjectContext.Provider
        value={{ project, updateProject }}>
        {children}
    </CreateProjectContext.Provider>;
};

export const useCreateProject = () => {
    const context = useContext(CreateProjectContext);
    if (!context) throw new Error("useCreateProject must be used within an CreateProjectProvider");
    return context;
};
