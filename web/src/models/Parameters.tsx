/**
 * @module Models/Parameters
 * 
 * @description
 * Contains the models for the Parameters component
 * @category Models
 * @group Models
 * 
 */

/**
 * @typedef {Object} Parameters
 * @description The Parameters model
 * 
 * @property {number} id
 * @property {string} name
 * @property {string | null} description
 * @property {Unit} unit
 * @property {RigFamily[]} rigFamily
 * @property {number | null} decimals
 * @property {number | null} min
 * @property {number | null} max
 * @property {string | null} datatype
 * @property {string | null} created_by
 * @property {string | null} modified_by
 * @property {Date | null} creation_date
 * @property {Date | null} modified_date
 * @property {boolean} [active]
 * @property {Image[] | null} images
 * @property {string | null} comment
 * @property {Possible_value[] | null} possible_values
 */ 
export interface TableRowProps {
  id: number;
  name: string;
  description: string | null;
  unit: Unit;
  rigFamily: RigFamily[];
  decimals: number | null;
  min: number | null;
  max: number | null;
  datatype: string | null;
  created_by: string | null;
  modified_by: string | null;
  creation_date: Date | null;
  modified_date: Date | null;
  active?: boolean;
  images: Image[] | null;
  comment: string | null;
  possible_values: Possible_value[] | null;
}

/**
 * @typedef {Object} NewParameter
 * @description The NewParameter model for creating a new parameter
 * 
 * @property {string} name
 * @property {string | null} description
 * @property {Unit | null} unit
 * @property {RigFamily | null} rigfamily
 * @property {string | null} datatype
 * @property {number | null} decimals
 * @property {number | null} min
 * @property {number | null} max
 * @property {string | null} comment
 * @property {Image | null} images
 * @property {Possible_value | null} possible_values
 * @property {string | null} created_by
 * @property {string | null} modified_by
 * @property {string | null} creation_date
 * @property {string | null} modified_date
 */
export interface NewParameter {
  name: string;
  description?: string | null;
  unit: {
    name: string;
    description?: string;
  } | null;
  rigfamily: {
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
  possible_values?: {
    value: string;
    description?: string;
  } | null;
  created_by?: string | null;
  modified_by?: string | null;
  creation_date?: string | null;
  modified_date?: string | null;
}

/**
 * @typedef {Object} Image
 * @description The Image model
 * 
 * @property {string} image_url
 * @property {string | null} image_name
 * @property {string | null} image_description
 */
export interface Image {
  image_url: string;
  image_name: string | null;
  image_description: string | null;
}

/**
 * @typedef {Object} Possible_value
 * @description The Possible_value model
 * 
 * @property {string} value
 * @property {string | null} description
 */
export interface Possible_value {
  value: string;
  description: string | null;
}
/**
 * @typedef {Object} RigFamily
 * @description The RigFamily model
 * 
 * @property {string} name
 * @property {string | null} description
 */
export interface RigFamily {
  name: string;
  description: string | null;
}
/**
 * @typedef {Object} Unit
 * @description The Unit model
 * 
 * @property {string} name
 * @property {string | null} description
 */
export interface Unit {
  name: string;
  description: string | null;
}

