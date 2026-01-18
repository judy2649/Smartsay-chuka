class Subscription {
  final String id;
  final String userId;
  final String plan; // 'monthly' or 'quarterly'
  final double amount;
  final DateTime startDate;
  final DateTime endDate;
  final String status; // 'active', 'expired', 'cancelled'
  final String? mpesaReceiptNumber;
  final DateTime createdAt;

  Subscription({
    required this.id,
    required this.userId,
    required this.plan,
    required this.amount,
    required this.startDate,
    required this.endDate,
    required this.status,
    this.mpesaReceiptNumber,
    required this.createdAt,
  });

  bool get isActive {
    return status == 'active' && DateTime.now().isBefore(endDate);
  }

  factory Subscription.fromMap(Map<String, dynamic> data, String id) {
    return Subscription(
      id: id,
      userId: data['userId'] ?? '',
      plan: data['plan'] ?? 'monthly',
      amount: (data['amount'] ?? 0).toDouble(),
      startDate: DateTime.parse(data['startDate'] ?? DateTime.now().toIso8601String()),
      endDate: DateTime.parse(data['endDate'] ?? DateTime.now().toIso8601String()),
      status: data['status'] ?? 'active',
      mpesaReceiptNumber: data['mpesaReceiptNumber'],
      createdAt: DateTime.parse(data['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'plan': plan,
      'amount': amount,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'status': status,
      'mpesaReceiptNumber': mpesaReceiptNumber,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
