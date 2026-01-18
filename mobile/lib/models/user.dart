class User {
  final String uid;
  final String email;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final bool isSubscribed;
  final DateTime? subscriptionExpiryDate;
  final bool isAdmin;
  final DateTime createdAt;

  User({
    required this.uid,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    this.isSubscribed = false,
    this.subscriptionExpiryDate,
    this.isAdmin = false,
    required this.createdAt,
  });

  factory User.fromMap(Map<String, dynamic> data, String uid) {
    return User(
      uid: uid,
      email: data['email'] ?? '',
      firstName: data['firstName'] ?? '',
      lastName: data['lastName'] ?? '',
      phoneNumber: data['phoneNumber'] ?? '',
      isSubscribed: data['isSubscribed'] ?? false,
      subscriptionExpiryDate: data['subscriptionExpiryDate'] != null
          ? DateTime.parse(data['subscriptionExpiryDate'])
          : null,
      isAdmin: data['isAdmin'] ?? false,
      createdAt: data['createdAt'] != null
          ? DateTime.parse(data['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber': phoneNumber,
      'isSubscribed': isSubscribed,
      'subscriptionExpiryDate': subscriptionExpiryDate?.toIso8601String(),
      'isAdmin': isAdmin,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
