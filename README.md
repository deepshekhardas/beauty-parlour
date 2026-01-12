# Glow & Grace - Beauty Parlour Booking System

A premium, full-stack appointment booking application for beauty salons.

## 🚀 Features
- **Modern UI:** "Lavish" design with glassmorphism and gold accents.
- **Appointment Booking:** Complete flow with Service, Staff, Date, and Time selection.
- **Admin Dashboard:** Manage Services, Appointments, Staff, Gallery, and Reviews.
- **Dynamic Content:** All data (Gallery, Testimonials, Services) is database-driven.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Tools:** Axios, React Router, React Hot Toast, Recharts

## 📦 Installation

1. **Clone the repository**
2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/beauty-parlour
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ADMIN_EMAIL=admin@example.com
   ```

4. **Seed Database** (Optional)
   Populate the database with sample data (Admin user, Services, Staff):
   ```bash
   cd backend
   npm run seed
   ```

5. **Run the App**
   Open two terminals:
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔑 Default Admin Credentials
- **Email:** `admin@example.com`
- **Password:** `password123`

## 🧪 Testing
Backend tests are available for authentication and appointment flows:
```bash
cd backend
npm test
```
**Note**: Tests require a running MongoDB instance. See `backend/TESTING.md` for detailed setup instructions.

## 📧 Email Notifications
Currently configured to log emails to the console (Development mode). To send real emails, configure `nodemailer` in `backend/src/utils/emailService.js`.
