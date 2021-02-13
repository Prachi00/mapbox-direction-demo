import { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

const Input = (props) => {
  const { cities, label, index, handleChange, propValue } = props;
  const inputName = propValue?.name || "";
  const [value, setValue] = useState(propValue);
  const [inputValue, setInputValue] = useState(inputName);
  /* making the input controlled so that cases like deleting from 
    mid of list can be handled */
  useEffect(() => {
    if (inputName) {
      setInputValue(inputName);
    }
  }, [inputName]);
  
  return (
    <Autocomplete
      freeSolo
      clearOnBlur
      value={value}
      inputValue={inputValue}
      options={cities}
      onChange={(event, newValue) => {
        handleChange(index, newValue);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option.name}
      fullWidth={true}
      getOptionSelected={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="standard" />
      )}
    />
  );
};

export default Input;
