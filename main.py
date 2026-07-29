from agents.queue_system import queue_agent

# ---------------------------
# SAMPLE QUEUE DATA
# ---------------------------
queue = [
    {"id": 1, "name": "A", "scheduled_time": "14:00", "status": "waiting"},
    {"id": 2, "name": "B", "scheduled_time": "14:10", "status": "waiting"},
    {"id": 3, "name": "C", "scheduled_time": "14:20", "status": "waiting"}
]


# ---------------------------
# FUNCTION TO PRINT QUEUE
# ---------------------------
def print_queue(q):
    print("\n📋 CURRENT QUEUE:")
    for i, p in enumerate(q):
        print(f"Position {i+1}: {p['name']} | Time: {p['scheduled_time']} | Status: {p['status']}")
    print("-" * 40)


# ---------------------------
# TEST 1: NORMAL CASE djka djsabda bd awljd sf  ldmn sahkd awkd ashjd awj dawj dasnka dkajs dkaww dkjas ka d;wo dawk dlkas d sakjd ask f e ffjk wqd ,d wmn dlwa dkla slkaj daakj dwaakjd wadlkja wdawl dw
# ---------------------------
print("\n🔹 TEST 1: NORMAL CASE")

state = {
    "queue": queue.copy(),
    "patient_id": 2
}

result = queue_agent(state)

print_queue(result["queue"])
print("👉 Position:", result["position"])
print("👉 Wait Time:", result["wait_time"], "minutes")


# ---------------------------
# TEST 2: EMERGENCY CASE
# ---------------------------
print("\n🚨 TEST 2: EMERGENCY CASE")

queue_emergency = queue.copy()

# add emergency patient at top
queue_emergency.insert(0, {
    "id": 99,
    "name": "Emergency",
    "scheduled_time": "14:05",
    "status": "waiting"
})

state = {
    "queue": queue_emergency,
    "patient_id": 2
}

result = queue_agent(state)

print_queue(result["queue"])
print("👉 Position:", result["position"])
print("👉 Wait Time:", result["wait_time"], "minutes")


# ---------------------------
# TEST 3: NO-SHOW CASE
# ---------------------------
print("\n⏰ TEST 3: NO-SHOW CASE")

queue_noshow = [
    {"id": 1, "name": "A", "scheduled_time": "10:00", "status": "waiting"},  # old time
    {"id": 2, "name": "B", "scheduled_time": "14:10", "status": "waiting"},
    {"id": 3, "name": "C", "scheduled_time": "14:20", "status": "waiting"}
]

state = {
    "queue": queue_noshow,
    "patient_id": 2
}

result = queue_agent(state)

print_queue(result["queue"])
print("👉 Position:", result["position"])
print("👉 Wait Time:", result["wait_time"], "minutes")


# ---------------------------
# TEST 4: INVALID PATIENT
# ---------------------------
print("\n❌ TEST 4: INVALID PATIENT")

state = {
    "queue": queue.copy(),
    "patient_id": 999  # not in queue
}

result = queue_agent(state)

print_queue(result["queue"])
print("👉 Position:", result["position"])
print("👉 Wait Time:", result["wait_time"])