export interface TableRowProps {
  id: number;
  name: string;
  description: string | null;
  unit_name: string | null;
  unit_description: string | null;
  rigFamily: RigFamily[] | null; 
  decimals: number | null;
  min: number | null;
  max: number | null;
  datatype: string | null;
  created_by: string | null;
  modified_by: string | null;
  creation_date: string | null;
  modified_date: string | null;
  active?: boolean;
  images?: Image[] | null;
  comment: string | null;
  possible_values?: Possible_value[] | null;
}

export interface Image {
  image_url: string;
  image_name: string | null;
  image_description: string | null;
}
export interface Possible_value {
  value: string;
  description: string | null;
}
export interface RigFamily {
  name: string;
  description: string | null;
}
