from datetime import datetime, timedelta


def get_position(queue, patient_id):
    """Get 1-based position of patient in queue"""
    for i, patient in enumerate(queue):
        if patient["id"] == patient_id:
            return i + 1
    return None


def estimate_wait_time(position):
    """Calculate wait time based on position (10 minutes per patient)"""
    if position is None:
        return None
    return (position - 1) * 10


def add_minutes(time_str, minutes):
    """Add minutes to a time string in HH:MM format"""
    t = datetime.strptime(time_str, "%H:%M")
    t += timedelta(minutes=minutes)
    return t.strftime("%H:%M")


def time_greater_than(time1_str, time2_str):
    """Compare two time strings in HH:MM format"""
    t1 = datetime.strptime(time1_str, "%H:%M")
    t2 = datetime.strptime(time2_str, "%H:%M")
    return t1 > t2


def handle_no_show(queue, current_time):
    """Mark patients as skipped if they're more than 10 minutes late"""
    patients_to_skip = []
    
    for patient in queue:
        if patient["status"] == "waiting":
            scheduled = patient["scheduled_time"]
            skip_time = add_minutes(scheduled, 10)
            
            if time_greater_than(current_time, skip_time):
                patients_to_skip.append(patient)
    
    for patient in patients_to_skip:
        patient["status"] = "skipped"
        queue.remove(patient)
        queue.append(patient)


def add_emergency(queue, patient):
    """Add emergency patient at the front of queue"""
    patient["is_emergency"] = True
    patient["status"] = "waiting"
    queue.insert(0, patient)


def queue_agent(state, current_time="14:05"):
    """Main queue management function"""
    queue = state["queue"]
    patient_id = state["patient_id"]

    handle_no_show(queue, current_time)

    position = get_position(queue, patient_id)
    wait_time = estimate_wait_time(position)

    return {
        "queue": queue,
        "position": position,
        "wait_time": wait_time,
        "queue_length": len(queue)
    }