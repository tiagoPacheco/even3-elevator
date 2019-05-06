import { Passenger } from './passenger';

export class Elevator {
    currentFloor: number;
    elapsedFloor: number;
    passengers: Array<Passenger>;

    constructor() {
        this.passengers = new Array<Passenger>();
        this.elapsedFloor = 0;
    }
}
