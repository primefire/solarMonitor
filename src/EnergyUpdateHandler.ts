import cron from 'node-cron';
import EnergyReadingModel from './Database/Models/EnergyReadingModel';

import TotalEnergyReading from './Models/TotalEnergyReading';

export default class EnergyUpdateHandler {
	private latestReading!: TotalEnergyReading;

	constructor() {
		this.bindFunctions();
		this.scheduleCronJobForEveryHour();
	}

	private bindFunctions(): void {
		this.handleEnergyUpdate = this.handleEnergyUpdate.bind(this);
		this.saveLatestReadingWithCleanTimestampInDatabaseIfAvailable = this.saveLatestReadingWithCleanTimestampInDatabaseIfAvailable.bind(this);
		this.getCurrentHourTimestamp = this.getCurrentHourTimestamp.bind(this);
	}

	private scheduleCronJobForEveryHour(): void {
		cron.schedule('0 * * * *', this.saveLatestReadingWithCleanTimestampInDatabaseIfAvailable);
	}

	private saveLatestReadingWithCleanTimestampInDatabaseIfAvailable(): void {
		if (this.latestReading) {
			let reading = this.latestReading;
			reading.timestamp = this.getCurrentHourTimestamp();
			let databaseModel = new EnergyReadingModel({
				timestamp: reading.timestamp,
				produced: reading.energyProduced,
				imported: reading.energyImported,
				exported: reading.energyExported
			});
			databaseModel.save();
		}
	}

	private getCurrentHourTimestamp(): Date {
		let timestamp = new Date();
		timestamp.setUTCMilliseconds(0);
		timestamp.setUTCSeconds(0);
		timestamp.setUTCMinutes(0);
		return timestamp;
	}

	public handleEnergyUpdate(totalEnergyReading: TotalEnergyReading): void {
		this.latestReading = totalEnergyReading;
	}
}
