import { Component, OnInit } from '@angular/core';
import { Passenger } from './models/passenger';
import { Elevator } from './models/elevator';
import { delay } from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  elevator: Elevator;
  passengers: Array<Passenger>;
  numberOfPassengers: number;
  totalFloors: number;
  totalFloorsList: Array<any>;
  private delay = 1000;

  ngOnInit(): void {
    this.elevator = new Elevator();
    this.elevator.elapsedFloor = 0;
    this.passengers = new Array<Passenger>();
    this.totalFloorsList = new Array<any>();
  }

  sendParameters(): void {
    this.passengers = new Array<Passenger>();
    this.totalFloorsList = new Array<any>();

    for (let index = 0; index <= this.totalFloors; index++) {
      this.totalFloorsList.push({ floor: index });
    }

    for (let index = 0; index < this.numberOfPassengers; index++) {
      const passenger = new Passenger();
      passenger.index = index + 1;
      this.passengers.push(passenger);
    }
  }

  async callElevator() {

    while (!this.passengers.every(p => p.arrived)) {
      const passenger = this.findClosest();
      this.elevator.passengers.push(passenger);

      const ascending = passenger.targetFloor > passenger.currentFloor;

      const ascendingInitialPassenger = this.elevator.currentFloor > passenger.currentFloor;

      if (ascendingInitialPassenger) {
        for (let floor = this.elevator.currentFloor; floor >= passenger.currentFloor; floor--) {
          await this.liftElevator(floor);
        }
      } else {
        for (let floor = this.elevator.currentFloor; floor <= passenger.currentFloor; floor++) {
          await this.liftElevator(floor);
        }
      }

      if (ascending) {
        for (let floor = this.elevator.currentFloor; floor <= passenger.targetFloor; floor++) {
          await this.handleElevator(floor);
        }
      } else {
        for (let floor = this.elevator.currentFloor; floor >= passenger.targetFloor; floor--) {
          await this.handleElevator(floor);
        }
      }
    }
  }

  private async liftElevator(floor) {
    if (this.elevator.currentFloor !== floor) {
      this.elevator.currentFloor = floor;
      this.elevator.elapsedFloor++;
      await delay(this.delay);
    }
  }

  private async handleElevator(floor: number) {
    const passengersOnRoute: Array<Passenger> = this.passengers.filter(p => p.currentFloor === floor);
    this.elevator.passengers.push(...passengersOnRoute);
    this.elevator.passengers.forEach(ep => {
      if (ep.targetFloor === floor) {
        const passengerInElevator = this.passengers.find(p => p.index === ep.index);
        passengerInElevator.arrived = true;
      }
    });

    this.elevator.passengers = this.elevator.passengers.filter(p => !p.arrived);
    await this.liftElevator(floor);
  }

  private findClosest() {

    const passengersFloors = this.passengers.filter(p => !p.arrived).sort((a, b) => a.currentFloor - b.currentFloor);

    let distance: number = Math.abs(passengersFloors[0].currentFloor - this.elevator.currentFloor);
    let closestIndex = 0;

    for (let i = 0; i < passengersFloors.length; i++) {
      const currentClosestValue: number = Math.abs(passengersFloors[i].currentFloor - this.elevator.currentFloor);
      if (currentClosestValue < distance) {
        closestIndex = i;
        distance = currentClosestValue;
      }
    }

    return passengersFloors[closestIndex];
  }
}
