var particles;
var font;
var topText = 'Click to explode.';
var topTextSize = 36;
var mainText = title;
console.log(title);
var mainTextSize = 160;
var isEscape = false;

var particleText = 'Aderant';
var count = 0;

var escapeMag = 1.5;

function preload() {
    font = loadFont('/fonts/AvenirNextLTPro-Demi.otf');
}

function setup() {
    createCanvas(1200, 600);
    smooth();
    cursor(CROSS);

    particles = [];

    var bounds = font.textBounds(mainText, 0, 0, mainTextSize);
    var position = createVector((width/2 - bounds.w/2), (height/2 + bounds.h/2));

    var points = font.textToPoints(mainText, position.x, position.y, mainTextSize);

    points.forEach(function (pt) {
        var particle = new Particle(pt.x, pt.y, 6);
        particles.push(particle);
    });

}

function draw() {
    escapeMag = document.getElementById("myRange").value/20;

    background(100);
    particles.forEach(function (particle) {
        particle.arrive();
        if (isEscape) {
            particle.escape();
        }
        particle.update();
        particle.show();
    })
}

function updateText() {
    particles = [];

    var bounds = font.textBounds(mainText, 0, 0, mainTextSize);
    var position = createVector((width/2 - bounds.w/2), (height/2 + bounds.h/2));

    var points = font.textToPoints(mainText, position.x, position.y, mainTextSize);

    points.forEach(function (pt) {
        var particle = new Particle(pt.x, pt.y, 6);
        particles.push(particle);
    });
}

function mousePressed() {
    isEscape = true;
}

function mouseReleased() {
    isEscape = false;
}

function Particle(x, y, size) {
    this.position = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.accel = createVector();
    this.maxSpeed = 10;
    this.maxForce = 1;
    this.size = size;
}

Particle.prototype.update = function () {
    this.position.add(this.vel);
    this.vel.add(this.accel);
    this.accel.mult(0);
};

Particle.prototype.show = function () {
    fill(255);
    text(particleText.charAt(count), this.position.x, this.position.y);
    count++;
    if(count >= particleText.length) count = 0;
};

Particle.prototype.arrive = function () {
    var arrive = this.arriveForce(this.target);
    arrive.mult(1);
    this.applyForce(arrive);
};

Particle.prototype.escape = function () {
    var mousePos = createVector(mouseX, mouseY);
    var escape = this.escapeForce(mousePos);
    escape.mult(6);
    this.applyForce(escape);
};

Particle.prototype.arriveForce = function (target) {
    var desired = p5.Vector.sub(target, this.position);
    var distance = desired.mag();
    var speed = this.maxSpeed;
    if (distance < 200) {
        speed = map(distance, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
};

Particle.prototype.escapeForce = function (target) {
    var desired = p5.Vector.sub(target, this.position);
    var distance = desired.mag();
    if (distance < 50) {
        desired.setMag(this.maxSpeed);
        desired.mult(-escapeMag);
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    } else {
        return createVector();
    }
};

Particle.prototype.applyForce = function (force) {
  this.accel.add(force);
};