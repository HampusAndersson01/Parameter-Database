
// export interface Parameter {
//   name: string;
//   description?: string | null;
//   unit_id?: number | null;
//   unit_name?: string | null;
//   unit_description?: string | null;
//   datatype?: string | null;
//   decimals?: number | null;
//   min?: number | null;
//   max?: number | null;
//   creation_date?: Date | null;
//   modified_date?: Date | null;
//   rigfamily_id?: number[] | null;
//   rigfamily_name?: string[] | null;
//   rigfamily_description?: string[] | null;
//   comment?: string | null;
//   created_by?: number | null;
//   modified_by?: number | null;
//   possible_values?: string[] | null;
//   possible_values_description?: string[] | null;
// }

export interface Parameters {
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
    possible_values?: {
      value: string;
      description?: string;
    } | null;
  }