class Hostel {
  final String id;
  final String name;
  final String description;
  final String location;
  final String distance;
  final String phoneNumber;
  final String caretaker;
  final String caretakerPhone;
  final List<String> amenities;
  final String image;
  final List<RoomType> roomTypes;
  final bool verified;
  final double? monthlyRent;
  final int? availableRooms;

  Hostel({
    required this.id,
    required this.name,
    required this.description,
    required this.location,
    required this.distance,
    required this.phoneNumber,
    required this.caretaker,
    required this.caretakerPhone,
    required this.amenities,
    required this.image,
    required this.roomTypes,
    this.verified = true,
    this.monthlyRent,
    this.availableRooms,
  });

  factory Hostel.fromMap(Map<String, dynamic> data, String id) {
    return Hostel(
      id: id,
      name: data['name'] ?? 'Unnamed Hostel',
      description: data['description'] ?? '',
      location: data['location'] ?? '',
      distance: data['distance'] ?? '',
      phoneNumber: data['phoneNumber'] ?? '',
      caretaker: data['caretaker'] ?? '',
      caretakerPhone: data['caretakerPhone'] ?? '',
      amenities: List<String>.from(data['amenities'] ?? []),
      image: data['image'] ?? '',
      roomTypes: (data['roomTypes'] as List?)
              ?.map((rt) => RoomType.fromMap(rt))
              .toList() ??
          [],
      verified: data['verified'] ?? true,
      monthlyRent: (data['monthlyRent'] ?? 0).toDouble(),
      availableRooms: data['availableRooms'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'location': location,
      'distance': distance,
      'phoneNumber': phoneNumber,
      'caretaker': caretaker,
      'caretakerPhone': caretakerPhone,
      'amenities': amenities,
      'image': image,
      'roomTypes': roomTypes.map((rt) => rt.toMap()).toList(),
      'verified': verified,
      'monthlyRent': monthlyRent,
      'availableRooms': availableRooms,
    };
  }
}

class RoomType {
  final String type;
  final String image;
  final double? price;

  RoomType({
    required this.type,
    required this.image,
    this.price,
  });

  factory RoomType.fromMap(Map<String, dynamic> data) {
    return RoomType(
      type: data['type'] ?? 'Unknown',
      image: data['image'] ?? '',
      price: (data['price'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'type': type,
      'image': image,
      'price': price,
    };
  }
}
