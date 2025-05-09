import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions<string>();

type Props = {
    options: string[],
    tags: string[],
    setTags: (tags: string[]) => void
}

const TagAdder = ({ options, tags, setTags }: Props) => {
    return (
        <Autocomplete
            value={tags}
            onChange={(_, newValues) => {
                setTags(newValues.map(value => value));
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                    filtered.push(inputValue);
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            multiple
            disableCloseOnSelect
            options={options}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;

                if (!options.includes(option))
                    return <li key={key} {...optionProps}><b>Add Tag</b>: {option}</li>

                return <li key={key} {...optionProps}>{option}</li>
            }}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} label="Edit Tags" placeholder="Type to create tag..." />
            )}
        />
    );
}

export default TagAdder
