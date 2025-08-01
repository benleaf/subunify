import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"

export const addProjectStorage = ({ authAction, updateProperties, setAlert, setLoading }: ActionInput) => async (projectId: string, tbsToAdd: number) => {
    if (!tbsToAdd || tbsToAdd < 1) {
        setAlert('You must add at least 1 TB of storage.', 'error')
        return
    }

    setLoading(true)
    const result = await authAction<void>(`stripe/pay-for-terabytes/${projectId}/${tbsToAdd}`, 'GET')
    setLoading(false)

    if (!isError(result)) {
        setAlert(`${tbsToAdd} TB${tbsToAdd == 1 ? '' : 's'} added to project`, 'error')
        updateProperties({ page: 'project' })
    }
}