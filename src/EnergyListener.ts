import {io, Socket} from 'socket.io-client';

export default class EnergyListener {
    private energyListenerAddress: string;
    private energyListenerPort: number;
    private socket!: Socket;

    constructor() {
        this.energyListenerAddress = String(process.env.ENERGYLISTENER_ADDRESS);
        this.energyListenerPort = Number(process.env.ENERGYLISTENER_PORT);
    }

    public startEnergyListener(): void {
        this.connectEnergyListenerSocket();
    }

    private connectEnergyListenerSocket(): void {
        this.socket = io(`${this.energyListenerAddress}:${this.energyListenerPort}`);
    }

    public addListenerFunctionForCurrentPower(listener: Function): void {
        this.socket.on('current', listener);
    }

    public removeListenerFunctionForCurrentPower(listener: Function): void {
        this.socket.off('current', listener);
    }

    public addListenerFunctionForTotalEnergy(listener: Function): void {
        this.socket.on('total', listener);
    }

    public removeListenerFunctionForTotalEnergy(listener: Function): void {
        this.socket.off('total', listener);
    }
}