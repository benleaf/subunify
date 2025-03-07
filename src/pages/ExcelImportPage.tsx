import { useContext, useEffect, useState } from "react";
import SheetTabs from "@/components/sheet/SheetTabs";
import { Workbook, Buffer } from "exceljs";
import BaseModal from "@/components/modal/BaseModal";
import ExcelImporter from "@/components/form/ExcelImporter";
import GlassText from "@/components/glassmorphism/GlassText";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import { Divider } from "@mui/material";
import { StateMachineDispatch } from "@/App";
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext";

const ExcelImportPage = () => {
    const context = useContext(StateMachineDispatch)!
    const [file, setFile] = useState<File>()

    useEffect(() => {
        context.dispatch({ action: 'startExcelImporter' })
    }, [])

    useEffect(() => {
        if (!file || !isExcelImporter(context)) return
        const wb = new Workbook();
        const reader = new FileReader()

        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer as Buffer).then(workbook => {
                context.dispatch({ action: 'setWorksheets', data: workbook.worksheets })
                reader.abort()
                context.dispatch({ action: 'popup', data: { colour: 'success', message: 'File uploaded' } })
            })
        }
    }, [file, context.state.data.machine])

    return isExcelImporter(context) && <>
        <BaseModal state={file ? "closed" : "open"}>
            <GlassSpace size={"small"}>
                <GlassText size="huge">Select an Excel File</GlassText>
                <GlassSpace size={"small"}>
                    <GlassText size="moderate">
                        <ol>
                            <li>
                                Upload an Excel file you want to get data from
                            </li>
                            <li>
                                Create a new SUBUNIFY table and give it a name
                            </li>
                            <li>
                                Give the new table a header by selecting a row or column of your excel document
                            </li>
                            <li>
                                Select data that should be loaded into your new table
                            </li>
                            <li>
                                Repeat to taste
                            </li>
                            <li>
                                Deploy your SUBUNIFY tables to the cloud!
                            </li>
                        </ol>
                    </GlassText>
                </GlassSpace>
                <Divider style={{ marginBottom: '2em' }} />
                <ExcelImporter setExcelFile={setFile} />
            </GlassSpace>
        </BaseModal>
        <SheetTabs />
    </>
}

export default ExcelImportPage