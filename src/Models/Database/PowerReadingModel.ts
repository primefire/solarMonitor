import { model, Schema } from 'mongoose';

const powerReadingSchema = new Schema(
	{
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
	}
);

const PowerReadingModel = model('PowerReading', powerReadingSchema);

export default PowerReadingModel;