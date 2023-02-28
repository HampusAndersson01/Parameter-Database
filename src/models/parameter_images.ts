//parameter_images model

import { Schema, model, Document } from 'mongoose';

interface IParameterImage extends Document {
    parameter_id: number;
    image_id: number;
}

const parameterImageSchema = new Schema({
    parameter_id: { type: Schema.Types.ObjectId, ref: 'Parameter', required: true },
    image_id: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
});

export const ParameterImage = model<IParameterImage>('ParameterImage', parameterImageSchema);

