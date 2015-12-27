/**
 * Created by brian on 12/26/15.
 */

var canvasWidth = 800;
var canvasHeight = 600;
var paths = new Array();
var pathsTrash = new Array();
var paint;
var strokeStyle = "red";
var strokeSize = 5;
var lastPath = -1;
var canvas;
var context;

function startPath(x, y) {
    // on drawing a new path, delete paths trash
    pathsTrash = [];
    context.beginPath();
    context.moveTo(x, y);
    context.strokeStyle = strokeStyle;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = strokeSize;
    paint = true;
    paths.push(new Array());
    lastPath = paths.length - 1;
    paths[lastPath].push(strokeStyle, strokeSize);
    paths[lastPath].push(x, y);
}

function continuePath(x, y) {
    if (paint) {
        context.lineTo(x, y);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
        paths[lastPath].push(x, y);
    }
}

function stopPath() {
    paint = false;
    paths[lastPath].push(-1, -1);
}

function reDraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // console.log("starting redraw of paths");

    for (var i = 0; i < paths.length; i++) { // each path
        // console.log("path number " + i);
        for (var j = 0; j < paths[i].length; j += 2) {  // each point on path
            // console.log("   point number " + j);

            if (paths[i][j] == -1) break; // stopping condition

            // console.log("       made it past stopping condition with value " + paths[i][j]);
            switch (j) {
                case 0: // init settings
                    context.beginPath();
                    context.strokeStyle = paths[i][j];
                    context.lineWidth = paths[i][j + 1];
                    // console.log("       setting stroke style to " + paths[i][j] + " and width to " + paths[i][j + 1]);
                    break;
                case 2: // first point
                    context.moveTo(paths[i][j], paths[i][j + 1]);
                    // console.log("       Setting initial point: " + paths[i][j] + ", " + paths[i][j + 1]);
                    break;
                default: // other points
                    context.lineTo(paths[i][j], paths[i][j + 1]);
                    context.stroke();
                    // console.log("       Stroke to " + paths[i][j] + ", " + paths[i][j + 1]);
                    if (paths[i][j + 2] != -1) { // If the next point exists
                        context.beginPath();
                        context.moveTo(paths[i][j], paths[i][j + 1]);
                        // console.log("       next point exists, to next from " + paths[i][j] + ", " + paths[i][j + 1]);
                    }
                    break;
            }
        }
    }
}

function undoPath() {
    if (lastPath > -1) {
        pathsTrash.push(paths[lastPath]);
        paths.splice(lastPath, 1);
        lastPath = paths.length - 1;
        reDraw();
    }
}

function redoPath() {
    if (pathsTrash.length > 0) {
        paths.push(pathsTrash[pathsTrash.length - 1]);
        pathsTrash.splice(pathsTrash.length - 1, 1);
        lastPath = paths.length - 1;
        reDraw();
    }
}

jQuery(document).ready(function ($) {

    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");

    // Event handlers
    // inside document.ready() to ensure elements exist

    $('#canvas').mousedown(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        startPath(mouseX, mouseY);
    });

    $('#canvas').mousemove(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        continuePath(mouseX, mouseY);
    });

    $('#canvas').mouseup(function (e) {
        if (paint) stopPath();
    });

    $('#canvas').mouseleave(function (e) {
        if (paint) stopPath();
    });

    $('#undo').click(function (e) {
        undoPath();
    });

    $('#redo').click(function (e) {
        redoPath();
    });

    $('#reDraw').click(function (e) {
        reDraw();
    });
});
