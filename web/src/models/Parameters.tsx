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

export interface Unit {
  name: string;
  description: string | null;
}

