/**
 * @module Models/Unit
 * @description The Unit model
 * 
 * @category Models
 * @group Models
 * 
 */
/**
 * @typedef {Object} Unit
 * @description The Unit model
 * 
 * @property {number} id
 * @property {string} name
 * @property {string | null} description
 */
export type unitModel = {
  id: number;
  name: string;
  description: string | null;
}[];
