/**
 * Created by brian on 12/26/15.
 */

var canvasWidth = 800;
var canvasHeight = 600;
var paths = new Array();
var paint;
var strokeStyle = "red";
var strokeSize  = 5;
var lastPath;

jQuery( document ).ready(function( $ ) {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    function startPath (x,y) {
        context.beginPath();
        context.moveTo(x,y);
        context.strokeStyle = strokeStyle;
        context.lineJoin = "round";
        context.lineWidth = strokeSize;
        paint = true;
        paths.push(new Array());
        lastPath = paths.length - 1;
        paths[lastPath].push(strokeStyle,strokeSize);
        paths[lastPath].push(x,y);
    }

    function continuePath (x,y) {
        if (paint) {
            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x,y);
            paths[lastPath].push(x,y);
        }
    }

    function stopPath () {
        paint = false;
        paths[lastPath].push(-1,-1);
    }

    // Event handlers

    $('#canvas').mousedown(function(e){
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        startPath(mouseX, mouseY);
    });

    $('#canvas').mousemove(function(e){
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        continuePath(mouseX,mouseY);
    });

    $('#canvas').mouseup(function(e){
        if (paint) stopPath();
    });

    $('#canvas').mouseleave(function(e){
        if (paint) stopPath();
    });
});