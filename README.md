# Task Manager - DevOps Practice Project

A simple, full-featured task management application for learning DevOps practices.

## Quick Start

1. Clone or create project directory
2. Copy all source files
3. Install dependencies: `npm install`
4. Run the app: `npm run dev`
5. Open: http://localhost:3000

## Commands

- `npm run dev` - Development mode with auto-reload
- `npm start` - Production mode
- `npm test` - Run tests
- `docker-compose up` - Run with Docker

## Features

✅ Full CRUD operations
✅ Real-time statistics
✅ Beautiful responsive UI
✅ Comprehensive tests
✅ Docker ready
✅ CI/CD pipeline

## Project Structure

### Dockerfile

- Write Dockerfile

#### Test Docker on local machine
  1. Build the Docker image:
  docker build -t simple-taskmanager .

  2. Run the container:
  docker run -p 3000:3000 --name
  taskmanager-test simple-taskmanager

  3. Test the health check:
  docker ps

  4. Check container logs:
  docker logs taskmanager-test

  5. Test the application:
  curl http://localhost:3000/api/health

  6. Clean up after testing:
  docker stop taskmanager-test
  docker rm taskmanager-test