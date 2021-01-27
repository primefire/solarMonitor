import PowerReadingModel from "./Models/Database/PowerReadingModel";
import TotalPowerReading from "./Models/TotalPowerReading";

export default class PowerUpdateHandler {
    private buffer: Array<TotalPowerReading>;
    private latestTimestampString: string;

    constructor() {
        this.buffer = [];
        this.latestTimestampString = '';

        this.bindFunctions();
    }

    private bindFunctions(): void {
        this.handleCurrentPowerUpdate = this.handleCurrentPowerUpdate.bind(this);
        this.convertTimestampToStringWithoutSecondsOrMilliseconds = this.convertTimestampToStringWithoutSecondsOrMilliseconds.bind(this);
        this.doesThisTimestampStartANewMinute = this.doesThisTimestampStartANewMinute.bind(this);
        this.handleBufferedData = this.handleBufferedData.bind(this);
        this.calculateAverageSolarAndGridPowerFromBuffer = this.calculateAverageSolarAndGridPowerFromBuffer.bind(this);
        this.saveAveragesAndTimestampInDatabase = this.saveAveragesAndTimestampInDatabase.bind(this);
        this.clearBuffer = this.clearBuffer.bind(this);
        this.addTotalPowerReadingToBuffer = this.addTotalPowerReadingToBuffer.bind(this);
        this.setLatestTimestampStringToCurrentTimestamp = this.setLatestTimestampStringToCurrentTimestamp.bind(this);
    }

    public handleCurrentPowerUpdate(totalPowerReading: TotalPowerReading): void {

        let timestamp = this.convertTimestampToStringWithoutSecondsOrMilliseconds(totalPowerReading.timestamp);

        if (!this.doesThisTimestampStartANewMinute(timestamp)) {

            this.addTotalPowerReadingToBuffer(totalPowerReading);

        } else {

            this.handleBufferedData();
            this.clearBuffer();
            this.addTotalPowerReadingToBuffer(totalPowerReading);

        }

        this.setLatestTimestampStringToCurrentTimestamp(timestamp);
    }

    private convertTimestampToStringWithoutSecondsOrMilliseconds(timestamp: Date): string {
        timestamp = new Date(timestamp);
        timestamp.setUTCSeconds(0);
        timestamp.setUTCMilliseconds(0);
        return timestamp.toISOString();
    }

    private doesThisTimestampStartANewMinute(timestamp: string): boolean {
        return !(timestamp === this.latestTimestampString || this.buffer.length === 0);
    }

    private handleBufferedData(): void {
        let {solarAvg, gridAvg} = this.calculateAverageSolarAndGridPowerFromBuffer();
        this.saveAveragesAndTimestampInDatabase(solarAvg, gridAvg);
    }

    private calculateAverageSolarAndGridPowerFromBuffer(): { solarAvg: number; gridAvg: number; } {
        let solarSum = 0;
        let gridSum = 0;
        this.buffer.forEach((powerReading: TotalPowerReading) => {
            solarSum += powerReading.production.wattage;
            gridSum += powerReading.grid.wattage;
        })
        let solarAvg = Math.floor(solarSum/this.buffer.length);
        let gridAvg = Math.floor(gridSum/this.buffer.length);
        return {solarAvg, gridAvg};
    }

    private saveAveragesAndTimestampInDatabase(solarAvg: number, gridAvg: number): void {
        new PowerReadingModel({solar: solarAvg, grid: gridAvg, timestamp: new Date(this.latestTimestampString)}).save();
    }

    private clearBuffer(): void {
        this.buffer = [];
    }

    private addTotalPowerReadingToBuffer(totalPowerReading: TotalPowerReading): void {
        this.buffer.push(totalPowerReading);
    }

    private setLatestTimestampStringToCurrentTimestamp(timestamp: string): void {
        this.latestTimestampString = timestamp;
    }
}