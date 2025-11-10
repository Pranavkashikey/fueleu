# FuelEU Maritime Compliance Dashboard

## Overview

A full-stack dashboard to manage and visualize FuelEU Maritime GHG compliance for ships. Track compliance balances, apply banking/pooling mechanisms, and automate surplus allocation — all with a react-based frontend and Node.js backend.

## Architecture Summary (Hexagonal Structure)

-Frontend: React + TypeScript + Tailwind CSS
-Backend: Node.js (Express) + TypeScript, using Clean/Hexagonal Architecture
- Database: PostgreSQL (via Prisma ORM)

## Hexagonal Highlights
-Adapters for UI, external APIs, and persistence (DB).
-Core/domain layer: Business rules, entities, and use cases.
-Ports/UseCases: Clear boundary between logic and infra; easy to swap out DB or UI.


##  Setup & Run Instructions

1.Clone the repo in any New Folder such as(FuelEu Project):
    git clone https://github.com/Pranavkashikey/fueleu
    

2.Install dependencies:
    
    cd FuelEu Project/backend && npm install
    cd frontend && npm install
    

3.Database setup:
    - Configure 'backend/.env' for your Postgres DB.
    - Run migrations and seed data:
    cd backend
    npx prisma migrate reset --force

4.Start both servers:
    # Backend
    npm run dev

    # Frontend (in a second terminal)
    cd frontend
    npm run dev
    
    Open [http://localhost:5173](http://localhost:5173)

##  How to Execute Tests

- Backend:
    
    cd backend
    npm run test
    Runs Jest and ts-jest against all "__tests__" files.
- Frontend:
    cd frontend
    npm run test
    Runs Vitest/React Testing Library unit tests.

---

## Screenshots & Sample API Requests

# Dashboard 
Dashboard SnapShot URL :-> https://res.cloudinary.com/dkcy47t7c/image/upload/v1762797034/FireShot_Capture_031_-_fueleu-compliance_-_localhost_vf0i2h.png



# Banking: Apply Surplus CB
Ship: SHIP001
CB: 1500.5 gCO₂eq
Bank Surplus: Enter 500 → New CB: 1000.5, Banked 500 available


# Sample API Request (BANK):

POST /api/banking/bank
{
"shipId": "SHIP001",
"year": 2024,
"amount": 500
}

# Response:
{
"success": true,
"cb_before": 1500.5,
"applied": 500,
"cb_after": 1000.5
}


# Sample API Request (Apply Banked):

POST /api/banking/apply
{
"shipId": "SHIP001",
"year": 2024,
"amount": 200
}

# Response

{
"success": true,
"cb_before": 1000.5,
"applied": 200,
"cb_after": 1200.5
}

# Pooling Greedy Allocation (Tab) Snapshot
Pooling Tab url:-> https://res.cloudinary.com/dkcy47t7c/image/upload/v1762797154/FireShot_Capture_032_-_fueleu-compliance_-_localhost_roa1xl.png


# Notes

-All error messages and validations are handled in both backend APIs and UI as per FuelEU rules.
-Navbar and all tabs are responsive for a seamless exam demo.
-Seed data can be reset anytime using: `npx prisma migrate reset --force`


my project repo:- https://github.com/Pranavkashikey/fueleu





