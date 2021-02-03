import mongoose from "mongoose";

export default class DatabaseConnection {
    private connectionString: string;
    private connectionOptions!: mongoose.ConnectionOptions;

    constructor() {
        this.connectionString = String(process.env.MONGO_URI);
        this.setConnectionOptions();
    }

    private setConnectionOptions(): void {
		this.connectionOptions = {
            authSource: String(process.env.MONGO_AUTH_SOURCE),
            user: String(process.env.MONGO_USER),
            pass: String(process.env.MONGO_PASS),
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000,
            useFindAndModify: false,
            useCreateIndex: true,
            autoIndex: true,
            poolSize: 10
        }
    }
    
    public async connectToDatabase(): Promise<void> {
		  await this.tryToEstablishAConnectionOrInterruptIfNotSuccessful();
    }
    
    private async tryToEstablishAConnectionOrInterruptIfNotSuccessful(): Promise<void> {
		try {
			await mongoose.connect(this.connectionString, this.connectionOptions);
		} catch (error) {
			throw new Error('Could not connect to the database.');
		}
        console.log('Established a connection to the database.')
    }
    
    public async disconnectFromDatabase(): Promise<void> {
		try {
			await mongoose.connection.close();
		} catch (error) {
			console.error('Could not disconnect from database.', error);
		}
		console.log('Disconnected from database peacefully.');
	}
}