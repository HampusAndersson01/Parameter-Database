import React, { useContext, useEffect, useState } from "react";
import "./style/ParameterForm.css";
import { CreatingParameterContext } from "../context/CreatingParameterContext";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { RigFamiliesContext } from "../context/RigFamiliesContext";
import { useForm } from "react-hook-form";
import {TableRowProps} from "./ParameterTable";
import {APIContext} from "../context/ApiContext";
interface NewParameter {
  name: string;
  description?: string | null;
  unit?: {
    name: string;
    description?: string;
  } | null;
  rigfamily?: {
    name: string;
    description?: string;
  } | null;
  datatype?: string | null;
  decimals?: number | null;
  min?: number | null;
  max?: number | null;
  comment?: string | null;
  images?: {
    name?: string;
    description?: string;
    url: string;
  } | null;
  created_by?: string | null;
  modified_by?: string | null;
  creation_date?: Date | null;
  modified_date?: Date | null;
}

interface Unit {
  name: string;
  description?: string;
}


function ParameterForm(props: {
  data: TableRowProps[];
}) {
  const { creatingParameter, setCreatingParameter } = useContext(CreatingParameterContext);
  const { register, handleSubmit, watch, formState: { errors },setValue } = useForm();
  const { hostname } = useContext(APIContext);
  const [Units, setUnits] = useState<Unit[]>();

  const [selectedUnits, setSelectedUnits] = useState<string[]>([""]);


  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    fetch(hostname+"units")
      .then((response) => response.json())
      .then((data) => setUnits(data))
      .catch((error) => console.log(error))
      .finally(() => console.log("data loaded"));
  }, []);
  
                        
  
  const handleUnitChange = (event: any, index:number) => {
    //FIXME Use index to update the correct unit
    let temp = selectedUnits;
    temp.push(event.target.value);
    setSelectedUnits(temp);
  };

  const handleAddUnit = () => {
    let temp = selectedUnits;
    temp.push("");
    setSelectedUnits(temp);
    
    console.log(temp);
  };
  return (
    <div className={creatingParameter ? "parameterFormContainer active" : "parameterFormContainer"}>
      <div className="parameterForm">
        <div className="parameterFormHeader">
          <h2 className="title">Create new parameter</h2>
          <CloseIcon onClick={() => setCreatingParameter(false)} className="closeButton">X</CloseIcon>
          </div>
        <div className="parameterFormBody">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend>Name</legend>
              <input type="text" {...register("name", { required: true, maxLength:255 })} />
            </fieldset>
            <fieldset>
              <legend>Description</legend>
              <input type="text" {...register("description")} />
            </fieldset>
            <fieldset className="unitsContainer">
              <legend>Unit</legend>
              {selectedUnits.map((row,index) => (<div className="unitContainer">
              <select {...register("unit.name", { required: true })} onChange={() => (handleUnitChange(event,index)) }>
                <option value=""></option>
                {Units ? Units.map((row) => (row.name ? <option value={row.name}>{row.name}</option> : null)): null}
              </select>
              <AddIcon className="addUnit" onClick={handleAddUnit}></AddIcon>
            </div>))}
            </fieldset>


            <input type="submit" />
          </form>
            
        </div>
      </div>
    </div>
  );
}

export default ParameterForm;
