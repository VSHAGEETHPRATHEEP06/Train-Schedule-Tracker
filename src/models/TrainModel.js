// Train data model
export class Train {
  constructor(
    id,
    name,
    number,
    source,
    destination,
    departureTime,
    arrivalTime,
    duration,
    distance,
    fare,
    amenities = [],
    status = 'On Time',
    type = 'Express',
    frequency = 'Daily'
  ) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.source = source;
    this.destination = destination;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.duration = duration;
    this.distance = distance;
    this.fare = fare;
    this.amenities = amenities;
    this.status = status;
    this.type = type;
    this.frequency = frequency;
  }
}

// Station data model
export class Station {
  constructor(id, name, code, city, state, address) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.city = city;
    this.state = state;
    this.address = address;
  }
}

// User data model
export class User {
  constructor(id, name, email, phone, favorites = []) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.favorites = favorites;
  }
}

// Booking data model
export class Booking {
  constructor(
    id,
    trainId,
    userId,
    journeyDate,
    passengers,
    totalFare,
    bookingDate,
    status = 'Confirmed'
  ) {
    this.id = id;
    this.trainId = trainId;
    this.userId = userId;
    this.journeyDate = journeyDate;
    this.passengers = passengers;
    this.totalFare = totalFare;
    this.bookingDate = bookingDate;
    this.status = status;
  }
}

// Passenger data model
export class Passenger {
  constructor(id, name, age, gender, seatNumber = null) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.seatNumber = seatNumber;
  }
}
