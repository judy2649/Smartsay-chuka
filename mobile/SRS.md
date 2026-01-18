# Chuka Hostels Flutter App - Software Requirements Specification (SRS)

## 1. Introduction

**Project Name:** Chuka Hostels  
**Version:** 1.0.0  
**Date:** January 2026  
**Platform:** iOS & Android (Flutter)  
**Target Users:** University students in Chuka, Kenya

### 1.1 Purpose
The Chuka Hostels application is a mobile platform designed to help students find, compare, and subscribe to hostel accommodation information near Chuka University. The app provides verified hostel listings, detailed information, amenities, and contact details through a subscription-based model.

### 1.2 Scope
- User authentication via Firebase
- Hostel discovery and detailed listings
- Subscription-based access (KES 253/month or KES 650/quarter)
- M-Pesa payment integration
- PDF hostel profile downloads
- Admin hostel management dashboard
- User profile and subscription management

---

## 2. User Characteristics

| User Type | Description | Responsibilities |
|-----------|-------------|-----------------|
| **Student User** | University students seeking hostel accommodation | Browse hostels, subscribe, download profiles |
| **Admin** | Hostel owners/managers | Add/edit/delete hostel listings |
| **System Admin** | App administrator | Manage users, subscriptions, verify hostels |

---

## 3. Functional Requirements

### 3.1 Authentication
- **FR1.1:** Users can register with email, password, name, phone number
- **FR1.2:** Users can login with email/password
- **FR1.3:** Users can reset password via email
- **FR1.4:** Session persistence across app restarts
- **FR1.5:** Secure logout with token invalidation

### 3.2 Hostel Listings
- **FR2.1:** Display all verified hostels in a scrollable list
- **FR2.2:** Show hostel image, name, location, distance from campus
- **FR2.3:** Display amenities as chips/tags
- **FR2.4:** Show caretaker name and phone number
- **FR2.5:** Filter hostels by location/amenities (future feature)
- **FR2.6:** Search hostels by name/location

### 3.3 Hostel Details
- **FR3.1:** Display full hostel information on dedicated screen
- **FR3.2:** Show all room types with images and descriptions
- **FR3.3:** Display availability status
- **FR3.4:** Show monthly rent prices
- **FR3.5:** Enable direct calls to hostel/caretaker
- **FR3.6:** Option to download hostel profile as PDF

### 3.4 Subscription System
- **FR4.1:** Display subscription plans (monthly/quarterly)
- **FR4.2:** Show pricing and features for each plan
- **FR4.3:** Display subscription status on user profile
- **FR4.4:** Implement subscription expiry timer
- **FR4.5:** Send reminders before expiry
- **FR4.6:** Auto-renew option (optional)

### 3.5 Payments (M-Pesa)
- **FR5.1:** Initiate M-Pesa STK push for payment
- **FR5.2:** Handle M-Pesa callback for payment confirmation
- **FR5.3:** Store payment receipt/transaction ID
- **FR5.4:** Display payment status to user
- **FR5.5:** Support both monthly and quarterly payments

### 3.6 Admin Features
- **FR6.1:** Admin can add new hostels
- **FR6.2:** Admin can edit hostel information
- **FR6.3:** Admin can delete hostels
- **FR6.4:** Admin can approve user-submitted hostels
- **FR6.5:** Admin can view user subscription list
- **FR6.6:** Admin can generate revenue reports

### 3.7 Downloads
- **FR7.1:** Generate PDF from hostel data
- **FR7.2:** Store PDF in Firebase Storage
- **FR7.3:** Download PDF to device storage
- **FR7.4:** Share PDF via email/messaging

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR1.1:** App should load in < 3 seconds
- **NFR1.2:** Image loading should be optimized with caching
- **NFR1.3:** Database queries should respond in < 500ms

### 4.2 Security
- **NFR2.1:** All passwords hashed with bcrypt
- **NFR2.2:** HTTPS for all API calls
- **NFR2.3:** Firestore security rules enforced
- **NFR2.4:** JWT tokens with expiry
- **NFR2.5:** Subscription validation before access

### 4.3 Availability
- **NFR3.1:** 99.9% uptime target
- **NFR3.2:** Offline mode support (cached data)
- **NFR3.3:** Graceful error handling

### 4.4 Usability
- **NFR4.1:** Intuitive UI following Material Design 3
- **NFR4.2:** Accessibility features (WCAG 2.1 Level AA)
- **NFR4.3:** Support for English language only (initial)

### 4.5 Maintainability
- **NFR5.1:** Code documented with comments
- **NFR5.2:** Clean architecture with separation of concerns
- **NFR5.3:** Automated testing (>80% coverage)

---

## 5. Data Models

### 5.1 User Collection
```
{
  uid: String (Firebase UID),
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  isSubscribed: Boolean,
  subscriptionExpiryDate: DateTime,
  isAdmin: Boolean,
  createdAt: DateTime,
  lastLogin: DateTime
}
```

### 5.2 Hostel Collection
```
{
  id: String (Firestore Doc ID),
  name: String,
  description: String,
  location: String,
  distance: String,
  phoneNumber: String,
  caretaker: String,
  caretakerPhone: String,
  amenities: List<String>,
  image: String (URL),
  roomTypes: List<RoomType>,
  monthlyRent: Double,
  availableRooms: Integer,
  verified: Boolean,
  createdAt: DateTime
}
```

### 5.3 Subscription Collection
```
{
  id: String,
  userId: String,
  plan: String (monthly/quarterly),
  amount: Double,
  startDate: DateTime,
  endDate: DateTime,
  status: String (active/expired/cancelled),
  mpesaReceiptNumber: String,
  createdAt: DateTime
}
```

### 5.4 Payment Collection
```
{
  id: String,
  userId: String,
  amount: Double,
  phoneNumber: String,
  transactionId: String,
  status: String,
  mpesaReceiptNumber: String,
  createdAt: DateTime
}
```

---

## 6. UI/UX Design

### 6.1 Color Palette
- **Primary:** Deep Blue (#1A237E)
- **Secondary:** Teal (#009688)
- **Accent:** Orange (#FF9800)
- **Background:** Light Grey (#F5F5F5)

### 6.2 Typography
- **Headlines:** Poppins Bold (20-32px)
- **Body:** Inter Regular (14-16px)
- **Buttons:** Poppins Semi-Bold (16px)

### 6.3 Screens
1. **Splash** - Logo animation + intro
2. **Login** - Email/password form
3. **Register** - User signup form
4. **Home** - Hostel listings grid
5. **Hostel Details** - Full hostel information
6. **Subscription** - Plan selection + payment
7. **Profile** - User info + subscription status
8. **Admin Dashboard** - Hostel management

---

## 7. Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Flutter 3.0+ |
| **Backend** | Firebase (Auth, Firestore, Storage, Functions) |
| **Payment** | M-Pesa Daraja API |
| **Database** | Cloud Firestore |
| **Authentication** | Firebase Auth |
| **Storage** | Firebase Storage |
| **State Management** | Provider |
| **PDF Generation** | pdf package |

---

## 8. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin;
    }
    
    // All users can read verified hostels
    match /hostels/{hostelId} {
      allow read: if resource.data.verified == true && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isSubscribed == true;
      allow create, update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users can read their own subscriptions
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 9. Testing Strategy

- Unit tests for models and services
- Widget tests for UI components
- Integration tests for critical flows
- Manual UAT before release

---

## 10. Deployment & Maintenance

- CI/CD via GitHub Actions
- Deploy to Google Play Store & Apple App Store
- Bug fix releases quarterly
- Feature releases bi-annually

---

## 11. Future Enhancements

- Hostel reviews and ratings
- Advanced hostel search filters
- In-app messaging between users and hostel owners
- Hostel booking integration
- Multiple payment methods (card, Apple Pay)
- Push notifications
- Multi-language support

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Next Review:** March 2026
