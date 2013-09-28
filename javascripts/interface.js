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
    $.post("http://api.imgur.com/2/upload.json",
	   { image: dataUrl, key: "3bb2539daf5c6689003a63dafd56d304", type: "base64"}, function(data) {
	       alert(data.upload.links.imgur_page + ".png");
	   })
	.fail(function() {
	    alert("Error uploading image!");
	});
}
