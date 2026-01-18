# Chuka Hostels - Flutter Mobile App

A production-ready Flutter mobile application for Chuka University students to discover and subscribe to verified hostel accommodation with M-Pesa payment integration.

## Quick Start

### Prerequisites
- Flutter SDK 3.0+
- Dart 3.0+
- Firebase account
- M-Pesa Daraja API credentials

### Setup

```bash
cd mobile
flutter pub get
flutter run
```

## Project Structure

```
mobile/
├── lib/
│   ├── main.dart
│   ├── firebase_options.dart
│   ├── models/
│   │   ├── user.dart
│   │   ├── hostel.dart
│   │   └── subscription.dart
│   ├── screens/
│   │   ├── splash_screen.dart
│   │   ├── login_screen.dart
│   │   ├── home_screen.dart
│   │   └── subscription_screen.dart
│   ├── services/
│   │   ├── auth_service.dart
│   │   ├── hostel_service.dart
│   │   └── mpesa_service.dart
│   └── utils/
│       └── theme.dart
├── pubspec.yaml
├── SRS.md
└── README.md
```

## Key Features

### Authentication
- Firebase Auth with email/password
- Secure session handling
- Auto-login support

### Hostel Discovery
- Browse verified hostel listings
- Detailed hostel information (amenities, room types, caretaker contact)
- High-quality images with caching
- Location and distance from campus

### Subscription System
- Monthly (KES 253) and Quarterly (KES 650) plans
- Automatic subscription validation
- Real-time expiry tracking

### Payments
- M-Pesa STK push integration
- Real-time payment status tracking
- Transaction history

### Admin Features
- Add/edit/delete hostels
- Manage listings
- User subscription management

### HomeScreen
- Display all hostels with details
- Location, phone, description
- Subscription check
- Prompts non-subscribed users to pay
- List view for easy scrolling

### PaymentScreen
- Phone number input for M-Pesa
- Amount display: KES 253
- Duration: 30 days
- Step-by-step instructions
- Payment initiation

## Navigation

**Auth Stack** (Not logged in):
- Login
- Register

**App Stack** (Logged in):
- Home
- Payment

## Services

### API Service (`src/services/api.js`)

All methods same as web app:
- `authService.register(data)`
- `authService.login(data)`
- `authService.logout()`
- `hostelService.getAllHostels()`
- `hostelService.getHostelById(id)`
- `hostelService.addReview(id, data)`
- `paymentService.initiateMpesaPayment(data)`
- `paymentService.getPaymentHistory()`
- `userService.getProfile()`

## Features

✅ **Cross-Platform**
- iOS and Android support
- Native feel and performance

✅ **User Authentication**
- Secure token storage with AsyncStorage
- Session persistence
- Auto-login on app start

✅ **Hostel Management**
- Browse all hostels
- View details and amenities
- Leave reviews and ratings

✅ **M-Pesa Integration**
- Simple payment flow
- STK push on phone
- Automatic subscription update

✅ **Responsive Design**
- Adapts to all screen sizes
- Touch-optimized UI
- Smooth animations

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Android Studio (for Android)
- Xcode (for iOS)
- React Native CLI

### Android Setup
```bash
npm install
npm run android
```

Requires:
- Android SDK installed
- Emulator or physical device
- `android/local.properties` with SDK path

### iOS Setup
```bash
npm install
cd ios
pod install
cd ..
npm run ios
```

Requires:
- Xcode installed
- CocoaPods
- iOS deployment target 11.0+

## AsyncStorage

Used for persistent storage:
- **token** - JWT authentication token
- **user** - User object with subscription status

## Styling

Uses React Native StyleSheet:
- Consistent spacing and typography
- Color scheme: Purple (#667eea) and gray
- Responsive layouts
- Touch-friendly buttons and inputs

## Dependencies

- **react** - UI framework
- **react-native** - Mobile framework
- **react-navigation** - Navigation
- **react-native-screens** - Native stack navigator
- **react-native-safe-area-context** - Safe area handling
- **axios** - HTTP client
- **@react-native-async-storage/async-storage** - Local storage

## Development

### Debug Mode
```bash
npm start
```

Shake device to access developer menu or press `d` in terminal.

### Hot Reload
- Changes automatically reload
- Preserve app state if possible

### LogBox
- Warnings and errors displayed in app
- Tap to view details
- Disable specific warnings

## Building for Release

### Android Release
```bash
cd android
./gradlew assembleRelease
```

### iOS Release
```bash
# Via Xcode or fastlane
xcode-build -workspace ios/SmartstayChukaApp.xcworkspace \
  -scheme SmartstayChukaApp -configuration Release
```

## API Configuration

Backend URL: `http://localhost:5000/api`

For physical device testing, update API URL to your machine's IP:
```javascript
const API_BASE_URL = 'http://YOUR_IP:5000/api';
```

## Testing

### Test Login
```
Email: test@example.com
Password: password123
```

### Test Payment
```
Phone: 254712345678
Amount: 253
```

## Permissions Required

### Android
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### iOS
- Internet access (automatic)
- No special permissions needed

## Troubleshooting

**App won't start?**
- Run `npm install` again
- Clear node_modules and reinstall
- Check Node version compatibility

**Android build fails?**
- Run `./gradlew clean`
- Check Android SDK version
- Verify JAVA_HOME is set

**iOS build fails?**
- Run `pod install` in ios folder
- Update CocoaPods: `pod repo update`
- Check Xcode version is latest

**API connection fails?**
- Ensure backend is running
- Check firewall settings
- Verify IP address (not localhost for physical device)
- Check internet connectivity

**Payment not working?**
- Verify M-Pesa credentials on backend
- Check phone number format: 254XXXXXXXXXX
- Review backend logs for errors
- Test with sandbox credentials first

## Performance Tips

- Lazy load hostel images
- Paginate hostel listings
- Use React.memo for list items
- Minimize re-renders
- Cache API responses

## Security

- Tokens stored securely with AsyncStorage
- No sensitive data in AsyncStorage
- API requests use HTTPS in production
- Input validation on all screens
- Error messages don't leak system info

## Notes

- App requires internet connection
- Offline support can be added with Redux
- Images should be optimized for mobile
- Battery usage is minimal
- Data usage is efficient

---

**Version:** 1.0.0  
**Last Updated:** January 2026
