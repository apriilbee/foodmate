# foodmate
**Foodmate** is a meal planning and recipe browsing web app that helps users discover recipes based on their preferences, dietary needs, and available ingredients. Built with Node.js, MongoDB, and Materialize CSS, it supports JWT authentication and third-party API integration.

## Docker Instructions (SIT725 HD Task)

Run this app using a standalone Docker image **or** using Docker Compose (recommended).

## Option 1: Run via Dockerfile

### Build the Docker Image

```bash
docker build -t foodmate-app .
```

### Run the Docker Container

```bash
docker run -p 3000:3000 foodmate-app
```

### Access the App

```bash
http://localhost:3000
```


## Option 2: Run via Docker Compose (Recommended)

### Build and run the app 

```bash
docker-compose up --build
```

### Access the App

```bash
http://localhost:3000
```


This will build app image, launch app and MongoDB services, and connect it to a shared Docker network.

---

### /api/student Endpoint

Visit:

`http://localhost:3000/api/student`

Expected output: 

```json
{
  "name": "April Dae Bation",
  "studentId": "S224009373"
}

```




