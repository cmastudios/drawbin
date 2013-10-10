jQuery(document).ready(function() {
<<<<<<< HEAD
  //var drawingWidth = parseInt(prompt('Drawing width in pixels?'));
  //var drawingHeight = parseInt(prompt('Drawing height in pixels?'));
  var drawingWidth = 750;
  var drawingHeight = 500;
  jQuery('#drawing').width(drawingWidth);
  jQuery('#drawing').height(drawingHeight);
  jQuery('.container').css('width', drawingWidth + .05 * jQuery(window).width());
  drawSample();
});

jQuery(window).on('resize', function(){
  jQuery('.container').css('width', drawingWidth + .05 * jQuery(window).width());
});

function convertCanvas(format) {
  return jQuery('canvas').getCanvasImage(format);
}

function downloadMenu() {
  jQuery('.controls .primary').hide('slow');
  jQuery('.controls .secondary').show('slow');
  jQuery('.controls .secondary .download-menu').show('slow');
}

function download(format) {
  window.location = convertCanvas(format)
}

function back() {
  jQuery('.controls .secondary').hide('slow');
  jQuery('.controls .primary').show('slow');
}

function drawSample() {
  jQuery('#drawing').drawArc({
    fillStyle: 'orange',
    x: 75, y:75,
    radius: 50
  })
=======
  drawingWidth = parseInt(prompt('Drawing width in pixels?'));
  drawingHeight = parseInt(prompt('Drawing height in pixels?'));
  jQuery('#drawing').width(drawingWidth);
  jQuery('#drawing').height(drawingHeight);
  jQuery('.container').css('width', drawingWidth + .1 * jQuery(window).width());
});

jQuery(window).on('resize', function(){
  jQuery('.container').css('width', drawingWidth + .1 * jQuery(window).width());
});

function menu() {
  alert('Wow, great job! You done diggity clicked on something!');
}

function brushes() {
  alert('Wow, great job! You done diggity clicked on something!');
}

function upload() {
  alert('Wow, great job! You done diggity clicked on something!');
}

function download() {
  alert('Wow, great job! You done diggity clicked on something!');
>>>>>>> ee0998c8a13bcf648148787603817666323282b3
}