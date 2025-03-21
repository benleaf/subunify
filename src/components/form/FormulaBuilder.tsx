import { useState } from "react";
import GlassCard from "../glassmorphism/GlassCard";
import { FormControl, Select, MenuItem, Stack, TextField, IconButton, FormLabel, Button } from "@mui/material";
import GlassText from "../glassmorphism/GlassText";
import { CssSizes } from "@/constants/CssSizes";
import { Delete, Save } from "@mui/icons-material";
import { DataFormat } from "@/types/DataFormat";
import { operationDefinitions } from "@/formulas/OperationDefinitions";
import { JsonLogicEquation, Formula, EquationElementKey, Operation, OperationTypes, EquationOptionTypes, equationOptions } from "@/formulas";

type DataInput = {
  displayName: string;
  id: string;
  type: DataFormat['type']
}

type Props = {
  dataInputs: DataInput[]
  initialJsonLogic?: JsonLogicEquation
  onSubmit: (options: JsonLogicEquation) => void
}

const DemoQueryBuilder = ({ initialJsonLogic, dataInputs, onSubmit }: Props) => {
  const [equation, setEquation] = useState<Formula>(initialJsonLogic?.formula)

  const updateEquationAtPath = (prevEquation: Formula, newEquation: Formula, path: EquationElementKey[]): Formula => {
    if (path.length === 0) return newEquation

    if (prevEquation && typeof prevEquation == 'object' && !('var' in prevEquation)) {
      const [current, ...remainingPath] = path
      const equations = Object.values(prevEquation)[0]
      equations[current.paramIndex] = updateEquationAtPath(equations[current.paramIndex], newEquation, remainingPath)
      return { [current.key]: equations } as Operation
    }
  }

  const collectVariables = (formula: Formula): string[] => {
    if (typeof formula == 'object' && 'var' in formula) {
      return [formula.var]
    } else if (formula && typeof formula == 'object') {
      const equations = Object.values(formula)[0]
      return equations.flatMap(collectVariables)
    } else {
      return []
    }
  }

  const addOperations = (operationType: Formula, path: EquationElementKey[]) => {
    setEquation((prevEquation) =>
      updateEquationAtPath(prevEquation, operationType, path)
    );
  }

  const renderOperation = (localEquation: Operation, path: EquationElementKey[]) => {
    const equations = Object.values(localEquation)[0]
    const key = Object.keys(localEquation)[0] as OperationTypes

    return <div style={{ display: 'flex', flexWrap: 'wrap', scrollbarWidth: 'none', alignItems: 'center', width: '100%' }}>
      {equations.length > 0 && RenderEquation(equations[0], [...path, { key, paramIndex: 0 }])}
      {equations.length > 1 && equations.slice().splice(1).map((equation, index) => <>
        <div>
          <GlassText size="large" style={{ padding: CssSizes.tiny }}>
            {operationDefinitions[key].label}
          </GlassText>
        </div>
        {RenderEquation(equation, [...path, { key, paramIndex: index + 1 }])}
      </>)}
    </div>
  }

  const getDefaultEquation = (type: EquationOptionTypes): Formula => {
    if (type == 'number') return 0
    if (type == 'otherFieldData') return { var: dataInputs[0].id }
    return { [type]: [undefined, undefined] } as Operation
  }

  const RenderEquation = (localEquation: Formula, path: EquationElementKey[]) => {
    return <GlassCard marginSize="tiny" paddingSize="tiny" flex={1}>
      <Stack direction='row' alignItems='center'>
        {RenderEquationInput(localEquation, path)}
        {localEquation !== undefined && <IconButton onClick={_ => addOperations(undefined, path)}>
          <Delete />
        </IconButton>}
      </Stack>
    </GlassCard>
  }

  const RenderEquationInput = (localEquation: Formula, path: EquationElementKey[]) => {
    if (localEquation && typeof localEquation == 'object' && !('var' in localEquation)) {
      return renderOperation(localEquation, path)
    } else if (typeof localEquation == 'number') {
      return <TextField
        type="number"
        label="Number"
        defaultValue={localEquation}
        onChange={e => addOperations(+e.target.value, path)}
        style={{ width: 200 }}
      />
    } else if (localEquation && typeof localEquation == 'object' && 'var' in localEquation) {
      return <Select
        label="Other Field"
        onChange={e => addOperations({ var: e.target.value as string }, path)}
        defaultValue={localEquation.var}
        style={{ minWidth: 200 }}
      >
        {dataInputs.map(
          (dataInput, index) => <MenuItem key={index} value={dataInput.id}>{dataInput.displayName}</MenuItem>
        )}
      </Select>
    } else {
      return <FormControl style={{ minWidth: 100, flex: 1 }}>
        <FormLabel>Operation</FormLabel>
        <Select
          onChange={e => addOperations(getDefaultEquation(e.target.value as EquationOptionTypes), path)}

        >
          {Object.keys(equationOptions).map(
            definition => <MenuItem value={definition}>
              {equationOptions[definition as EquationOptionTypes].label}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    }
  }

  return <Stack>
    {RenderEquation(equation, [])}
    <Button
      variant="outlined"
      startIcon={<Save />}
      onClick={() => onSubmit({ formula: equation, variables: collectVariables(equation) })}
    >Save</Button>
  </Stack>
}
export default DemoQueryBuilder;