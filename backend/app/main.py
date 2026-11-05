from fastapi import FastAPI
from pydantic import BaseModel, Field

from app.calculations.generator import calculate_generator_cost
from app.calculations.battery import calculate_battery_capacity
from app.calculations.battery_bank import calculate_battery_bank


app = FastAPI(title="PowerGuard API")


@app.get("/health")
def health():
    return {"status": "ok"}


# Generator calculation request
class GeneratorRequest(BaseModel):
    fuel_consumption: float = Field(gt=0)
    fuel_price: float = Field(ge=0)
    operating_hours: float = Field(ge=0)


# Battery calculation request
class BatteryRequest(BaseModel):
    load_watts: float = Field(gt=0)
    backup_hours: float = Field(gt=0)
    system_voltage: float = Field(gt=0)
    depth_of_discharge: float = Field(gt=0, le=1)
    inverter_efficiency: float = Field(gt=0, le=1)


# Battery bank calculation request
class BatteryBankRequest(BaseModel):
    required_capacity_ah: float = Field(gt=0)
    system_voltage: float = Field(gt=0)
    battery_voltage: float = Field(gt=0)
    battery_capacity_ah: float = Field(gt=0)


@app.post("/calculations/generator")
def generator_calculation(data: GeneratorRequest):
    return calculate_generator_cost(
        data.fuel_consumption,
        data.fuel_price,
        data.operating_hours
    )


@app.post("/calculations/battery")
def battery_calculation(data: BatteryRequest):
    return calculate_battery_capacity(
        data.load_watts,
        data.backup_hours,
        data.system_voltage,
        data.depth_of_discharge,
        data.inverter_efficiency
    )


@app.post("/calculations/battery-bank")
def battery_bank_calculation(data: BatteryBankRequest):
    return calculate_battery_bank(
        data.required_capacity_ah,
        data.system_voltage,
        data.battery_voltage,
        data.battery_capacity_ah
    )
