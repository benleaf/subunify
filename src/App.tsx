import ExcelImporter from "@/components/form/ExcelImporter";
import SheetTabs from "./components/sheet/SheetTabs";
import { useState } from "react";
import Excel from "exceljs";

const App = () => {
  const [workbook, setWorkbook] = useState<Excel.Workbook>()

  return (
    <div>
      {!workbook && <ExcelImporter setWorkbook={setWorkbook} />}
      {workbook && <SheetTabs workbook={workbook} />}
    </div>
  )
}

export default App