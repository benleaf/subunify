import UploadButton from "./UploadButton"

const ExcelImporter = ({ setExcelFile }: { setExcelFile: (book: File) => void }) => {
    const initaliseSheet = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExcelFile(event.target.files![0])
    }
    return <UploadButton onClick={initaliseSheet} >Upload Excel File</UploadButton>
}

export default ExcelImporter