import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/hostel.dart';

class HostelService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  List<Hostel> _hostels = [];
  Hostel? _selectedHostel;
  bool _isLoading = false;
  String? _errorMessage;

  List<Hostel> get hostels => _hostels;
  Hostel? get selectedHostel => _selectedHostel;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchHostels() async {
    try {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();

      QuerySnapshot snapshot = await _firestore
          .collection('hostels')
          .where('verified', isEqualTo: true)
          .get();

      _hostels = snapshot.docs
          .map((doc) => Hostel.fromMap(
              doc.data() as Map<String, dynamic>, doc.id))
          .toList();

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Failed to fetch hostels: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchHostelById(String hostelId) async {
    try {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();

      DocumentSnapshot doc =
          await _firestore.collection('hostels').doc(hostelId).get();

      if (doc.exists) {
        _selectedHostel = Hostel.fromMap(
            doc.data() as Map<String, dynamic>, doc.id);
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Failed to fetch hostel: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addHostel(Hostel hostel) async {
    try {
      _isLoading = true;
      notifyListeners();

      await _firestore
          .collection('hostels')
          .add(hostel.toMap());

      _isLoading = false;
      await fetchHostels();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to add hostel: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateHostel(String hostelId, Hostel hostel) async {
    try {
      _isLoading = true;
      notifyListeners();

      await _firestore
          .collection('hostels')
          .doc(hostelId)
          .update(hostel.toMap());

      _isLoading = false;
      await fetchHostels();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to update hostel: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteHostel(String hostelId) async {
    try {
      _isLoading = true;
      notifyListeners();

      await _firestore
          .collection('hostels')
          .doc(hostelId)
          .delete();

      _isLoading = false;
      await fetchHostels();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to delete hostel: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
