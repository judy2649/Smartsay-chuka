// Subscription authorization middleware
const subscriptionGuard = (req, res, next) => {
  const user = req.user;

  // Admins bypass subscription check
  if (user && user.isAdmin) {
    return next();
  }

  // No user - cannot access
  if (!user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  // User not subscribed
  if (!user.isSubscribed) {
    return res.status(402).json({ 
      message: 'Subscription required to access hostel listings',
      code: 'SUBSCRIPTION_REQUIRED'
    });
  }

  next();
};

module.exports = subscriptionGuard;
