import { useEffect, useState } from "react";
import styles from "./Inputs.module.scss";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Input from "../Input/Input";

function Inputs(props) {
  const { updateMap, removePoint } = props;
  // fields store the number of inputs present and their values
  const [fields, setFields] = useState([null, null]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // fetching the cities json and converting it to an array of objs
    async function fetchCities() {
      const response = await fetch("cities.json");
      const countries = await response.json();
      const transformed = Object.values(countries);
      setOptions(transformed);
    }

    fetchCities();
  }, []);

  function handleAdd() {
    const values = [...fields];
    values.push(null);
    setFields(values);
  }

  function handleRemove(e, i) {
    const values = [...fields];
    values.splice(i, 1);
    /* when a point is removed we call it separetely as markers
       and waypoints have to be removed.*/
    removePoint(i);
    setFields(values);
  }

  const onLocationChange = (index, value) => {
    // storing the location objects on change
    setFields((prev) => {
      const clonedLoc = [...prev];
      clonedLoc[index] = value;
      return clonedLoc;
    });
  };

  useEffect(() => {
    // plot the locations onto the map whenever they change and removing null values
    const validFields = fields.filter((item) => item);
    updateMap(validFields);
  }, [fields]);

  return (
		<div className={styles.inputs}>
			{fields.map((item, index) => (
				<div className={styles.inputs__container} key={index}>
					<Input
						cities={options}
						propValue={item}
						label={index === 0 ? "Choose Starting point" : "Choose destination"}
						index={index}
						handleChange={onLocationChange}
					/>
					{/* showing the cross button from 3rd item */}
					{![0, 1].includes(index) ? (
						<div onClick={(e) => handleRemove(e, index)}>
							<CloseIcon />
						</div>
					) : null}
				</div>
			))}
			{/* add new inputs button */}
			{fields.length < 5 ? (
				<div onClick={() => handleAdd()} className={styles.inputs__add}>
					<AddCircleOutlineIcon />
					Add destination
				</div>
			) : null}
		</div>
	);
}

export default Inputs;
