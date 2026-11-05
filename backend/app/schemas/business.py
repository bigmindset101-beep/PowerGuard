from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class BusinessProfile(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    type: str = Field(default="", max_length=60)

    location: str = Field(default="", max_length=120)
    power_sources: List[Literal["grid", "generator", "battery" ]] = Field(min_length=1)

    operating_hours_per_day: float = Field(gt=0, le=24)
    operating_days_per_month: float = Field(gt=0, le=31)
    grid_tariff_ngn_per_kwh: Optional[float] = Field(default=None, ge=0)
    monthly_revenue_ngn: Optional[float] = Field(default=None, ge=0)
    total_load_w: Optional[float] = Field(default=None, gt=0)
    generator_litres_per_hour: Optional[float] = Field(default=None, gt=0)