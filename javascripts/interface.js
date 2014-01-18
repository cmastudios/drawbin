/*jslint browser: true*/
/*global $, jQuery, alert*/
"use strict";
var drawingWidth = 750;
var drawingHeight = 500;
function drawSample() {
    jQuery('#drawing').drawArc({
        fillStyle: 'orange',
        x: 75,
        y: 75,
        radius: 50
    });
}
jQuery(document).ready(function onLoad() {
    jQuery('#drawing').width(drawingWidth);
    jQuery('#drawing').height(drawingHeight);
    jQuery('.container').css('width', drawingWidth + 0.05 * jQuery(window).width());
    drawSample();
});

jQuery(window).on('resize', function onResize() {
    jQuery('.container').css('width', drawingWidth + 0.05 * jQuery(window).width());
});

function resize() {
    alert('Not implemented yet.');
}

function convertCanvas(format) {
    return jQuery('canvas').getCanvasImage(format);
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
    default:
        alert('Done diggity not found');
        break;
    }
}

function download(format) {
    window.location = convertCanvas(format);
}

function hide(menu) {
    jQuery('.controls .secondary ' + menu).hide('slow');
    jQuery('.controls .secondary').hide('slow');
    jQuery('.controls .primary').show('slow');
}

function show(menu) {
    jQuery('.controls .secondary ' + menu).show('slow');
    jQuery('.controls .primary').hide('slow');
    jQuery('.controls .secondary').show('slow');
}
