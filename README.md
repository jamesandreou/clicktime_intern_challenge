# Clicktime Intern Challenge #1
## Usage
-npm install
-npm start (or node app.js)
-open multiple browsers to localhost:5000
## Connect to different server
Simply change the ports and host in app.js. I use express framework making it super simple.
## Implementation Description
The only additional technology I added to the stack outside of the design specifications is ExpressJS for an easy server setup. My sockets are very simple. Each time a line is drawn between two points the line is sent in JSON format to all clients. When a client receives a line it is drawn to the screen. I made a few simple svg buttons to switch between draw and erase mode. I did not have much time to work on this because of a heavy school schedule. I would be happy to discuss any features that were not implemented!