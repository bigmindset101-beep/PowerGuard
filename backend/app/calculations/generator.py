from decimal import Decimal, InvalidOperation


def to_decimal(value, field_name):
    """Convert a value to Decimal and validate it."""
    try:
        number = Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        raise ValueError(f"{field_name} must be a valid number.")

    if not number.is_finite():
        raise ValueError(f"{field_name} must be finite.")

    return number


def calculate_generator_cost(
    fuel_consumption,
    fuel_price,
    operating_hours
):
    """
    Calculate generator fuel consumption and running cost.

    fuel_consumption: Litres per hour (L/h)
    fuel_price: Price per litre (NGN)
    operating_hours: Number of operating hours
    """

    consumption = to_decimal(
        fuel_consumption, "Fuel consumption"
    )
    price = to_decimal(
        fuel_price, "Fuel price"
    )
    hours = to_decimal(
        operating_hours, "Operating hours"
    )

    if consumption <= 0:
        raise ValueError("Fuel consumption must be greater than zero.")

    if price < 0:
        raise ValueError("Fuel price cannot be negative.")

    if hours < 0:
        raise ValueError("Operating hours cannot be negative.")

    fuel_consumed = consumption * hours
    cost_per_hour = consumption * price
    total_cost = fuel_consumed * price

    return {
        "fuel_consumed_litres": float(fuel_consumed),
        "cost_per_hour": float(cost_per_hour),
        "total_fuel_cost": float(total_cost),
        "operating_hours": float(hours),
        "currency": "NGN"
    }
