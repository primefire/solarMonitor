import EnergyReadingModel from './Database/Models/EnergyReadingModel';

import TotalEnergyReading from './Models/TotalEnergyReading';

export default class EnergyUpdateHandler {
	private latestTimestampString!: string;

	constructor() {
		this.bindFunctions();
	}

	private bindFunctions(): void {
		this.handleEnergyUpdate = this.handleEnergyUpdate.bind(this);
		this.getCurrentHourTimestamp = this.getCurrentHourTimestamp.bind(this);
		this.doesThisTimestampStartANewHour = this.doesThisTimestampStartANewHour.bind(this);
		this.saveLatestReadingWithCleanTimestampInDatabase = this.saveLatestReadingWithCleanTimestampInDatabase.bind(this);
	}

	public handleEnergyUpdate(totalEnergyReading: TotalEnergyReading): void {
		let timestampString = this.getCurrentHourTimestamp().toISOString();
		if (this.doesThisTimestampStartANewHour(timestampString)) {
			this.saveLatestReadingWithCleanTimestampInDatabase(totalEnergyReading);
		}
		this.latestTimestampString = timestampString;
	}

	private getCurrentHourTimestamp(): Date {
		let timestamp = new Date();
		timestamp.setUTCMilliseconds(0);
		timestamp.setUTCSeconds(0);
		timestamp.setUTCMinutes(0);
		return timestamp;
	}

	private doesThisTimestampStartANewHour(timestamp: string): boolean {
		return this.latestTimestampString != null && this.latestTimestampString !== timestamp;
	}

	private saveLatestReadingWithCleanTimestampInDatabase(reading: TotalEnergyReading): void {
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
