// Sri Lankan Train Data
// This file contains data for Sri Lankan trains, stations, and routes
// Updated April 2025 with official fare data from railway.gov.lk

// Sri Lankan train stations
export const sriLankaStations = [
  { id: '1', name: 'Colombo Fort', code: 'CLF', city: 'Colombo', state: 'Western Province', address: 'Colombo Fort, Colombo, Sri Lanka' },
  { id: '2', name: 'Maradana', code: 'MDA', city: 'Colombo', state: 'Western Province', address: 'Maradana, Colombo, Sri Lanka' },
  { id: '3', name: 'Dematagoda', code: 'DMG', city: 'Colombo', state: 'Western Province', address: 'Dematagoda, Colombo, Sri Lanka' },
  { id: '4', name: 'Kelaniya', code: 'KEL', city: 'Colombo', state: 'Western Province', address: 'Kelaniya, Colombo, Sri Lanka' },
  { id: '5', name: 'Wanawasala', code: 'WNW', city: 'Colombo', state: 'Western Province', address: 'Wanawasala, Colombo, Sri Lanka' },
  { id: '6', name: 'Hunupitiya', code: 'HUN', city: 'Colombo', state: 'Western Province', address: 'Hunupitiya, Colombo, Sri Lanka' },
  { id: '7', name: 'Enderamulla', code: 'END', city: 'Gampaha', state: 'Western Province', address: 'Enderamulla, Gampaha, Sri Lanka' },
  { id: '8', name: 'Horape', code: 'HRP', city: 'Gampaha', state: 'Western Province', address: 'Horape, Gampaha, Sri Lanka' },
  { id: '9', name: 'Ragama', code: 'RGM', city: 'Gampaha', state: 'Western Province', address: 'Ragama, Gampaha, Sri Lanka' },
  { id: '10', name: 'Walpola', code: 'WLP', city: 'Gampaha', state: 'Western Province', address: 'Walpola, Gampaha, Sri Lanka' },
  { id: '11', name: 'Batuwatta', code: 'BTW', city: 'Gampaha', state: 'Western Province', address: 'Batuwatta, Gampaha, Sri Lanka' },
  { id: '12', name: 'Bulugahagoda', code: 'BLG', city: 'Gampaha', state: 'Western Province', address: 'Bulugahagoda, Gampaha, Sri Lanka' },
  { id: '13', name: 'Ganemulla', code: 'GNM', city: 'Gampaha', state: 'Western Province', address: 'Ganemulla, Gampaha, Sri Lanka' },
  { id: '14', name: 'Yagoda', code: 'YGD', city: 'Gampaha', state: 'Western Province', address: 'Yagoda, Gampaha, Sri Lanka' },
  { id: '15', name: 'Gampaha', code: 'GPH', city: 'Gampaha', state: 'Western Province', address: 'Gampaha, Sri Lanka' },
  { id: '16', name: 'Daraluwa', code: 'DRL', city: 'Gampaha', state: 'Western Province', address: 'Daraluwa, Gampaha, Sri Lanka' },
  { id: '17', name: 'Bemmulla', code: 'BEM', city: 'Gampaha', state: 'Western Province', address: 'Bemmulla, Gampaha, Sri Lanka' },
  { id: '18', name: 'Magalegoda', code: 'MGL', city: 'Gampaha', state: 'Western Province', address: 'Magalegoda, Gampaha, Sri Lanka' },
  { id: '19', name: 'Heendeniya-Pattiyagama', code: 'HPM', city: 'Gampaha', state: 'Western Province', address: 'Heendeniya-Pattiyagama, Gampaha, Sri Lanka' },
  { id: '20', name: 'Veyangoda', code: 'VGD', city: 'Gampaha', state: 'Western Province', address: 'Veyangoda, Gampaha, Sri Lanka' },
  { id: '21', name: 'Mirigama', code: 'MIR', city: 'Gampaha', state: 'Western Province', address: 'Mirigama, Gampaha, Sri Lanka' },
  { id: '22', name: 'Ambepussa', code: 'APS', city: 'Kegalle', state: 'Sabaragamuwa Province', address: 'Ambepussa, Kegalle, Sri Lanka' },
  { id: '23', name: 'Alawwa', code: 'ALW', city: 'Kurunegala', state: 'North Western Province', address: 'Alawwa, Kurunegala, Sri Lanka' },
  { id: '24', name: 'Polgahawela', code: 'POL', city: 'Kurunegala', state: 'North Western Province', address: 'Polgahawela, Kurunegala, Sri Lanka' },
  { id: '25', name: 'Rambukkana', code: 'RBK', city: 'Kegalle', state: 'Sabaragamuwa Province', address: 'Rambukkana, Kegalle, Sri Lanka' },
  { id: '26', name: 'Kadigamuwa', code: 'KGW', city: 'Kegalle', state: 'Sabaragamuwa Province', address: 'Kadigamuwa, Kegalle, Sri Lanka' },
  { id: '27', name: 'Ihalakotte', code: 'IKT', city: 'Kegalle', state: 'Sabaragamuwa Province', address: 'Ihalakotte, Kegalle, Sri Lanka' },
  { id: '28', name: 'Balana', code: 'BLN', city: 'Kandy', state: 'Central Province', address: 'Balana, Kandy, Sri Lanka' },
  { id: '29', name: 'Kadugannawa', code: 'KDN', city: 'Kandy', state: 'Central Province', address: 'Kadugannawa, Kandy, Sri Lanka' },
  { id: '30', name: 'Pilimatalawa', code: 'PLM', city: 'Kandy', state: 'Central Province', address: 'Pilimatalawa, Kandy, Sri Lanka' },
  { id: '31', name: 'Peradeniya', code: 'PDN', city: 'Kandy', state: 'Central Province', address: 'Peradeniya, Kandy, Sri Lanka' },
  { id: '32', name: 'Kandy', code: 'KDY', city: 'Kandy', state: 'Central Province', address: 'Kandy, Sri Lanka' },
  { id: '33', name: 'Hatton', code: 'HAT', city: 'Nuwara Eliya', state: 'Central Province', address: 'Hatton, Nuwara Eliya, Sri Lanka' },
  { id: '34', name: 'Kotagala', code: 'KTG', city: 'Nuwara Eliya', state: 'Central Province', address: 'Kotagala, Nuwara Eliya, Sri Lanka' },
  { id: '35', name: 'Thalawakele', code: 'TLW', city: 'Nuwara Eliya', state: 'Central Province', address: 'Thalawakele, Nuwara Eliya, Sri Lanka' },
  { id: '36', name: 'Watagoda', code: 'WTG', city: 'Nuwara Eliya', state: 'Central Province', address: 'Watagoda, Nuwara Eliya, Sri Lanka' },
  { id: '37', name: 'Great Western', code: 'GWN', city: 'Nuwara Eliya', state: 'Central Province', address: 'Great Western, Nuwara Eliya, Sri Lanka' },
  { id: '38', name: 'Radella', code: 'RDL', city: 'Nuwara Eliya', state: 'Central Province', address: 'Radella, Nuwara Eliya, Sri Lanka' },
  { id: '39', name: 'Nanu Oya', code: 'NNO', city: 'Nuwara Eliya', state: 'Central Province', address: 'Nanu Oya, Nuwara Eliya, Sri Lanka' },
  { id: '40', name: 'Haputale', code: 'HPT', city: 'Badulla', state: 'Uva Province', address: 'Haputale, Badulla, Sri Lanka' },
  { id: '41', name: 'Diyatalawa', code: 'DLA', city: 'Badulla', state: 'Uva Province', address: 'Diyatalawa, Badulla, Sri Lanka' },
  { id: '42', name: 'Bandarawela', code: 'BDA', city: 'Badulla', state: 'Uva Province', address: 'Bandarawela, Badulla, Sri Lanka' },
  { id: '43', name: 'Kinigama', code: 'KGM', city: 'Badulla', state: 'Uva Province', address: 'Kinigama, Badulla, Sri Lanka' },
  { id: '44', name: 'Heeloya', code: 'HLY', city: 'Badulla', state: 'Uva Province', address: 'Heeloya, Badulla, Sri Lanka' },
  { id: '45', name: 'Kahagollewa', code: 'KGL', city: 'Badulla', state: 'Uva Province', address: 'Kahagollewa, Badulla, Sri Lanka' },
  { id: '46', name: 'Ella', code: 'ELL', city: 'Badulla', state: 'Uva Province', address: 'Ella, Badulla, Sri Lanka' },
  { id: '47', name: 'Demodara', code: 'DMD', city: 'Badulla', state: 'Uva Province', address: 'Demodara, Badulla, Sri Lanka' },
  { id: '48', name: 'Uduwara', code: 'UDW', city: 'Badulla', state: 'Uva Province', address: 'Uduwara, Badulla, Sri Lanka' },
  { id: '49', name: 'Hali Ela', code: 'HLE', city: 'Badulla', state: 'Uva Province', address: 'Hali Ela, Badulla, Sri Lanka' },
  { id: '50', name: 'Badulla', code: 'BAD', city: 'Badulla', state: 'Uva Province', address: 'Badulla, Sri Lanka' },
  
  // Other major stations
  { id: '51', name: 'Galle', code: 'GAL', city: 'Galle', state: 'Southern Province', address: 'Galle, Sri Lanka' },
  { id: '52', name: 'Matara', code: 'MAT', city: 'Matara', state: 'Southern Province', address: 'Matara, Sri Lanka' },
  { id: '53', name: 'Jaffna', code: 'JAF', city: 'Jaffna', state: 'Northern Province', address: 'Jaffna, Sri Lanka' },
  { id: '54', name: 'Anuradhapura', code: 'ANU', city: 'Anuradhapura', state: 'North Central Province', address: 'Anuradhapura, Sri Lanka' },
  { id: '55', name: 'Trincomalee', code: 'TCO', city: 'Trincomalee', state: 'Eastern Province', address: 'Trincomalee, Sri Lanka' },
  { id: '56', name: 'Batticaloa', code: 'BAT', city: 'Batticaloa', state: 'Eastern Province', address: 'Batticaloa, Sri Lanka' },
  { id: '57', name: 'Puttalam', code: 'PTM', city: 'Puttalam', state: 'North Western Province', address: 'Puttalam, Sri Lanka' },
  { id: '58', name: 'Kurunegala', code: 'KUR', city: 'Kurunegala', state: 'North Western Province', address: 'Kurunegala, Sri Lanka' },
  { id: '59', name: 'Negombo', code: 'NGB', city: 'Negombo', state: 'Western Province', address: 'Negombo, Sri Lanka' },
  { id: '60', name: 'Kankesanthurai', code: 'KKS', city: 'Jaffna', state: 'Northern Province', address: 'Kankesanthurai, Jaffna, Sri Lanka' }
];

// Sri Lankan trains
export const sriLankaTrains = [
  {
    id: '1',
    name: 'Udarata Menike',
    number: 'UCR-1059',
    source: 'Colombo Fort',
    destination: 'Badulla',
    departureTime: '05:55',
    arrivalTime: '14:30',
    duration: '8h 35m',
    distance: 292.39, // distance in km
    fare: {
      firstClass: 2200,
      secondClass: 1100,
      thirdClass: 550
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi', 'Observation Deck'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '2',
    name: 'Podi Menike',
    number: 'PM-1072',
    source: 'Colombo Fort',
    destination: 'Badulla',
    departureTime: '09:45',
    arrivalTime: '18:05',
    duration: '8h 20m',
    distance: 292.39, // distance in km
    fare: {
      firstClass: 2200,
      secondClass: 1100,
      thirdClass: 550
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '3',
    name: 'Denuwara Menike',
    number: 'DM-1086',
    source: 'Colombo Fort',
    destination: 'Badulla',
    departureTime: '07:00',
    arrivalTime: '15:55',
    duration: '8h 55m',
    distance: 292.39, // distance in km
    fare: {
      firstClass: 2200,
      secondClass: 1100,
      thirdClass: 550
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '4',
    name: 'Yal Devi',
    number: 'YD-4138',
    source: 'Colombo Fort',
    destination: 'Jaffna',
    departureTime: '05:45',
    arrivalTime: '13:15',
    duration: '7h 30m',
    distance: 398, // distance in km
    fare: {
      firstClass: 2850,
      secondClass: 1450,
      thirdClass: 750
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '5',
    name: 'Uttara Devi',
    number: 'UD-4146',
    source: 'Colombo Fort',
    destination: 'Kankesanthurai',
    departureTime: '17:30',
    arrivalTime: '05:10',
    duration: '11h 40m',
    distance: 402, // distance in km
    fare: {
      firstClass: 2900,
      secondClass: 1500,
      thirdClass: 780
    },
    amenities: ['Sleeper Berths', 'Food Service'],
    status: 'On Time',
    type: 'Night Mail',
    frequency: 'Daily'
  },
  {
    id: '6',
    name: 'Udaya Devi',
    number: 'UDV-4129',
    source: 'Colombo Fort',
    destination: 'Batticaloa',
    departureTime: '06:15',
    arrivalTime: '15:00',
    duration: '8h 45m',
    distance: 330, // distance in km
    fare: {
      firstClass: 2400,
      secondClass: 1200,
      thirdClass: 650
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '7',
    name: 'Night Mail',
    number: 'NM-4018',
    source: 'Colombo Fort',
    destination: 'Batticaloa',
    departureTime: '20:00',
    arrivalTime: '06:30',
    duration: '10h 30m',
    distance: 330, // distance in km
    fare: {
      firstClass: 2450,
      secondClass: 1250,
      thirdClass: 680
    },
    amenities: ['Sleeper Berths', 'Food Service'],
    status: 'On Time',
    type: 'Night Mail',
    frequency: 'Daily'
  },
  {
    id: '8',
    name: 'Ruhunu Kumari',
    number: 'RK-6009',
    source: 'Colombo Fort',
    destination: 'Matara',
    departureTime: '06:55',
    arrivalTime: '10:20',
    duration: '3h 25m',
    distance: 160, // distance in km
    fare: {
      firstClass: 1350,
      secondClass: 680,
      thirdClass: 340
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '9',
    name: 'Galu Kumari',
    number: 'GK-6011',
    source: 'Colombo Fort',
    destination: 'Galle',
    departureTime: '09:30',
    arrivalTime: '12:10',
    duration: '2h 40m',
    distance: 116, // distance in km
    fare: {
      firstClass: 1050,
      secondClass: 550,
      thirdClass: 280
    },
    amenities: ['Air Conditioning', 'Food Service'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '10',
    name: 'Tikiri Menike',
    number: 'TMK-1091',
    source: 'Colombo Fort',
    destination: 'Hatton',
    departureTime: '08:00',
    arrivalTime: '12:15',
    duration: '4h 15m',
    distance: 175, // distance in km
    fare: {
      firstClass: 1500,
      secondClass: 780,
      thirdClass: 390
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '11',
    name: 'Rajarata Rejini',
    number: 'RR-5004',
    source: 'Colombo Fort',
    destination: 'Anuradhapura',
    departureTime: '07:00',
    arrivalTime: '10:15',
    duration: '3h 15m',
    distance: 220, // distance in km
    fare: {
      firstClass: 1850,
      secondClass: 950,
      thirdClass: 470
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '12',
    name: 'Rajarata Express',
    number: 'RE-5062',
    source: 'Colombo Fort',
    destination: 'Polonnaruwa',
    departureTime: '15:35',
    arrivalTime: '19:50',
    duration: '4h 15m',
    distance: 220, // distance in km
    fare: {
      firstClass: 1850,
      secondClass: 950,
      thirdClass: 470
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi', 'Observation Deck'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '13',
    name: 'Ella Odyssey',
    number: 'ELO-4055',
    source: 'Kandy',
    destination: 'Ella',
    departureTime: '08:30',
    arrivalTime: '15:15',
    duration: '6h 45m',
    distance: 127, // distance in km
    fare: {
      firstClass: 1200,
      secondClass: 600,
      thirdClass: 320
    },
    amenities: ['Air Conditioning', 'Food Service', 'Observation Deck', 'Wi-Fi'],
    status: 'On Time',
    type: 'Scenic Express',
    frequency: 'Daily'
  },
  {
    id: '14',
    name: 'Coast Line',
    number: 'CL-4075',
    source: 'Colombo Fort',
    destination: 'Matara',
    departureTime: '17:45',
    arrivalTime: '21:25',
    duration: '3h 40m',
    distance: 160, // distance in km
    fare: {
      firstClass: 1350,
      secondClass: 680,
      thirdClass: 340
    },
    amenities: ['Air Conditioning', 'Food Service'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '15',
    name: 'Trinco Express',
    number: 'TE-4102',
    source: 'Colombo Fort',
    destination: 'Trincomalee',
    departureTime: '06:05',
    arrivalTime: '14:45',
    duration: '8h 40m',
    distance: 290, // distance in km
    fare: {
      firstClass: 2150,
      secondClass: 1100,
      thirdClass: 580
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  },
  {
    id: '16',
    name: 'Main Line Night Mail',
    number: 'MLNM-4003',
    source: 'Colombo Fort',
    destination: 'Badulla',
    departureTime: '20:00',
    arrivalTime: '06:15',
    duration: '10h 15m',
    distance: 292.39, // distance in km
    fare: {
      firstClass: 2200,
      secondClass: 1100,
      thirdClass: 550
    },
    amenities: ['Sleeper Berths', 'Food Service'],
    status: 'On Time',
    type: 'Night Mail',
    frequency: 'Daily'
  },
  {
    id: '17',
    name: 'Kandy Intercity',
    number: 'KDY-IC-1070',
    source: 'Colombo Fort',
    destination: 'Kandy',
    departureTime: '07:00',
    arrivalTime: '09:30',
    duration: '2h 30m',
    distance: 120.74, // distance in km
    fare: {
      firstClass: 1100,
      secondClass: 580,
      thirdClass: 290
    },
    amenities: ['Air Conditioning', 'Food Service', 'Wi-Fi', 'Reserved Seating'],
    status: 'On Time',
    type: 'Intercity Express',
    frequency: 'Daily'
  },
  {
    id: '18',
    name: 'Matale Express',
    number: 'MTE-1090',
    source: 'Colombo Fort',
    destination: 'Matale',
    departureTime: '05:55',
    arrivalTime: '10:20',
    duration: '4h 25m',
    distance: 148.61, // distance in km
    fare: {
      firstClass: 1300,
      secondClass: 680,
      thirdClass: 350
    },
    amenities: ['Air Conditioning', 'Food Service'],
    status: 'On Time',
    type: 'Express',
    frequency: 'Daily'
  }
];

// Train schedule data
export const sriLankaTrainSchedules = sriLankaTrains.map(train => {
  // Create daily schedule for the next 30 days
  const schedules = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Create schedule entry
    schedules.push({
      date: formattedDate,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      status: Math.random() > 0.9 ? 'Delayed' : 'On Time',
      platform: Math.floor(Math.random() * 5) + 1, // Random platform between 1-5
      availableSeats: {
        firstClass: Math.floor(Math.random() * 50) + 10,
        secondClass: Math.floor(Math.random() * 100) + 20,
        thirdClass: Math.floor(Math.random() * 200) + 50
      }
    });
  }
  
  return {
    trainId: train.id,
    schedules
  };
});
