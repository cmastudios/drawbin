/*jslint browser: true, node: true, indent: 2*/
/*global $, jQuery, alert, prompt*/
// @license magnet:?xt=urn:btih:5305d91886084f776adcf57509a648432709a7c7&dn=x11.txt MIT
"use strict";
var drawingWidth = 750;
var drawingHeight = 500;
function drawSample() {
  $('#drawing').drawArc({
    fillStyle: 'orange',
    x: 75,
    y: 75,
    radius: 50
  });
}
var currentlyDrawing = false, lastMouseX = 0, lastMouseY = 0, drawColor = "black", thickness = 5;
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
}
function onCanvasMouseMove(event) {
  if (!currentlyDrawing) {
    return;
  }
  var mouseX, mouseY, context = event.target.getContext("2d");
  if (event.offsetX) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else if (event.layerX) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }
  context.beginPath();
  context.moveTo(lastMouseX === 0 ? mouseX : lastMouseX, lastMouseY === 0 ? mouseY : lastMouseY);
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
  var dimensions = prompt('WARNING: Resize will clear the drawing\nCanvas dimensions', drawingWidth + "x" + drawingHeight).split("x"),
    newWidth = parseInt(dimensions[0], 10),
    newHeight = parseInt(dimensions[1], 10);
  if (isNaN(newWidth) || isNaN(newHeight)) {
    alert('Invalid input');
  } else {
    drawingWidth = newWidth;
    drawingHeight = newHeight;
    $('#drawing').attr({width: drawingWidth, height: drawingHeight});
    $('.container').css('width', drawingWidth + 0.05 * $(window).width());
  }
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

function upload(endpoint) {
  switch (endpoint) {
  case 'drive':
    alert('Upload to Google Drive not yet implemented.');
    break;
  case 'dropbox':
    alert('Upload to Dropbox not yet implemented.');
    break;
  case 'imgur':
    var dataUrl = document.getElementById('drawing').toDataURL().split(',')[1];
    $.post('http://api.imgur.com/2/upload.json', { image: dataUrl, key: '3bb2539daf5c6689003a63dafd56d304', type: 'base64'}, function onReceive(data) {
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
