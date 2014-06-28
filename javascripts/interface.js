/*jslint browser: true, node: true, indent: 2, plusplus: true*/
/*global $, jQuery, alert, prompt, Dropbox, ArrayBuffer, Uint8Array, atob*/
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

function clearCanvas() {
  var context = document.getElementById('drawing').getContext('2d');
  context.fillStyle = "rgb(255, 255, 255)";
  context.fillRect(0, 0, drawingWidth, drawingHeight);
}

function drawSample() {
  clearCanvas();
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
    clearCanvas();
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

var uploadXhr;
var dbclient = new Dropbox.Client({ key: "ybhbcc7n7korjqf" });
dbclient.authDriver(new Dropbox.AuthDriver.Popup({
  // We need a SSL cert and CloudFlare pro for this to work on our own domain
  receiverUrl: "https://cmastudios.me/oauth-receiver-dropbox.html"
}));
var xhrListener = function (dbXhr) {
  uploadXhr = dbXhr;
};
dbclient.onXhr.addListener(xhrListener);

function makeid(length) {
  var i, text = "", possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function str2ab(str) {
  var i, strLen, buf = new ArrayBuffer(str.length), bufView = new Uint8Array(buf);
  for (i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function getCanvasDataPNG64() {
  return document.getElementById('drawing').toDataURL().split(',')[1];
}

function dbError(error) {
  $("#dialog-upload").dialog("close");
  switch (error.status) {
  case Dropbox.ApiError.NETWORK_ERROR:
    alert("No internet connection");
    break;
  case Dropbox.ApiError.INVALID_TOKEN:
    alert("Session expired, please try again");
    break;
  case Dropbox.ApiError.OVER_QUOTA:
    alert("You do not have enough space in your Dropbox.");
    break;
  case Dropbox.ApiError.RATE_LIMITED:
    alert("You've uploaded too many images to Dropbox recently! Please try again later");
    break;
  default:
    alert("Unknown error occured.\nPlease try again later");
  }
}

function dbUpload() {
  $("#dialog-upload").dialog("open");
  dbclient.authenticate(function (error, client) {
    if (error) {
      return dbError(error);
    }
    // 1. Get Base64 PNG data. 2. Decode base64. 3. Convert string to byte array
    var imgData = str2ab(atob(getCanvasDataPNG64())), filename = makeid(7) + ".png";
    dbclient.writeFile(filename, imgData, function (error, stat) {
      if (error) {
        return dbError(error);
      }
      $("#dialog-upload").dialog("close");
      $("#dialog-upload-result-text").html("Saved as " + filename);
      $("#dialog-upload-result").dialog();
    });
  });
}

function imUpload() {
  $("#dialog-upload").dialog("open");
  $.ajax({
    url: 'https://api.imgur.com/3/image',
    method: 'POST',
    headers: {
      Authorization: "Client-ID 20a71f2a6043b3b",
      Accept: 'application/json'
    },
    data: {
      image: getCanvasDataPNG64(),
      type: 'base64'
    },
    success: function imgurSuccess(result) {
      $("#dialog-upload").dialog("close");
      var link = "https://imgur.com/" + result.data.id;
      $("#dialog-upload-result-text").html("<a href='" + link + "' target='_blank'>" + link + "</a>");
      $("#dialog-upload-result").dialog();
    },
    error: function imgurFail(jqXHR, status, error) {
      $("#dialog-upload").dialog("close");
      switch (status) {
      case "timeout":
        alert("Failed to connect to imgur");
        break;
      default:
        alert("Failure to upload to imgur");
      }
    }
  });

}

$(function () {
  $("#upload-progress").progressbar({
    value: false
  });
  $("#dialog-upload").dialog({
    modal: true,
    buttons: {
      Cancel: function () {
        uploadXhr.abort();
        $(this).dialog("close");
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

function unsupported() {
  alert("Unsupported action");
}

$(function () {
  $("#menu").click(function () {
    show(".menu");
  });

  $("#brush").click(function () {
    show(".brush");
  });

  $("#share").click(function () {
    show(".share");
  });

  $("#upload").click(function () {
    show(".upload");
  });

  $("#download").click(function () {
    show(".download");
  });

  $(".back").click(function () {
    hide(".menu");
    hide(".brush");
    hide(".share");
    hide(".upload");
    hide(".download");
  });

  $("#resize").click(resize);
  $("#undo").click(undo);
  $("#redo").click(redo);
  $("#chcolor").click(chcolor);
  $("#chtype").click(chtype);
  $("#facebook").click(unsupported);
  $("#twitter").click(unsupported);
  $("#google").click(unsupported);
  $("#dribble").click(unsupported);
  $("#instagram").click(unsupported);
  $("#drive").click(unsupported);
  $("#imgur").click(imUpload);
  $("#dropbox").click(dbUpload);

  $("#png").click(function () {
    download("png");
  });

  $("#jpeg").click(function () {
    download("jpeg");
  });
});
// @license-end
