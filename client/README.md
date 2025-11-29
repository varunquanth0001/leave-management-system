# 🏢 Employee Leave Management System

A full-stack **MERN (MongoDB, Express, React, Node.js)** application designed to streamline the leave application process for employees and approval workflow for managers.

---

## 🚀 Tech Stack

* **Frontend:** React.js, Tailwind CSS, Zustand (State Management), Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Local)
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt

---

## ✨ Features

### 👨‍💼 Employee
* **Secure Login/Register:** Create an account and log in securely.
* **Dashboard:** View leave balances (Sick, Casual, Vacation) in real-time.
* **Apply for Leave:** Select leave type, dates, and reason.
* **Track History:** View status of past leave requests (Pending, Approved).

### 👮‍♂️ Manager
* **Team Dashboard:** View all leave requests from all employees.
* **Approval Workflow:** Approve or Reject leave requests with a single click.
* **Balance Updates:** Approved leaves automatically deduct from the employee's balance.

---

## 🛠️ Environment Variables

Ensure you have a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leave_management
JWT_SECRET=secret123


💻 Setup Instructions & How to Run
Follow these steps to get the project running on your local machine.

Step 1: Clone the Repository
Bash

git clone <your-repo-link>
cd leave-management-system
Step 2: Backend Setup (Server)
Open a terminal and run:

Bash

cd server
npm install
node server.js
Success Message: ✅ Server running on port 5000 / MongoDB Connected

Step 3: Frontend Setup (Client)
Open a new terminal window and run:

Bash

cd client
npm install
npm run dev
Access the App: Open your browser and go to http://localhost:5173