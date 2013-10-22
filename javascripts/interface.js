var drawingWidth = 750;
var drawingHeight = 500;
jQuery(document).ready(function() {
  //var drawingWidth = parseInt(prompt('Drawing width in pixels?'));
  //var drawingHeight = parseInt(prompt('Drawing height in pixels?'));
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
}
