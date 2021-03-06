import dotenv from 'dotenv';
import DatabaseConnection from './Database/DatabaseConnection';
import EnergyListener from './EnergyListener';
import EnergyUpdateHandler from './EnergyUpdateHandler';
import PowerUpdateHandler from './PowerUpdateHandler';

export default class SolarMonitorStarter {
	private databaseConnection!: DatabaseConnection;
	private energyListener!: EnergyListener;
	private powerUpdateHandler!: PowerUpdateHandler;
	private energyUpdateHandler!: EnergyUpdateHandler;

	constructor() {
		this.loadEnvironmentVariablesAndInterruptStartIfNotPresent();
		this.inititalizeDatabaseConnection();
		this.inititalizeEnergyListener();
		this.inititalizePowerUpdateHandler();
		this.inititalizeEnergyUpdateHandler();
	}

	private loadEnvironmentVariablesAndInterruptStartIfNotPresent(): void {
		this.loadEnvironmentVariablesFromEnvFile();
		if (!this.areAllEnvironmentVariablesPresent()) {
			throw new Error('Not all mandatory environment variables are present.');
		}
	}

	private loadEnvironmentVariablesFromEnvFile(): void {
		dotenv.config();
	}

	private areAllEnvironmentVariablesPresent(): boolean {
		if (
			!process.env.MONGO_URI ||
			!process.env.MONGO_AUTH_SOURCE ||
			!process.env.MONGO_USER ||
			!process.env.MONGO_PASS ||
			!process.env.ENERGYLISTENER_ADDRESS ||
			!process.env.ENERGYLISTENER_PORT
		) {
			return false;
		}
		return true;
	}

	private inititalizeDatabaseConnection(): void {
		this.databaseConnection = new DatabaseConnection();
	}

	private inititalizeEnergyListener(): void {
		this.energyListener = new EnergyListener();
	}

	private inititalizePowerUpdateHandler(): void {
		this.powerUpdateHandler = new PowerUpdateHandler();
	}

	private inititalizeEnergyUpdateHandler(): void {
		this.energyUpdateHandler = new EnergyUpdateHandler();
	}

	public async startSolarMonitor(): Promise<void> {
		await this.connectToDatabase();
		this.connectEnergyListener();
		this.setUpPowerUpdateHandler();
		this.setUpEnergyUpdateHandler();
	}

	private async connectToDatabase(): Promise<void> {
		await this.databaseConnection.connectToDatabase();
	}

	private connectEnergyListener(): void {
		this.energyListener.startEnergyListener();
	}

	private setUpPowerUpdateHandler(): void {
		this.energyListener.addListenerFunctionForCurrentPower(this.powerUpdateHandler.handleCurrentPowerUpdate);
	}

	private setUpEnergyUpdateHandler(): void {
		this.energyListener.addListenerFunctionForTotalEnergy(this.energyUpdateHandler.handleEnergyUpdate);
	}
}
