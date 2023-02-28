//image model

import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
    name: string;
    description?: string;
    link: string;
}

const imageSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, nullable: true },
    link: { type: String, required: true },
});

export const Image = model<IImage>('Image', imageSchema);


