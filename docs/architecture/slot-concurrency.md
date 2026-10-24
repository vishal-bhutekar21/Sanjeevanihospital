# Slot booking concurrency (moved)

This early plan described slot locking for a server and database setup the project no longer uses.

How slot holds work now (10-minute holds in the Cloudflare D1 table `appointment_slots`, made race-free by a unique doctor + date + time constraint and a conditional update) is described in [documentation/04-architecture.md](../../documentation/04-architecture.md#slot-holds).
