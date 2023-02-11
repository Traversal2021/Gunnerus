const leftEle = document.getElementById('container');
const rightEle = document.getElementById('graph_container');

// The current position of mouse
let MouseX = 0;
let MouseY = 0;
// The dimension of the element
let LeftWidth = 0;
let RightWidth = 0;

// Handle the mousedown event
// that's triggered when user drags the resizer
const mouseDownHandler = function (e) {
    // Get the current mouse position
    MouseX = e.clientX;
    MouseY = e.clientY;

    // Calculate the dimension of element
    const LeftStyles = window.getComputedStyle(leftEle);
    const RightStyles = window.getComputedStyle(rightEle);
    LeftWidth = parseInt(LeftStyles.width);
    RightWidth = parseInt(RightStyles.width);

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};


const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - MouseX;

    // Adjust the dimension of element
    let newLeftWidth = LeftWidth + dx;
    let newRightWidth = window.innerWidth -newLeftWidth;
    console.log(newLeftWidth);
    leftEle.style.width = `${newLeftWidth}px`;
    rightEle.style.width = `${newRightWidth}px`;

};

const mouseUpHandler = function () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};
// Query all resizers
const resizers = leftEle.querySelectorAll('.resizer-r');


// Loop over them
[].forEach.call(resizers, function (resizer) {
    resizer.addEventListener('mousedown', mouseDownHandler);
});