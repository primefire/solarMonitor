import { Model, Document, model, Schema } from 'mongoose';

export interface PowerReadingDocument extends Document {
	timestamp: Date;
	solar: number;
	grid: number;
}

const powerReadingSchema = new Schema({
	timestamp: {
		type: Date,
		required: true,
		unique: true
	},
	solar: {
		type: Number,
		required: true
	},
	grid: {
		type: Number,
		required: true
	}
});

export interface InterfacePowerReading extends PowerReadingDocument {}

export interface InterfacePowerReadingModel extends Model<InterfacePowerReading> {}

const PowerReadingModel: InterfacePowerReadingModel = model<InterfacePowerReading, InterfacePowerReadingModel>('PowerReading', powerReadingSchema);

export default PowerReadingModel;
