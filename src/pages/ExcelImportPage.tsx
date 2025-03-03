import { useEffect, useState } from "react";
import SheetTabs from "@/components/sheet/SheetTabs";
import { Workbook, Buffer } from "exceljs";
import BaseModal from "@/components/modal/BaseModal";
import ExcelImporter from "@/components/form/ExcelImporter";
import GlassText from "@/components/glassmorphism/GlassText";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import { Divider } from "@mui/material";

const ExcelImportPage = () => {
    const [file, setFile] = useState<File>()
    const [workbook, setWorkbook] = useState<Workbook>()

    useEffect(() => {
        if (!file) return
        const wb = new Workbook();
        const reader = new FileReader()

        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer as Buffer).then(workbook => {
                setWorkbook(workbook)
                reader.abort()
            })
        }
    }, [file])

    return <>
        <BaseModal state={file ? "closed" : "open"}>
            <GlassSpace size={"small"}>
                <GlassText size="huge">Select an Excel File</GlassText>
                <GlassSpace size={"small"}>
                    <GlassText size="modrate">
                        <ol>
                            <li>
                                Upload an Excel file you want to get data from
                            </li>
                            <li>
                                Create a new SUBUNIFY table and give it a name
                            </li>
                            <li>
                                Give the new table a headder by selecting a row or column of your excel document
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
        <SheetTabs worksheets={workbook?.worksheets} />
    </>
}

export default ExcelImportPage