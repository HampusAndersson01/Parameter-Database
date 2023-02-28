import { Schema, model, Document } from 'mongoose';

interface IUnit extends Document {
    name: string;
    description?: string;
}

const unitSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, nullable: true },
});

export const Unit = model<IUnit>('Unit', unitSchema);

