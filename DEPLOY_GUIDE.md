# 🚀 End-to-End Deployment Guide (Render + MongoDB Atlas)

Since you are deploying to the cloud (Render), you cannot use your local MongoDB. You need a cloud database.

Follow these 2 simple phases to deploy your application.

---

## 🟢 Phase 1: Set up Cloud Database (MongoDB Atlas)
*Time needed: 5-10 minutes*

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up (Free).
2. **Create Cluster**:
   - Choose **Shared** (Free) option.
   - Select a provider (AWS) and region (e.g., Mumbai `ap-south-1`).
   - Click **Create Cluster**.
3. **Setup Security**:
   - **Username/Password**: Create a database user (e.g., `admin` / `password123`). **Remember this!**
   - **IP Access**: Select "Allow Access from Anywhere" (`0.0.0.0/0`) so Render can connect.
4. **Get Connection String**:
   - Click **Connect** → **Drivers**.
   - Copy the string. It looks like:
     `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password.
   - **Save this URL**, you will need it for Render.

---

## 🟣 Phase 2: Deploy to Render
*Time needed: 2 minutes*

1. **Login**: Go to [dashboard.render.com](https://dashboard.render.com/) and login with GitHub.
2. **New Blueprint**:
   - Click **New +** button.
   - Select **Blueprint**.
3. **Connect Repo**:
   - Connect your `beauty-parlour` repository.
4. **Configure & Deploy**:
   - Render will automatically read the `render.yaml` file.
   - It will ask you for "Environment Variables". Fill them in:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Paste your MongoDB Atlas URL from Phase 1 |
| `JWT_SECRET` | Type a random secret code (e.g., `mysecurekey123`) |
| `NODE_ENV` | `production` |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID (Test or Live) |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Secret |

5. **Click Apply/Deploy**.

---

## 🎉 That's it!
Render will now:
1. Build your backend.
2. Build your frontend.
3. Deploy both.
4. Give you a live URL (e.g., `https://beauty-parlour-frontend.onrender.com`).

**Note**: The first build might take 5-10 minutes. Check the "Logs" tab if anything goes wrong.
