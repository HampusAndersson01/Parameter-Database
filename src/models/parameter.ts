import { Schema, model, Document } from 'mongoose';

interface IParameter extends Document {
  name: string;
  description?: string;
  unit_id?: string;
  datatype?: string;
  decimals?: number;
  min?: number;
  max?: number;
  creation_date?: Date;
  modified_date?: Date;
  rigfamily_id?: string;
  comment?: string;
  created_by?: number;
  modified_by?: number;
}

const parameterSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  unit_id: { type: Schema.Types.ObjectId, ref: 'Unit' },
  datatype: { type: String },
  decimals: { type: Number },
  min: { type: Number },
  max: { type: Number },
  creation_date: { type: Date },
  modified_date: { type: Date },
  rigfamily_id: { type: Schema.Types.ObjectId, ref: 'Rigfamily' },
  comment: { type: String },
  created_by: { type: Number },
  modified_by: { type: Number },
});

export const Parameter = model<IParameter>('Parameter', parameterSchema);


