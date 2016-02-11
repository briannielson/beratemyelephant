/*
 * Created by brian on 12/26/15.
 */

var paths = [];
var pathsTrash = [];
var pathsClear = [];
var paint;
<<<<<<< HEAD
var strokeColorSelection = "red"
var strokeColor = strokeColorSelection;
=======
var strokeColor = "grey";
>>>>>>> d88962c016b9d58ec03d40377aa8a7f7323399f9
var strokeSize = 5;
var lastPath = -1;
var canvas;
var context;
var tool = "marker";
var backgroundColor = "white";

function startPath(x, y) {
    // on drawing a new path, delete paths trash
    pathsTrash = [];
    pathsClear = [];
    context.strokeStyle = strokeColor;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = strokeSize;
    paint = true;
    paths.push([]);
    lastPath = paths.length - 1;
    paths[lastPath].push(strokeColor, strokeSize, tool);
    paths[lastPath].push(x, y);

    if (tool == "marker") {
        context.beginPath();
        context.moveTo(x, y);
    }
}

function continuePath(x, y) {
    if (paint) {
        switch (tool) {
            case "marker" :
                continueMarker(x, y);
                break;
            case "chisel" :
                continueChisel(x, y);
                break;
            case "spray" :
                continueSpray(x, y);
                break;
        }
        paths[lastPath].push(x, y);
    }
}

function stopPath() {
    paint = false;
    paths[lastPath].push(-1);
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
                    context.strokeStyle = paths[i][0];
                    context.fillStyle = paths[i][0];
                    context.lineWidth = paths[i][1];
                    j += 1;
                    // console.log("       setting stroke style to " + paths[i][j] + " and width to " + paths[i][j + 1]);
                    break;
                case 3: // first point
                    context.beginPath();
                    if (paths[i][2] == "marker") {
                        context.moveTo(paths[i][j], paths[i][j + 1]);
                    }
                    // console.log("       Setting initial point: " + paths[i][j] + ", " + paths[i][j + 1]);
                    break;
                default: // other points
                    var x = paths[i][j];
                    var y = paths[i][j + 1];
                    switch (paths[i][2]) {
                        case "marker" :
                            context.lineTo(x, y);
                            context.closePath();
                            context.stroke();
                            if (paths[i][j + 2] != -1) {
                                context.beginPath();
                                context.moveTo(x, y);
                            }
                            break;
                        case "chisel" :
                            var prevY = paths[i][j - 1];
                            var prevX = paths[i][j - 2];
                            // var brushAngle = 45; // changeable later... make global???

                            // draw a parallelogram based on prev and current points
                            var xmod = paths[i][1]; // later add mod to x and y based on rotation
                            var ymod = paths[i][1];
                            var points = [prevX - xmod, prevY - ymod, x - xmod, y - ymod, x + xmod, y + ymod, prevX + xmod, prevY + ymod];

                            context.lineWidth = 1;

                            context.moveTo(points[0], points[1]);
                            context.lineTo(points[2], points[3]);
                            context.lineTo(points[4], points[5]);
                            context.lineTo(points[6], points[7]);
                            context.lineTo(points[0], points[1]);
                            context.closePath();
                            context.fill();
                            context.stroke();
                            if (paths[i][j + 2] != -1) context.beginPath();
                            break;
                        case "spray":
                            var pressure = paths[i][1] * 5;
                            for (var k = 0; k < pressure; k++) {
                                var xMod = (Math.random() - .5) * 2 * paths[i][1]; // random between -1 and 1 * strokeSize
                                var yMod = (Math.random() - .5) * 2 * paths[i][1]; // random between -1 and 1 * strokeSize
                                context.fillRect(x + xMod, y + yMod, 1, 1);
                            }
                            break;
                    }
                    // console.log("       Stroke to " + paths[i][j] + ", " + paths[i][j + 1]);
                    break;
            }
        }
    }
}

function undoPath() {
    if (pathsClear.length > 0) {
        paths = pathsClear;
        pathsClear = [];
        lastPath = paths.length - 1;
        reDraw();
    }
    else if (lastPath > -1) {
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

function clearCanvas() {
    if (paths.length > 0) {
        pathsClear = paths;
        paths = [];
        lastPath = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function continueMarker(x, y) {
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
}

function continueChisel(x, y) {
    var prevY = paths[lastPath][paths[lastPath].length - 1];
    var prevX = paths[lastPath][paths[lastPath].length - 2];
    // console.log(prevX, prevY);
    // var brushAngle = 45; // changeable later...

    // draw a parallelogram based on prev and current points
    var xmod = strokeSize; // later add mod to x and y based on rotation
    var ymod = strokeSize;
    var points = [prevX - xmod, prevY - ymod, x - xmod, y - ymod, x + xmod, y + ymod, prevX + xmod, prevY + ymod];

    context.fillStyle = strokeColor;
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(points[0], points[1]);
    context.lineTo(points[2], points[3]);
    context.lineTo(points[4], points[5]);
    context.lineTo(points[6], points[7]);
    context.lineTo(points[0], points[1]);
    context.closePath();
    context.fill();
    context.stroke();
}

function continueSpray(x, y) {
    var pressure = strokeSize * 5;
    for (var i = 0; i < pressure; i++) {
        var xMod = (Math.random() - .5) * 2 * strokeSize; // random between -1 and 1 * strokeSize
        var yMod = (Math.random() - .5) * 2 * strokeSize; // random between -1 and 1 * strokeSize
        context.fillStyle = strokeColor;
        context.fillRect(x + xMod, y + yMod, 1, 1);
    }
}

jQuery(document).ready(function ($) {

    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");

    // Event handlers
    // inside document.ready() to ensure elements exist

    $('#canvas').css('background-color', backgroundColor
    ).mousedown(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        startPath(mouseX, mouseY);
    }).mousemove(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        continuePath(mouseX, mouseY);
    }).mouseup(function () {
        if (paint) stopPath();
    }).mouseleave(function () {
        if (paint) stopPath();
    });

    $('#undo').click(function () {
        undoPath();
    });

    $('#redo').click(function () {
        redoPath();
    });

    $('#reDraw').click(function () {
        reDraw();
    });

    $('#clear').click(function () {
        clearCanvas();
    });

    $('#marker').click(function () {
        tool = "marker";
<<<<<<< HEAD
        strokeColor = strokeColorSelection;
=======
        strokeColor = "grey";
>>>>>>> d88962c016b9d58ec03d40377aa8a7f7323399f9
    });

    $('#chisel').click(function () {
        tool = "chisel";
<<<<<<< HEAD
        strokeColor = strokeColorSelection;
=======
        strokeColor = "grey";
>>>>>>> d88962c016b9d58ec03d40377aa8a7f7323399f9
    });

    $('#spray').click(function () {
        tool = "spray";
<<<<<<< HEAD
        strokeColor = strokeColorSelection;
=======
        strokeColor = "grey";
>>>>>>> d88962c016b9d58ec03d40377aa8a7f7323399f9
    });

    $('#eraser').click(function () {
        tool = "marker";
        strokeColor = backgroundColor;
    });

    var sizeSlider = $("#slider");

    $(sizeSlider).slider({
        value: 5,
        min: 1,
        max: 30,
        step: 1,
        slide: function (event, ui) {
            $("#size").val(ui.value);
            strokeSize = ui.value;
        }
    });
    $("#size").val($(sizeSlider).slider("value"));
    strokeSize = $(sizeSlider).slider("value");
});
