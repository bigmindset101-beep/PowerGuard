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

## Security Rules

- Authentication is required.
- Users can access only their own records.
- User ownership is determined by Firebase Authentication UID.
- User-owned subcollections inherit the same ownership restriction.

## Backend Security

The Firebase Admin SDK bypasses Firestore security rules.

The FastAPI backend must verify Firebase ID tokens and enforce
user ownership independently.