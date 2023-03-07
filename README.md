# valstro-take-home

## Description
This Node.js (written in TypeScript) application allows users to interact with a Socket.io wrapper of the Star Wars public REST API. Specifically, this client lets users query the "people" endpoint of the API to receive a list of star wars characters and the franchise films they appear in.

### Install
```bash
$ npm install
```

### How to Run
There are two ways to run this application
1. Run the backend server and the client application (locally) separately 

Run the socket.io backend server: 
```bash
docker run -p 3000:3000 clonardo/socketio-backend
```
Run the client application
```bash
$ npm run start
```

2. Use one command to run the application as a multi-container Docker application (this uses Docker Compose: https://docs.docker.com/compose/)

```bash
docker-compose build && docker-compose run --rm client
```

### Testing