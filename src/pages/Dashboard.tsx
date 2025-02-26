import { applicationReducer } from "../stateManagment/reducers/ApplicationReducer";
import { createContext, Dispatch, useEffect, useReducer } from "react";
import { getResource } from "../api/getResource";
import { ApplicationEvents } from "@/types/application/ApplicationEvents";
import { ApplicationState } from "@/types/application/ApplicationState";
import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import GlassText from "@/components/glassmorphism/GlassText";
import TablesTable from "@/components/TablesDataTable/TablesTable";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import CreateChartForm from "@/components/charts/CreateChartForm";

export const ApplicationDispatch = createContext<{
    dispatch: Dispatch<ApplicationEvents>,
    state: ApplicationState
} | undefined>(undefined);

const Dashboard = () => {
    const { height, width } = useSize()
    const [state, dispatch] = useReducer(applicationReducer, {
        selectedScreen: 'Tables'
    })

    useEffect(() => {
        const runFetch = async () => {
            if (state.loadingData) {
                const resource = await getResource(
                    state.loadingData.resource,
                    state.loadingData.method,
                    state.loadingData.dto
                )
                dispatch({ action: state.loadingData.resource, data: resource } as ApplicationEvents)
            }
        }

        runFetch()
    }, [state.loadingData])

    return <ApplicationDispatch.Provider value={{ dispatch, state }}>
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ height: height - ComponentSizes.topBar, width: width - ComponentSizes.sideBar }}>
                <GlassCard marginSize="modrate" paddingSize="modrate" height={(height - ComponentSizes.topBar) - 45}>
                    {state.selectedScreen == 'Tables' && <>
                        <GlassText size='huge'>{state.selectedTable?.name ?? 'No Table Selected'}</GlassText>
                        <div style={{ height: height - ComponentSizes.topBar - 120 }}>
                            <TablesTable />
                        </div>
                    </>}
                    {state.selectedScreen == 'Charts' && state.tables && <>
                        <CreateChartForm tables={state.tables} />
                    </>}
                </GlassCard>
            </div>
        </div>
    </ApplicationDispatch.Provider>
}

export default Dashboard