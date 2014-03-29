/*jslint browser: true, node: true, indent: 2*/
/*global $, jQuery, alert, prompt*/
// @license magnet:?xt=urn:btih:5305d91886084f776adcf57509a648432709a7c7&dn=x11.txt MIT
"use strict";
var drawingWidth = 750;
var drawingHeight = 500;

var MAX_HISTORY_LENGTH = 50;

var canvasHistory = [];
var historyIterator = 0;

function clearHistoryToIterator() {
  while (canvasHistory.length > historyIterator + 1) {
    canvasHistory.pop();
  }
}

function saveCanvasState() {
  clearHistoryToIterator();
  var canvas = document.getElementById('drawing').getContext('2d');
  canvasHistory.push(canvas.getImageData(0, 0, drawingWidth, drawingHeight));
  if (canvasHistory.length > MAX_HISTORY_LENGTH) {
    canvasHistory.shift();
  }
  historyIterator = canvasHistory.length - 1;
}

function drawSample() {
  $('#drawing').drawArc({
    fillStyle: 'orange',
    x: 75,
    y: 75,
    radius: 50
  });
  saveCanvasState();
}

$(window).bind('beforeunload', function () {
  if (historyIterator > 0) {
    return 'You have created a drawing.';
  }
});

var currentlyDrawing = false;
var lastMouseX = 0;
var lastMouseY = 0;
var drawColor = "black";
var thickness = 5;

function onCanvasMouseDown(event) {
  if (event.which !== 1) {
    return; // ignore non-left clicks
  }
  event.preventDefault();
  currentlyDrawing = true;
  var mouseX, mouseY, context = event.target.getContext("2d");
  if (event.offsetX) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else if (event.layerX) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }
  // Draw initial point of line
  context.beginPath();
  context.moveTo(mouseX, mouseY);
  context.lineTo(mouseX + 1, mouseY + 1);
  context.strokeStyle = drawColor;
  context.lineCap = "round";
  context.lineWidth = thickness;
  context.stroke();
}

function onCanvasMouseUp(event) {
  currentlyDrawing = false;
  lastMouseX = 0;
  lastMouseY = 0;
  saveCanvasState();
}

function onCanvasMouseMove(event) {
  if (!currentlyDrawing) {
    return;
  }
  var mouseX, mouseY, context = event.target.getContext("2d");
  // Calculate correct mouse position cross-browser (i think)
  if (event.offsetX) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else if (event.layerX) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }
  // If the mouse has just began to move, start drawing there, not at the left side of the screen
  if (lastMouseX === 0) {
    lastMouseX = mouseX;
  }
  if (lastMouseY === 0) {
    lastMouseY = mouseY;
  }
  // Draw from previous mouse position to the current mouse position
  context.beginPath();
  context.moveTo(lastMouseX, lastMouseY);
  context.lineTo(mouseX, mouseY);
  context.strokeStyle = drawColor;
  context.lineCap = "round";
  context.lineWidth = thickness;
  context.stroke();
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

$(document).ready(function onLoad() {
  $('#drawing').attr({width: drawingWidth, height: drawingHeight});
  $('.container').css('width', drawingWidth + 0.05 * $(window).width());
  $("#drawing").mousedown(onCanvasMouseDown).mouseup(onCanvasMouseUp)
    .mousemove(onCanvasMouseMove);
  drawSample();
});

$(window).on('resize', function onResize() {
  $('.container').css('width', drawingWidth + 0.05 * $(window).width());
});

function resize() {
  var dimensions = prompt('WARNING: Resize will clear the drawing\nCanvas dimensions',
                          drawingWidth + "x" + drawingHeight).split("x"),
    newWidth = parseInt(dimensions[0], 10),
    newHeight = parseInt(dimensions[1], 10);
  if (isNaN(newWidth) || isNaN(newHeight)) {
    alert('Invalid input');
  } else {
    drawingWidth = newWidth;
    drawingHeight = newHeight;
    $('#drawing').attr({width: drawingWidth, height: drawingHeight});
    $('.container').css('width', drawingWidth + 0.05 * $(window).width());
    historyIterator = -1;
    clearHistoryToIterator();
    saveCanvasState();
  }
}

function undo() {
  if (historyIterator === 0) {
    alert('Nothing to undo!');
    return;
  }
  var canvas = document.getElementById('drawing').getContext('2d');
  historyIterator -= 1;
  canvas.putImageData(canvasHistory[historyIterator], 0, 0);
}

function redo() {
  if (canvasHistory.length - historyIterator < 2) {
    alert('Nothing to redo!');
    return;
  }
  var canvas = document.getElementById('drawing').getContext('2d');
  historyIterator += 1;
  canvas.putImageData(canvasHistory[historyIterator], 0, 0);
}

function convertCanvas(format) {
  return $('canvas').getCanvasImage(format);
}

function chcolor() {
  drawColor = prompt("New color for drawing", drawColor);
}

function chtype() {
  thickness = prompt("New brush thickness", thickness);
}

function share(service) {
  switch (service) {
  case 'twitter':
    alert('Share on Twitter not yet implemented.');
    break;
  case 'facebook':
    alert('Share on Facebook not yet implemented.');
    break;
  case 'google':
    alert('Share on Google Plus not yet implemented.');
    break;
  case 'instagram':
    alert('Share on Instagram not yet implemented.');
    break;
  case 'dribble':
    alert('Share on Dribble not yet implemented.');
    break;
  default:
    alert('Done diggity not found');
    break;
  }
}

var uploadXhr;

function upload(endpoint) {
  switch (endpoint) {
  case 'drive':
    alert('Upload to Google Drive not yet implemented.');
    break;
  case 'dropbox':
    alert('Upload to Dropbox not yet implemented.');
    break;
  case 'imgur':
    $("#dialog-upload").dialog("open");
    var dataUrl = document.getElementById('drawing').toDataURL().split(',')[1];
    uploadXhr = $.post('http://api.imgur.com/2/upload.json',
                       { image: dataUrl, key: '3bb2539daf5c6689003a63dafd56d304', type: 'base64'},
                       function onReceive(data) {
     $("#dialog-upload").dialog("close");
      prompt('Copy this URL below to the image', data.upload.links.imgur_page + '.png');
    }).fail(function onFail() {
      alert('Image upload failed. Try again later.');
    });
    break;
  default:
    alert('Done diggity not found');
    break;
  }
}

$(function() {
  $("#upload-progress").progressbar({
    value: false
  });
  $("#dialog-upload").dialog({
    modal: true,
    buttons: {
      Cancel: function() {
        uploadXhr.abort();
        $(this).dialog( "close" );
      }
    }
  });
  $("#dialog-upload").dialog("close");
});

function download(format) {
  window.open(convertCanvas(format), '_blank');
}

function hide(menu) {
  $('.controls .secondary ' + menu).hide('slow');
  $('.controls .secondary').hide('slow');
  $('.controls .primary').show('slow');
}

function show(menu) {
  $('.controls .secondary ' + menu).show('slow');
  $('.controls .primary').hide('slow');
  $('.controls .secondary').show('slow');
}
// @license-end
