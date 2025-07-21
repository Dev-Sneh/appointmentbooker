# 📅 Appointment Booking System — Full Stack Project

A real-time appointment scheduling system built to streamline booking, management, and tracking of client meetings through a modern calendar interface. Designed using TypeScript (frontend) and Node.js with Firebase Firestore (backend), this full-stack solution ensures fast performance, scalability, and simplicity.


## 🔍 Project Overview

This project simplifies the traditional process of appointment booking by offering:

* A **calendar-driven UI** for users to visualize availability.
* **Real-time interaction** with Firestore for instant updates.
* Clear **client details and appointment metadata** storage.
* Designed with flexibility to support **recurring and follow-up sessions**.

It is ideal for businesses, freelancers, and service providers who manage daily calls or consultations.

---

## 🔗 Live Demo

🌐 [Live Demo](https://appointbooker.netlify.app/)
💾 [GitHub Repository](https://github.com/Dev-Sneh/appointment-booking-app)

---

## ⚙️ Tech Stack

| Layer    | Technology                                                              |
| -------- | ----------------------------------------------------------------------- |
| Frontend | React.js, TypeScript, Tailwind CSS                            |
| Backend  | Node.js, Typescript,Express.js                                                     |
| Database | Firebase Firestore                                           |


---

## 📁 Firebase Firestore Structure

**Collection:** `client`
Each document represents a single appointment with fields:

```bash
📂 client
 └── 📄 <auto-ID>
     ├── id: string             # Internal ID for reference (e.g., "c5")
     ├── name: string           # Client name (e.g., "Client 5")
     ├── phone: string          # Phone number (e.g., "+91-90000104")
     ├── date: string           # Appointment date (e.g., "2025-07-19")
     ├── dayOfWeek: number      # Day of week (0=Sun, ..., 6=Sat)
     ├── startTime: string      # Appointment start time (e.g., "11:30")
     ├── duration: number       # Duration in minutes (e.g., 20)
     ├── recurring: boolean     # Whether the appointment repeats
     ├── type: string           # Type of call (e.g., "follow-up")
```

---

## ✅ Key Features

* 📅 **Interactive Calendar View:** Displays existing and new bookings clearly.
* 📝 **Appointment Form:** Capture all essential client details.
* 🔄 **Real-time Firestore Sync:** Immediate updates across the app.
* 🗑️ **Appointment Deletion:** Remove existing calls with a single click.
* 📱 **Responsive Design:** Works across desktops, tablets, and smartphones.
* 🧩 **Modular Codebase:** Easy to extend and maintain.

---

## 🏁 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/appointment-booking-app
cd appointment-booking-app
npm install
```

### 2. Setup Firebase

* Create a project in [Firebase Console](https://console.firebase.google.com/)
* Enable **Firestore** database.
* Generate and download your service account key.
* Store it in `backend/firebase/serviceAccountKey.json`
* Create a `.env` (or config) file if needed for credentials and URLs.

### 3. Run Backend

```bash
cd backend
npm run dev
```

### 4. Run Frontend

```bash
cd frontend
npm run dev
```

---

## 📌 Project Use Cases

* Freelancers managing consultations or demos
* Clinics or service providers booking client calls
* Educational counselors scheduling student sessions
* Corporate teams coordinating internal/external meetings

---

## 📦 Future Improvements

* ✅ Email/SMS reminders integration
* ✅ Admin dashboard with analytics
* ✅ OAuth login for client-specific tracking
* ✅ Google Calendar sync
