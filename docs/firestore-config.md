## Initial Data Model

All user-owned records are stored under:

users/{uid}

### Subcollections

- businesses
- expenses
- generatorSessions
- batteryEstimates

### Ownership

The Firebase Authentication UID identifies the owner.

Each user's records are stored beneath their own UID.