/**
 * @module Models/RigFamily
 * @description
 * Model for rigfamily
 * @category Models
 * @group Models
 */
/**
 * @typedef {Object} RigFamily
 * @description The RigFamily model
 * 
 * @property {number} id
 * @property {string} name
 * @property {string | null} description

 */
export type rigFamilyModel = {
  id: number;
  name: string;
  description: string | null;
}[];
