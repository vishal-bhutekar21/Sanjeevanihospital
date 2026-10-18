# Documentation

This folder explains the hospital website and booking system in this repository: what it does, how it is built, and how to set it up for a new hospital.

## What this product is

A website for a single hospital, with online OPD booking and an admin panel for hospital staff.

- **Public website:** departments, doctors with their weekly OPD timings, facilities, MJPJAY and insurance pages, health camps and patient reviews, contact page. Every page is in English and Marathi.
- **Online booking:** the patient picks a doctor, a date and a time, confirms their mobile number with a one-time code (OTP), and either pays online (Razorpay) or pays at the counter. They get a token number and an A5 PDF token slip.
- **Admin panel:** appointments, OPD timings per doctor, doctors, departments, payments, scheme claims, reviews and camps, and a read-only page of hospital details.

The first hospital to use it is Sanjeevani Multispeciality Hospital, Jalna. The code is set up so that the same product can be launched for another hospital by changing the hospital details, the doctor list and the photos.

## Who it is for

- **Developers** setting up the site for a new hospital, or adding features.
- **AI coding agents** working in this repository. Start with [AI_AGENT_GUIDE.md](AI_AGENT_GUIDE.md).
- **Project owners** who want to know what the product does and what is planned.

## How to use this folder

| If you want to… | Read |
| --- | --- |
| Understand what the product does and where the code lives | [01-product-overview.md](01-product-overview.md) |
| Launch the site for a new hospital | [02-rebrand-checklist.md](02-rebrand-checklist.md), then [templates/new-hospital-intake.md](templates/new-hospital-intake.md) |
| Look up a field in a data file (doctors, departments, timings…) | [03-data-reference.md](03-data-reference.md) |
| Understand how booking, login and data storage work | [04-architecture.md](04-architecture.md) |
| Deploy, set environment variables, fix common problems | [05-deployment-and-config.md](05-deployment-and-config.md) |
| Build or change a page so it matches the rest of the site | [06-design-system.md](06-design-system.md) |
| See planned work | [07-roadmap.md](07-roadmap.md) |
| Staff records, alerts, Firebase push, Cloudflare cron, login | [08-notifications-and-staff-plan.md](08-notifications-and-staff-plan.md) |
| Work on the code as an AI agent | [AI_AGENT_GUIDE.md](AI_AGENT_GUIDE.md) |

The older `docs/` folder at the repo root holds earlier research notes and design plans. Where it disagrees with this folder, this folder is the current one.

## The two most important files

- `frontend/src/config/hospital.ts`: the hospital's name, phone numbers, emails, address, hours and map. Every page reads from it.
- `backend/src/config/hospital.config.ts`: the hospital id and details used by the server. Each value can be overridden with an environment variable.
