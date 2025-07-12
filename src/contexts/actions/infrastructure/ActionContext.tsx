import { createContext, useContext } from "react";
import { ActionInput } from "@/types/actions/ActionInput";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { getActions } from "./getActions";

type ActionType = ReturnType<typeof getActions>

const ActionContext = createContext<ActionType | undefined>(undefined)

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { updateProperties, properties } = useDashboard()
    const { authAction, setAlert, setLoading } = useAuth()

    const injected: ActionInput = { updateProperties, properties, authAction, setAlert, setLoading }
    const dependencyInjectedActions = getActions(injected)

    return <ActionContext.Provider value={dependencyInjectedActions}>
        {children}
    </ActionContext.Provider>
};

export const useAction = () => {
    const context = useContext(ActionContext);
    if (!context) throw new Error("useAction must be used within an ActionProvider");
    return context;
};
