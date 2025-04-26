# Chat Application

A full-stack real-time **Chat Application** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.io**.  
Supports personal messaging, group chats, file sharing, invite links, and secure JWT authentication.

![Chat Application Screenshot](https://github.com/avansingh085/Chat_Application/blob/main/public/website_image.png?raw=true)

---

## ✨ Features

- **Real-time Messaging**  
  Instant personal and group chat using **WebSockets** (Socket.io).

- **User Authentication**  
  Secure login/signup with **JWT Authentication**.  
  Every request is verified with a valid token before allowing access.

- **Personal and Group Chat**
  - Create personal one-to-one chats.
  - Create and manage group chats.
  - Join groups via shareable **invite links**.

- **Invite Link Management**
  - Generate unique **group invite links**.
  - Links automatically **expire after 30 minutes** for security.

- **File Transfer**
  - Share files and media directly in personal and group chats.

- **Message Link Detection**
  - Automatically detect and display clickable URLs inside messages.

- **Improved Performance**
  - Fetch all chats **in parallel** from the database.
  - **Combine and send** optimized responses to the client.
  - **Reduced load time** for large message histories.

- **Socket.io Optimization**
  - Faster reconnection.
  - Minimized event emissions.
  - Reduced unnecessary database calls.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Real-Time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)


---


