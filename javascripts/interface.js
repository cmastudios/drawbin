$(document).ready(function () {
    fillPlaceholder();
});

function fillPlaceholder() {
    var canvas = document.getElementById("drawing");
    var context = canvas.getContext("2d");

    context.font = "36px Verdana";
    context.fillStyle = "#000000";
    context.fillText("HTML5 Canvas Text", 50, 50);

    context.font = "normal 36px Arial";
    context.strokeStyle = "#000000";
    context.strokeText("HTML5 Canvas Text", 50, 90);
}

function upload() {
    var fd = new FormData();
    var canvas = document.getElementById("drawing");
    var dataUrl = canvas.toDataURL().split(",")[1];
    fd.append("image", dataUrl); // Append the file
    fd.append("key", "3bb2539daf5c6689003a63dafd56d304");
    fd.append("type", "base64");
    //var xhr = new XMLHttpRequest();
    //xhr.open("POST", "http://api.imgur.com/2/upload.json"); // Boooom!
    //xhr.onload = function () {
//	alert(JSON.parse(xhr.responseText).upload.links.imgur_page + ".png");
  //  }
    //xhr.send(fd);
    $.post("http://api.imgur.com/2/upload.json",
	   { image: dataUrl, key: "3bb2539daf5c6689003a63dafd56d304", type: "base64"}, function(data) {
	alert(data.upload.links.imgur_page + ".png");
    })
	.done(function() {
	    alert( "second success" );
	})
	.fail(function() {
	    alert( "error" );
	})
	.always(function() {
	    alert( "finished" );
	});
}
