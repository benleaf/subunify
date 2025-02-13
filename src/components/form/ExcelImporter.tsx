import UploadButton from "./UploadButton"
import Excel from "exceljs";

const ExcelImporter = ({ setWorkbook }: { setWorkbook: (book: Excel.Workbook) => void }) => {
    const initaliseSheet = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0]
        const wb = new Excel.Workbook();
        const reader = new FileReader()

        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer as Excel.Buffer).then(workbook => {
                setWorkbook(workbook)
                reader.abort()
            })
        }
    }
    return <UploadButton onClick={initaliseSheet} >Upload Excel File (localy)</UploadButton>
}

export default ExcelImporter