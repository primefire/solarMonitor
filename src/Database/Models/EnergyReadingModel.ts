import { Model, Document, model, Schema } from 'mongoose';

export interface EnergyReadingDocument extends Document {
	timestamp: Date;
	produced: number;
	imported: number;
	exported: number;
}

const energyReadingSchema = new Schema({
	timestamp: {
		type: Date,
		required: true,
		unique: true
	},
	produced: {
		type: Number,
		required: true
	},
	imported: {
		type: Number,
		required: true
	},
	exported: {
		type: Number,
		required: true
	}
});

export interface InterfaceEnergyReading extends EnergyReadingDocument {}

export interface InterfaceEnergyReadingModel extends Model<InterfaceEnergyReading> {}

const EnergyReadingModel: InterfaceEnergyReadingModel = model<InterfaceEnergyReading, InterfaceEnergyReadingModel>('EnergyReading', energyReadingSchema);

export default EnergyReadingModel;
