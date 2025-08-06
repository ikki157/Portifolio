function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('background-canvas-container'); 
    canvas.style('display', 'block');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    window.addEventListener('resize', () => {
        resizeCanvas(windowWidth, windowHeight);
    });
}

function draw() {
    background('rgba(15, 23, 42, 0.9)');
    stroke(100, 149, 237, 80); 
    strokeWeight(2);

    for (let i = 0; i < 100; i++) {
        let x = (noise(i, frameCount * 0.005) * width) % width;
        let y = (noise(i + 100, frameCount * 0.005) * height) % height;
        point(x, y);
    }
}