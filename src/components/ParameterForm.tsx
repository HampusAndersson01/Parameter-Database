import React, { useContext, useEffect, useState } from "react";
import "./style/ParameterForm.css";
import { CreatingParameterContext } from "../context/CreatingParameterContext";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {TableRowProps} from "./ParameterTable";
import {DataContext} from "../context/DataContext";
import { APIContext } from "../context/ApiContext";
import Creatable from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';




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
  creation_date?: string | null;
  modified_date?: string | null;
}

interface Option {
  readonly label: string;
  readonly value: string;
}


function ParameterForm(props: {
  data: TableRowProps[];
}) {
  const { creatingParameter, setCreatingParameter } = useContext(CreatingParameterContext);
  const { register, handleSubmit, control,watch, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      unit: "",
      rigfamily: "",
      datatype: "",
      decimals: 0,
      min: 0,
      max: 0,
      comment: "",
      images: [{name: "" ,url: "" ,description: ""}]
    }}
  );
  const {fields, append, remove} = useFieldArray({
    control,
    name: "images"
  });
  const {units, rigFamilies, dataTypes} = useContext(DataContext);
  const [unitOptions, setUnitOptions] = useState<Option[]>([]);
  const [rigFamilyOptions, setRigFamilyOptions] = useState<Option[]>([]);
  const [dataTypeOptions, setDataTypeOptions] = useState<Option[]>([]);
  const { hostname } = useContext(APIContext);
  
  const createOption = (label: string) => ({
    label,
    value: label,
  });

  //Create options for react-select
  useEffect(() => {
    let tempUnits: Option[] = [];
    units.forEach((unit) => {
      tempUnits.push(createOption(unit.name));
    });
    //sort alphabetically
    tempUnits.sort((a, b) => a.label.localeCompare(b.label));
    setUnitOptions(tempUnits);
  }, [units]);

  useEffect(() => {
    let tempRigFamilies: Option[] = [];
    rigFamilies.forEach((rigFamily) => {
      tempRigFamilies.push(createOption(rigFamily.name));
    });
    //sort alphabetically
    tempRigFamilies.sort((a, b) => a.label.localeCompare(b.label));
    setRigFamilyOptions(tempRigFamilies);
  }, [rigFamilies]);

  useEffect(() => {
    let tempDataTypes: Option[] = [];
    dataTypes.forEach((dataType) => { 
      if (dataType !== null && dataType !== undefined){
        tempDataTypes.push(createOption(dataType));
      }
    });
    //sort alphabetically
    tempDataTypes.sort((a, b) => a.label.localeCompare(b.label));
    setDataTypeOptions(tempDataTypes);
  }, [dataTypes]);
  

  const onSubmit = (data: any) => {
    console.log(data);
    // if(data.images.length > 1){
    //   data.images.forEach((image: any) => {
    //     if(image.url !== ""){

    const filteredData = data.images.filter((item: {url: String;}) => item.url !== "");

    const imageUrls = filteredData.map((item: { url: any;}) => item.url).join(";");
      
    const imageNames = filteredData.map((item: { name: any;}) => item.name).join(";");

    const imageDescriptions = filteredData.map((item: { description: any; }) => item.description).join(";");

    //if rigFamily is array join with ;
    //if rigfamily is option, get value
    
    const rigFamilies = data.rigfamily.map((item: { value: any; }) => item.value).join(";");
    
    let newParameter: NewParameter[] = [{
      name: data.name,
      description: data.description,
      unit: {
        name: data.unit.value
      },
      rigfamily: {
        name: rigFamilies,
      },
      datatype: data.datatype.value,
      decimals: data.decimals,
      min: data.min,
      max: data.max,
      comment: data.comment,
      images: {
        name: imageNames,
        description: imageDescriptions,
        url: imageUrls
      },

      created_by: "admin",//TODO: Change to logged in user
      modified_by: "admin",//TODO: Change to logged in user
      creation_date: new Date().toISOString().split('T')[0],
      modified_date: new Date().toISOString().split('T')[0]
    }];      

    fetch(hostname + "parameters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newParameter),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      }
      )
      .catch((error) => {
        console.error("Error:", error);
      }
      );
      
}


  const handleAddImage = () => {
    append({name: "" ,url: "" ,description: ""});
  };
  const handleRemoveImage = (index: number) => {
    remove(index);
  };

  
  const handleCreateUnit = (inputValue: string) => {
    const newOption = createOption(inputValue);
    setUnitOptions([...unitOptions, newOption]);
    setValue("unit", newOption);
  };

  const handleCreateRigFamily = (inputValue: string) => {
    const newOption = createOption(inputValue.toLocaleUpperCase());
    setRigFamilyOptions([...rigFamilyOptions, newOption]);
    setValue("rigfamily", newOption);
  };

  const handleCreateDataType = (inputValue: string) => {
    const newOption = createOption(inputValue);
    setDataTypeOptions([...dataTypeOptions, newOption]);
    setValue("datatype", newOption);
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
              <input type="text" {...register("name", { required: true, maxLength:255})} />
            </fieldset>

            <fieldset>
              <legend>Description</legend>
              <input type="text" {...register("description")} />
            </fieldset>

            <fieldset className="selectContainer">
              <legend>Unit</legend>
              <div className="selectWrapper">
              <Controller
                control={control}
                name="unit"
                rules={{ required: true }}
                render={({ field: { onChange, value, ref }}) => (
                <Creatable
                  options={unitOptions}
                  isClearable
                  onCreateOption={handleCreateUnit}
                  onChange={onChange}
                  value={value}
                  ref={ref}

                />
                )}
              />
       
              </div>
            </fieldset>

            

            <fieldset>
              <legend>Data Type</legend>
              <div className="selectWrapper">
              <Controller
                control={control}
                name="datatype"
                rules={{ required: true }}
                render={({ field: { onChange, value, ref }}) => (
                <Creatable
                  options={dataTypeOptions}
                  isClearable
                  onCreateOption={handleCreateDataType}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
                )}
              />
             
              </div>
            </fieldset>

            <fieldset>
              <legend>Decimals</legend>
              <input type="number" {...register("decimals")} />
            </fieldset>

            <fieldset>
              <legend>Min</legend>
              <input type="number" {...register("min")} />
            </fieldset>

            <fieldset>
              <legend>Max</legend>
              <input type="number" {...register("max")} />
            </fieldset>

            <fieldset>
              <legend>Comment</legend>
              <input type="text" {...register("comment")} />
            </fieldset>

            <fieldset className="selectContainer" >
              <legend>Rig Family</legend>
              <div className="selectWrapper">
              <Controller
                control={control}
                name="rigfamily"
                rules={{ required: true }}
                render={({ field: { onChange, value, ref }}) => (
                  <CreatableSelect
                    closeMenuOnSelect={false}
                    isClearable
                    isMulti
                    options={rigFamilyOptions}
                    onCreateOption={handleCreateRigFamily}
                    delimiter=";"
                    onChange={onChange}
                    value={value}
                    ref={ref}
                  />
                )}
              />
            </div>
            </fieldset>

            <fieldset className={fields.length > 2 ? "scroll" : ""}>
              <legend>Images</legend>
              {fields.map((item ,index) => (<div className="selectWrapper" key={item.id}>
              <input className="imagesName" placeholder="Title" defaultValue={item.name} type="text" {...register(`images.${index}.name`)} />
                <input className="imagesUrl" placeholder="Url" defaultValue={item.url} type="text" {...register(`images.${index}.url`)} />
                <input className="imagesDescription" placeholder="Description" defaultValue={item.description} type="text" {...register(`images.${index}.description`)} />
                
                
                <DeleteIcon className={fields.length > 1 ? "deleteSelect" : "deleteSelect hidden"} onClick={() => handleRemoveImage(index)}></DeleteIcon>
              </div>))}
              <AddIcon className="addSelect" onClick={handleAddImage}></AddIcon>
            </fieldset>

            <fieldset className="submitContainer">
              <input type="submit" className="submitBtn"/>
            </fieldset>
          </form>
            
        </div>
      </div>
    </div>
  );
}

export default ParameterForm;


