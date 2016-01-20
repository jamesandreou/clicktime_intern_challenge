'use strict';

// Wrap app context in an anonymous closure to keep out of global scope.
(function(){
	var app = {
		socket : io(), // socket.io
		ctx : document.getElementById("canvas").getContext("2d"), // canvas context
		state : null, // state of screen
		col : '#'+Math.random().toString(16).substr(-6), // randomly assigned color
		mode : 0, // 0 - draw, 1 - erase
		width : 4, // width of brush
		dragging : false, // is mouse down
		prevX : 0, // previous mouse x
		prevY : 0 // previous mouse y
	}
	// Create a blank state
	app.state = app.ctx.createImageData(500, 500);

	// Color box with clients color.
	document.getElementById("color_box").style.backgroundColor = app.col;

	// Initialize buttons
	initButtons(app);

	// Initialize mouse event listeners.
	canvas.addEventListener("mousemove", eventHandlers("move", app), false);
    canvas.addEventListener("mousedown", eventHandlers("down", app), false);
    canvas.addEventListener("mouseup", eventHandlers("up", app), false);

    // Socket.io events
    // When a new line is emitted
    app.socket.on('line', function(line){
	    drawLine(line, app);
	});

}) ();	

// Emit line data over socket.io via a simple JSON with the start/end points, mode, and color
function emitLine(x, y, app){
	app.socket.emit("line", {
		x1 : app.prevX,
		y1 : app.prevY,
		x2 : x,
		y2 : y,
		col : app.col,
		mode : app.mode
	});
}

// Draw the brush of the current tool, draw or erase
function drawBrush(x, y, app){
	var brushWidth = app.mode === 0 ? ((app.width + 2) / 2) : 10;
	app.ctx.fillStyle = app.mode === 0 ? app.col : "#ffffff";
	app.ctx.strokeStyle = '#000000';
	app.ctx.lineWidth = 1;
	app.ctx.beginPath();
	app.ctx.clearRect(20,20,100,50);
	app.ctx.putImageData(app.state, 0, 0);
	app.ctx.arc(x, y, brushWidth, 0, 2*Math.PI);
	app.ctx.fill();
	app.ctx.stroke();
	app.ctx.closePath();
}

// Draw a line to the canvas
function drawLine(line, app){
	app.ctx.strokeStyle = line.mode === 0 ? line.col : '#ffffff';
	app.ctx.lineWidth = line.mode === 0 ? app.width : 20;
	app.ctx.beginPath();
	app.ctx.clearRect(20,20,100,50);
	app.ctx.putImageData(app.state, 0, 0);
	app.ctx.moveTo(line.x1, line.y1);
	app.ctx.lineTo(line.x2, line.y2);
	app.ctx.stroke();
	app.state = app.ctx.getImageData(0, 0, 500, 500);
	app.ctx.closePath();
}


// Returns function reference for listeners, keep out of init function for readability.
function eventHandlers (eventType, app){
	switch(eventType){
		case "down" :
			return function(e){
				app.dragging = true;
				app.prevX = Math.floor(e.clientX - canvas.offsetLeft);
		    	app.prevY = Math.floor(e.clientY - canvas.offsetTop);
			}
		case "up" :
			return function(e){
				app.dragging = false;
			}
		case "move" :
			return function(e){
				var x = Math.floor(e.clientX - canvas.offsetLeft);
			    var y = Math.floor(e.clientY - canvas.offsetTop);
			    // If the mouse is down emit a line, draw brush.
				if(app.dragging){
			    	emitLine(x, y, app);
			    	app.prevX = x;
			    	app.prevY = y;
		    	}else{
		    		drawBrush(x, y, app);
		    	}
			}
	}
}

function initButtons(app){
	var draw = document.getElementById('draw_btn');
	var erase = document.getElementById('erase_btn');
	// Set draw to active state (white)
	document.getElementById('draw_btn_inner').style.fill = '#ffffff';
	// Listeners
	draw.addEventListener("click", function(e){
	    document.getElementById('draw_btn_inner').style.fill = '#ffffff';
	    document.getElementById('erase_btn_inner').style.fill = '#5c5c5c';
	    app.mode = 0;
	});
	erase.addEventListener("click", function(e){
	    document.getElementById('draw_btn_inner').style.fill = '#5c5c5c';
	    document.getElementById('erase_btn_inner').style.fill = '#ffffff';
	    app.mode = 1;
	});
}
