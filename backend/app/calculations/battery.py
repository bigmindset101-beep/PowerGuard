def calculate_battery_capacity(
    load_watts,
    backup_hours,
    system_voltage,
    depth_of_discharge=0.8,
    inverter_efficiency=0.9
):
    """
    Calculate the required battery capacity.

    Returns capacity in Watt-hours and Amp-hours.
    """

    values = {
        "load_watts": load_watts,
        "backup_hours": backup_hours,
        "system_voltage": system_voltage
    }

    for name, value in values.items():
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"{name} must be a number.")

        if not value > 0 or not float(value) < float("inf"):
            raise ValueError(f"{name} must be positive and finite.")

    if not 0 < depth_of_discharge <= 1:
        raise ValueError("Depth of discharge must be between 0 and 1.")

    if not 0 < inverter_efficiency <= 1:
        raise ValueError("Inverter efficiency must be between 0 and 1.")

    energy_needed = load_watts * backup_hours

    battery_wh = energy_needed / (
        depth_of_discharge * inverter_efficiency
    )

    battery_ah = battery_wh / system_voltage

    return {
        "energy_needed_wh": round(energy_needed, 2),
        "required_capacity_wh": round(battery_wh, 2),
        "required_capacity_ah": round(battery_ah, 2),
        "system_voltage": system_voltage
    }
