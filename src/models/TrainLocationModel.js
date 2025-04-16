// Train location tracking model
export class TrainLocation {
  constructor(
    trainId,
    trainNumber,
    lastStation,
    nextStation,
    lastStationTime,
    nextStationTime,
    currentPosition, // percentage between stations (0-100)
    status, // 'On Time', 'Delayed', 'Arrived', etc.
    routeStations = [], // Array of station names in order along the route
    timestamp = new Date().toISOString()
  ) {
    this.trainId = trainId;
    this.trainNumber = trainNumber;
    this.lastStation = lastStation;
    this.nextStation = nextStation;
    this.lastStationTime = lastStationTime;
    this.nextStationTime = nextStationTime;
    this.currentPosition = currentPosition;
    this.status = status;
    this.routeStations = routeStations;
    this.timestamp = timestamp;
  }

  // Calculate time remaining to next station
  getTimeToNextStation() {
    if (!this.nextStationTime) return '0m';
    
    const now = new Date();
    const nextTime = new Date();
    const [hours, minutes] = this.nextStationTime.split(':').map(num => parseInt(num, 10));
    
    nextTime.setHours(hours, minutes, 0, 0);
    
    // If the time is for tomorrow (in case of overnight trains)
    if (nextTime < now) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    
    const diffMs = nextTime - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs} hr ${diffMins} min`;
    }
    return `${diffMins} min`;
  }

  // Check if train has arrived at the next station
  hasArrived() {
    return this.status === 'Arrived' || this.currentPosition >= 100;
  }
}

// Route model to represent a train route with stations and timing
export class TrainRoute {
  constructor(
    id,
    name,
    stations = [], // Array of {name, code, arrivalTime, departureTime}
    distance,
    durationMinutes
  ) {
    this.id = id;
    this.name = name;
    this.stations = stations;
    this.distance = distance;
    this.durationMinutes = durationMinutes;
  }

  // Get total number of stations
  getStationCount() {
    return this.stations.length;
  }

  // Get station names only
  getStationNames() {
    return this.stations.map(station => station.name);
  }
  
  // Calculate distance between two stations in the route
  getDistanceBetweenStations(station1, station2) {
    const index1 = this.stations.findIndex(s => s.name === station1);
    const index2 = this.stations.findIndex(s => s.name === station2);
    
    if (index1 === -1 || index2 === -1) return 0;
    
    // Calculate based on percentage of total distance
    const totalStations = this.stations.length - 1;
    const segmentsBetween = Math.abs(index2 - index1);
    
    return (segmentsBetween / totalStations) * this.distance;
  }
}
