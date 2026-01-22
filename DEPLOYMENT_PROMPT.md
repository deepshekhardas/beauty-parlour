# AI Agent Prompt for End-to-End Deployment

Copy and paste this prompt to another AI agent to complete deployment:

---

## PROMPT:

```
I have a full-stack MERN application (Beauty Parlour Booking System) that I need to deploy end-to-end. The project is located at: c:\Users\hp\Downloads\BP

The project structure:
- /backend - Node.js Express API
- /frontend - React Vite TypeScript app
- render.yaml - Render Blueprint configuration (already configured)

## TASKS TO COMPLETE:

### 1. MongoDB Atlas Setup
- Help me create a FREE MongoDB Atlas cluster
- Guide me step-by-step to:
  - Create account at mongodb.com/atlas
  - Create a new FREE shared cluster (AWS, Mumbai region)
  - Create database user with username and password
  - Whitelist IP: 0.0.0.0/0 (allow all - needed for Render)
  - Get the connection string (mongodb+srv://...)
  - Replace <password> in the connection string with actual password

### 2. Render.com Deployment
- Help me deploy using Render Blueprints:
  - Login to render.com with GitHub
  - Create New → Blueprint
  - Connect my GitHub repo: deepshekhardas/beauty-parlour
  - When asked for environment variables, help me fill:
    - MONGO_URI = (Atlas connection string from step 1)
    - JWT_SECRET = (generate a random secure string)
    - RAZORPAY_KEY_ID = rzp_test_xxxxx (I'll provide or skip for now)
    - RAZORPAY_KEY_SECRET = (I'll provide or skip for now)
  - Deploy and verify both services are running

### 3. Verification
- Once deployed, test:
  - Frontend is accessible at the Render URL
  - Backend health check: [backend-url]/api-docs
  - AI Chatbot is responding
  - Appointment booking form works

### 4. (Optional) Custom Domain
- If I have a domain, help me connect it to Render

## IMPORTANT FILES TO REFERENCE:
- render.yaml (deployment config)
- backend/.env.example (required env vars)
- DEPLOY_GUIDE.md (step-by-step guide)
- RAZORPAY_SETUP.md (payment setup guide)

Please guide me through each step interactively. Start with MongoDB Atlas setup.
```

---

## HOW TO USE:
1. Open any AI coding agent (Claude, Cursor, Windsurf, etc.)
2. Copy the prompt above (inside the ```code block```)
3. Paste it and follow the agent's instructions
4. The agent will walk you through MongoDB Atlas + Render deployment

Good luck! 🚀
