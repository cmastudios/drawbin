jQuery(document).ready(function() {
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
}