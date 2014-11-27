/*jslint browser: true, node: true, indent: 2, plusplus: true*/
/*global $, jQuery, alert, prompt, Dropbox, ArrayBuffer, Uint8Array, atob, Hammer*/
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
  $('canvas').drawText({
    fillStyle: '#222222',
    strokeStyle: '#222222',
    strokeWidth: 2,
    x: drawingWidth - 40,
    y: drawingHeight - 8,
    fontSize: 13,
    fontFamily: '"Comic Sans MS", "Ubuntu Bold", Helvetica, sans-serif',
    text: 'drawbin.com'
  });
  saveCanvasState();
}

$(window).bind('beforeunload', function () {
  if (historyIterator > 0) {
    return 'You have created a drawing.';
  }
});

var lastMouseX = 0;
var lastMouseY = 0;
var drawColor = "black";
var thickness = 5;

// Mouse and touch events, brought to you by Hammer.js. Can't touch this!
$(function () {
  var myElement = document.getElementById('drawing'),
    mc = new Hammer(myElement);

  mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  mc.on('panstart', function (ev) {
    lastMouseX = ev.pointers[0].pageX - myElement.offsetLeft;
    lastMouseY = ev.pointers[0].pageY - myElement.offsetTop;
  });
  mc.on('panmove', function (ev) {
    // Draw a continuous stroke
    var context = myElement.getContext("2d");
    context.beginPath();
    context.moveTo(lastMouseX, lastMouseY);
    lastMouseX = ev.pointers[0].pageX - myElement.offsetLeft;
    lastMouseY = ev.pointers[0].pageY - myElement.offsetTop;
    context.lineTo(lastMouseX, lastMouseY);
    context.strokeStyle = drawColor;
    context.lineCap = "round";
    context.lineWidth = thickness;
    context.stroke();
  });
  mc.on('panend', function (ev) {
    saveCanvasState();
  });
  mc.on('tap', function (ev) {
    // Draw one point in a line
    var context = event.target.getContext("2d");
    context.beginPath();
    lastMouseX = ev.pointers[0].pageX - myElement.offsetLeft;
    lastMouseY = ev.pointers[0].pageY - myElement.offsetTop;
    context.moveTo(lastMouseX, lastMouseY);
    context.lineTo(lastMouseX + 1, lastMouseY + 1);
    context.strokeStyle = drawColor;
    context.lineCap = "round";
    context.lineWidth = thickness;
    context.stroke();
    saveCanvasState();
  });
});

// Creates the canvas when the page loads
$(document).ready(function onLoad() {
  var mobile = window.matchMedia("only screen and (max-width: 760px)");
  if (mobile.matches) {
    drawingWidth = window.innerWidth - 10;
    drawingHeight = window.innerHeight - 128;
  }
  $('#drawing').attr({width: drawingWidth, height: drawingHeight});
  $('.container').css('width', drawingWidth + 0.05 * $(window).width());
  drawSample();
});

// Properly scale the relative width of the box.
// TODO ask mark about this, might be the cause of some bugs
$(window).on('resize', function onResize() {
  $('.container').css('width', drawingWidth + 0.05 * $(window).width());
});

// implements all the control buttons

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
    drawSample();
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
  $("#dialog-cpick").dialog("open");
}

function chtype() {
  thickness = prompt("New brush thickness", thickness);
}

var uploadXhr;
var dbclient = new Dropbox.Client({ key: "ybhbcc7n7korjqf" });
dbclient.authDriver(new Dropbox.AuthDriver.Popup({
  // We need a SSL cert and CloudFlare pro for this to work on our own domain
  receiverUrl: "https://dropbox.com/oauth-receiver-dropbox.html"
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
  $("#dialog-cpick").dialog({
    modal: true,
    buttons: {
      Accept: function () {
        drawColor = $("#cpick").val();
        $(this).dialog("close");
      },
      Cancel: function () {
        $("#cpick").val(drawColor);
        $(this).dialog("close");
      }
    }
  });
  $("#dialog-cpick").dialog("close");
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
