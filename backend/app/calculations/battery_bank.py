import math


def calculate_battery_bank(
    required_capacity_ah,
    system_voltage,
    battery_voltage,
    battery_capacity_ah
):
    """
    Calculate the battery bank configuration.

    Determines the number of batteries required,
    series connections, parallel connections,
    and total bank capacity.
    """

    values = {
        "required_capacity_ah": required_capacity_ah,
        "system_voltage": system_voltage,
        "battery_voltage": battery_voltage,
        "battery_capacity_ah": battery_capacity_ah
    }

    for name, value in values.items():
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"{name} must be a number.")

        if not math.isfinite(value) or value <= 0:
            raise ValueError(f"{name} must be positive and finite.")

    voltage_ratio = system_voltage / battery_voltage

    if not voltage_ratio.is_integer():
        raise ValueError(
            "System voltage must be a whole-number multiple "
            "of battery voltage."
        )

    batteries_in_series = int(voltage_ratio)

    batteries_in_parallel = math.ceil(
        required_capacity_ah / battery_capacity_ah
    )

    total_batteries = (
        batteries_in_series * batteries_in_parallel
    )

    actual_bank_capacity = (
        batteries_in_parallel * battery_capacity_ah
    )

    total_bank_energy = (
        system_voltage * actual_bank_capacity
    )

    return {
        "batteries_in_series": batteries_in_series,
        "batteries_in_parallel": batteries_in_parallel,
        "total_batteries": total_batteries,
        "actual_bank_capacity_ah": actual_bank_capacity,
        "total_bank_energy_wh": total_bank_energy,
        "system_voltage": system_voltage
  }
