//sensor model

import { Schema, model, Document } from 'mongoose';
import { type } from 'os';

interface ISensor extends Document {
    name: string;
    supplier?: string;
    datasheet?: string;
    link_to_calibration?: string;
    type? : string;
}

const sensorSchema = new Schema({
    name: { type: String, required: true },
    supplier: { type: String, nullable: true },
    datasheet: { type: String, nullable: true },
    link_to_calibration: { type: String, nullable: true },
    type: { type: String, nullable: true },
});

export const Sensor = model<ISensor>('Sensor', sensorSchema);
