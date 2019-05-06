import { Component, OnInit } from '@angular/core';
import { Passenger } from './models/passenger';
import { Elevator } from './models/elevator';

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

  ngOnInit(): void {
    this.elevator = new Elevator();
    this.passengers = new Array<Passenger>();
  }

  sendParameters(): void {
    this.passengers = new Array<Passenger>();

    for (let index = 0; index < this.numberOfPassengers; index++) {
      const passenger = new Passenger();
      passenger.index = index + 1;
      this.passengers.push(passenger);
    }
  }

  callElevator(): void {
    debugger
    while (!this.passengers.every(p => p.arrived)) {
      const passenger = this.findClosest();
      this.elevator.passengers.push(passenger);

      const ascending = passenger.targetFloor > passenger.currentFloor;
      this.elevator.currentFloor = ascending ? this.elevator.currentFloor++ : this.elevator.currentFloor--;

      if (ascending) {
        for (let floor = this.elevator.currentFloor; floor <= passenger.targetFloor; floor++) {
          this.handleElevator(floor);
        }
      } else {
        for (let floor = this.elevator.currentFloor; floor >= passenger.targetFloor; floor--) {
          this.handleElevator(floor);
        }
      }
    }
  }

  private handleElevator(floor: number) {
    const passengersOnRoute: Array<Passenger> = this.passengers.filter(p => p.currentFloor === floor);
    this.elevator.passengers.concat(passengersOnRoute);
    this.elevator.passengers.forEach(ep => {
      if (ep.targetFloor === floor) {
        const passengerInElevator = this.passengers.find(p => p.index === ep.index);
        passengerInElevator.arrived = true;
      }
    });
    this.elevator.passengers = this.elevator.passengers.filter(p => !p.arrived);
    this.elevator.currentFloor = floor;
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

  //   passengersFloors = passengersFloors.sort((a, b) => a - b);

  //   const passengersFloorsSize: number = passengersFloors.length;

  //   if (currentElevator <= passengersFloors[0]) {
  //     return passengersFloors[0];
  //   }

  //   if (currentElevator >= passengersFloors[passengersFloorsSize - 1]) {
  //     return passengersFloors[passengersFloorsSize - 1];
  //   }

  //   // Binary search
  //   let i: number = 0;
  //   let j = passengersFloorsSize;
  //   let mid = 0;
  //   while (i < j) {
  //     mid = (i + j) / 2;

  //     if (passengersFloors[mid] == currentElevator)
  //       return passengersFloors[mid];

  //     /* If target is less
  //     than array element,
  //     then search in left */
  //     if (currentElevator < passengersFloors[mid]) {

  //       // If target is greater
  //       // than previous to mid,
  //       // return closest of two
  //       if (mid > 0 && currentElevator > passengersFloors[mid - 1])
  //         return getClosest(passengersFloors[mid - 1],
  //           passengersFloors[mid], currentElevator);

  //       /* Repeat for left half */
  //       j = mid;
  //     }

  //     // If target is
  //     // greater than mid
  //     else {
  //       if (mid < passengersFloorsSize - 1 && currentElevator < passengersFloors[mid + 1])
  //         return getClosest(passengersFloors[mid],
  //           passengersFloors[mid + 1], currentElevator);
  //       i = mid + 1; // update i
  //     }
  //   }

  //   // Only single element
  //   // left after search
  //   return passengersFloors[mid];
  // }

  // // Method to compare which one
  // // is the more close We find the
  // // closest by taking the difference
  // // between the target and both
  // // values. It assumes that val2 is
  // // greater than val1 and target
  // // lies between these two.
  // public static int getClosest(int val1, int val2,
  //   int target) {
  //   if (target - val1 >= val2 - target)
  //     return val2;
  //   else
  //     return val1;
  // }
}
