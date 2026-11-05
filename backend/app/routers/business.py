from fastapi import APIRouter, HTTPException

from app.schemas.business import BusinessProfile

router = APIRouter(prefix="/api/v1", tags=["business"])

# TEMPORARY: in-memory storage and a fixed user.
# Replaced by Firestore and the verified Firebase uid in the next steps.
_profiles: dict[str, BusinessProfile] = {}
TEMP_UID = "dev-user"


@router.put("/business", response_model=BusinessProfile)
def save_business(profile: BusinessProfile):
    _profiles[TEMP_UID] = profile
    return profile


@router.get("/business", response_model=BusinessProfile)
def read_business():
    profile = _profiles.get(TEMP_UID)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not set")
    return profile