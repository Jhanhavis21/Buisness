# Skylark Drones BI Agent

Skylark Drones is a business intelligence agent with a React frontend, an Express backend, a Monday.com data layer, and a Gemini-powered chat assistant.

## Overview
The project provides a conversational BI assistant connected to Monday.com, with a dashboard and chat interface.

## Stack
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Express, TypeScript
- AI: Gemini via @google/genai
- Data: Monday.com GraphQL API

## Required environment variables

Frontend Vercel:
- VITE_API_URL=https://<backend-vercel-url>

Backend Vercel:
- MONDAY_API_TOKEN
- MONDAY_API_URL
- DEAL_FUNNEL_BOARD_ID
- WORK_ORDER_TRACKER_BOARD_ID
- GEMINI_API_KEY
- FRONTEND_URL

Local development:
- copy .env.example to .env and fill values
