$(document).ready(function () {
    fillPlaceholder();
});

function fillPlaceholder() {
    var canvas = document.getElementById("drawing");
    var context = canvas.getContext("2d");

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, 700, 350);

    context.font = "normal 36px Arial";
    context.fillStyle = "#000000";
    context.fillText("This is a canvas", 250, 180);
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
