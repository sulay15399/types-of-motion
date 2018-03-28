var mySceneTLX = 0.0;
var mySceneTLY = 3.0;
var mySceneBRX = 4.0;
var mySceneBRY = 0.0;

myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;
var wheel,fan,isWheel=1,isSpring=1,isPendulum=1;
var wheelView,wheelModel;
var fanView,fanModel;
var isCircularButton=0, isRectilinearButton=0, isPeriodicButton=0;
var currentTime,accumulator,time;
var dt1=0.0001;

function createInitialText(text,x,y,z,w) {
	var bitmap = document.createElement('canvas');
	var g = bitmap.getContext('2d');
	bitmap.width = 1024;
	bitmap.height = 1024;
	console.log("Canvas");
	console.log(bitmap);
	g.fillStyle = '#ffffff';
	g.fillRect(0,0,bitmap.width,bitmap.height);
	g.font = 'Bold 100px Arial';
	g.fillStyle = '#000000';
	g.fillText(text, 10,360);
	var texture = new THREE.Texture(bitmap)
	texture.needsUpdate = true;
	var myGeometry = new THREE.BoxGeometry(w,w,0.0001);
	var myMaterial = new THREE.MeshBasicMaterial({map: texture});
	var textBox = new THREE.Mesh(myGeometry,myMaterial);
	textBox.position.set(x,y,z);

	function addToScene(){
		PIEaddElement(textBox);
	};

	function remove(){
		PIEscene.remove(textBox);
	};

	return {
		addToScene: addToScene,
		remove: remove,
	}
}

function createLearningText(text,x,y,z) {
	var bitmap = document.createElement('canvas');
	var g = bitmap.getContext('2d');
	bitmap.width = 1024;
	bitmap.height = 1024;
	console.log("Canvas");
	console.log(bitmap);
	g.fillStyle = '#ffffff';
	g.fillRect(0,0,bitmap.width,bitmap.height);
	g.font = 'Bold 100px Arial';
	g.fillStyle = '#000000';
	g.fillText(text, 10,360);
	var texture = new THREE.Texture(bitmap)
	texture.needsUpdate = true;
	var myGeometry = new THREE.BoxGeometry(2,1,0.0001);
	var myMaterial = new THREE.MeshBasicMaterial({map: texture});
	var textBox = new THREE.Mesh(myGeometry,myMaterial);
	textBox.position.set(x,y,z);

	function addToScene(){
		PIEaddElement(textBox);
	};

	function remove(){
		PIEscene.remove(textBox);
	};

	return {
		addToScene: addToScene,
		remove: remove,
	}
}

function getTimeInSeconds() {
	return new Date().getTime() / 1000;
}

function WheelView(x,y,z){
	init();
	function init(){
		var loader = new THREE.TextureLoader();
		var wheelMaterial = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map : loader.load('wheel.png'),
			depthWrite: false,
			alphaTest: 0.5
		});
		wheelMaterial.overdraw = true;

		wheel = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),wheelMaterial);

		move(x,y,z);
	}

	function addToScene(){
		PIEaddElement(wheel);
	}

	function remove(){
		PIEscene.remove(wheel);
	}

	function move(xp,yp,zp){
		wheel.position.set(xp,yp,zp);
	}

	function reset(){
		wheel.rotation.z=0;
	}

	return {
		addToScene: addToScene,
		move: move,
		remove : remove,
		reset : reset
	}
}

function WheelModel(){
	function updateView(){
		wheel.rotation.z+=0.02;
	}

	return {
		updateView: updateView,
	}
}

function addWheel(a){
	wheelView = WheelView(a,myCenterY,-2.0)
	wheelModel = WheelModel();
	wheelView.addToScene();
}

function FanView(x,y,z){
	init();
	function init(){
		var loader = new THREE.TextureLoader();
		var fanMaterial = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map : loader.load('fan.jpg'),
			depthWrite: false,
			alphaTest: 0.5
		});
		fanMaterial.overdraw = true;

		fan = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),fanMaterial);

		move(x,y,z);
	}

	function addToScene(){
		PIEaddElement(fan);
	}

	function remove(){
		PIEscene.remove(fan);
	}

	function move(xp,yp,zp){
		fan.position.set(xp,yp,zp);
	}

	function reset(){
		fan.rotation.z=0;
	}

	return {
		addToScene: addToScene,
		move: move,
		remove : remove,
		reset : reset
	}
}

function FanModel(){
	function updateView(){
		fan.rotation.z+=0.05;
	}

	return {
		updateView: updateView
	}
}

function addFan(a){
	fanView = FanView(a,myCenterY,-2.0)
	fanModel = FanModel();
	fanView.addToScene();
}

var theta = Math.PI / 2, v = 0, L = 0.9, gamma = 0.01;
function PendulumView(L, x, y, z, theta0, sphereColor) {
	var sphere, line, yAxis;
	init();

	function init() {
		var sphereGeometry = new THREE.SphereGeometry(0.2, 10, 10);
		var sphereMaterial = new THREE.MeshPhongMaterial({ color: sphereColor });
						
		sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

		var lineGeometry = new THREE.Geometry();
		var lineMaterial = new THREE.LineBasicMaterial({color: "rgb(255,0,0)", linewidth: 1});

		lineGeometry.vertices.push(new THREE.Vector3(x, y, z));
		lineGeometry.vertices.push(new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z));

		line = new THREE.Line(lineGeometry, lineMaterial);

		var axisGeometry = new THREE.Geometry();
		var axisMaterial = new THREE.LineDashedMaterial({color: "rgb(150,150,150)", linewidth: 2});
		
		axisGeometry.vertices.push(new THREE.Vector3(x, y, z));
		axisGeometry.vertices.push(new THREE.Vector3(x, 0, z));

		yAxis  = new THREE.Line(axisGeometry, axisMaterial);

		move(theta0);					
	};

	function addToScene() {
		PIEaddElement(sphere);
		PIEaddElement(line);
		PIEaddElement(yAxis);
	};

	function move(theta) {					
		sphere.position.x = x + L*Math.sin(theta);
		sphere.position.y = y - L* Math.cos(theta);

		line.geometry.vertices[1].x = sphere.position.x;
		line.geometry.vertices[1].y = sphere.position.y;
		line.geometry.verticesNeedUpdate = true;
	};

	function remove(){
		PIEscene.remove(sphere);
		PIEscene.remove(line);
		PIEscene.remove(yAxis);
	};

	function reset(){
		move(theta0);
	};

	return {
		addToScene: addToScene,
		move: move,
		remove: remove,
		reset: reset,
	}
}

function PendulumModel(view, g, L, theta, v, gamma) {				
	var theta, v, thetaNew, vNew;
			
	function calculateTimeStep(dt) {
		thetaNew  = theta + v*dt;
		vNew = v + (- g / L * Math.sin(theta)) * dt;	

		theta = thetaNew;
		v = vNew;
	};

	function updateView() {
		view.move(theta);
	};

	return {
		calculateTimeStep: calculateTimeStep,
		updateView: updateView,
	}
}
var pendulumModel,pendulumView;
function addPendulum(a){
	pendulumView = PendulumView(L, a, 2, 0, theta, "rgb(255,0,0)");
	pendulumModel = PendulumModel(pendulumView, 9.81, L, theta, v, gamma);
	pendulumView.addToScene();
	currentTime = getTimeInSeconds();
	accumulator = 0;
	time = 0;
	var clock = new THREE.Clock();
}

var myEarth,mySun;
function EarthView(mySunRadius,myEarthRadius,a){
	init();
	var myEarthX   = a+1;
    var myEarthY   = myCenterY;
    var myEarthZ   = -2.0;
    var mySunX     = a;
    var mySunY     = myCenterY;
    var mySunZ     = -2.0;
	function init(){
		var loader = new THREE.TextureLoader();

		var geometry = new THREE.SphereGeometry( mySunRadius, 32, 32 );
    	var material = new THREE.MeshPhongMaterial();
    	material.map = loader.load("sunmap.jpg");
    	mySun = new THREE.Mesh( geometry, material );
    	move(mySun,mySunX,mySunY,mySunZ);

    	geometry = new THREE.SphereGeometry( myEarthRadius, 15, 15 );
    	material = new THREE.MeshPhongMaterial();
    	material.map = loader.load("earthmap4k.jpg");
    	myEarth = new THREE.Mesh( geometry, material );
    	move(myEarth,myEarthX,myEarthY,myEarthZ);
	};

	function addToScene(){
		PIEaddElement(mySun);
    	PIEaddElement(myEarth);
	};

	function move(object,xp,yp,zp){
		object.position.set(xp,yp,zp);
	}

	function remove(){
		PIEscene.remove(mySun);
		PIEscene.remove(myEarth);
	};

	function reset(){
		move(mySun,mySunX,mySunY,mySunZ);
		move(myEarth,myEarthX,myEarthY,myEarthZ);
	};

	function rotate(object){
		object.rotation.z+=0.001;
	};

	return {
		addToScene: addToScene,
		remove: remove,
		reset: reset,
		move: move,
		rotate: rotate,
	}
}

function EarthModel(view,a){
	var newx,newy;
	function calculateTimeStep(t){
		newy=myCenterY + (1*Math.sin(t/1000));
		newx=a + (1*Math.cos(t/1000));
	};

	function updateView(){
		view.move(myEarth,newx,newy,-2);
		view.rotate(myEarth);
		view.rotate(mySun);
	};

	return {
		calculateTimeStep: calculateTimeStep,
		updateView: updateView,
	}
}
var earthModel,earthView;
function addEarth(a){
	earthView=EarthView(0.6,0.1,a);
	earthModel=EarthModel(earthView,a);
	earthView.addToScene();
}

var L0 = 0.5, stretch = -0.5, k = 6, b = 0.1, m = 1;
function SimpleSpringView(xp, yp, zp, L0, stretch, sphereColor) {
	var cube, line, yAxis;
	var nodes = 15;
	var CUBE_SIZE = 0.5, DELTA_X = 0.25;
	init();

	function init() {
		var cubeGeometry = new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);	
		var cubeMaterial = new THREE.MeshPhongMaterial({ color: sphereColor });
						
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial );
		cube.position.x = xp;
		cube.position.z = zp;

		var lineGeometry = new THREE.Geometry();
		var lineMaterial = new THREE.LineBasicMaterial({color: "rgb(255,0,0)", linewidth: 1});

		var deltaY2 = (cube.position.y + 0.5 * CUBE_SIZE - yp) / (nodes + 1) * 0.5;
		lineGeometry.vertices.push(new THREE.Vector3(xp, yp, zp));

		var sign = 1, mult = 1;
		for (var i = 1 ; i < (nodes + 1) ; i++) {	
			lineGeometry.vertices.push(new THREE.Vector3(xp + sign * DELTA_X , yp + mult * deltaY2, zp));
			sign *= -1;
			mult += 2;
		}
		lineGeometry.vertices.push(new THREE.Vector3(xp, yp + (mult - 1) * deltaY2, zp));

		line = new THREE.Line(lineGeometry, lineMaterial);

		var yAxisGeometry = new THREE.Geometry();
		yAxisGeometry.vertices.push(new THREE.Vector3(xp, yp, zp));
		yAxisGeometry.vertices.push(new THREE.Vector3(xp, 0, zp));

		yAxis  = new THREE.Line(yAxisGeometry, new THREE.LineDashedMaterial({color: "rgb(100,250,100)", linewidth: 0.5}));

		move(stretch);					
	};

	function addToScene() {
		PIEaddElement(cube);
		PIEaddElement(line);
		PIEaddElement(yAxis);
	};

	function move(stretch) {				
		cube.position.y = yp - L0 - stretch;

		var deltaY2 = (cube.position.y + 0.5 * CUBE_SIZE - yp)/(nodes + 1)*0.5;

		var index = 1, mult = 1;
		for (var i = 1 ; i <= (nodes + 1) ; i++) {
			line.geometry.vertices[index].y = yp + mult * deltaY2;
			mult += 2;
			index++;
		}
		line.geometry.vertices[nodes + 1].y = yp + (mult - 1) * deltaY2;

		line.geometry.verticesNeedUpdate = true;
	};

	function remove(){
		PIEscene.remove(cube);
		PIEscene.remove(line);
		PIEscene.remove(yAxis);
	};

	function reset(){
		move(stretch);
	};

	return {
		addToScene: addToScene,
		move: move,
		remove: remove,
		reset: reset,
	}
}

function SimpleSpringModel(view, k, m, y, v) {				
	var y, v, yNew, vNew;
			
	function calculateTimeStep(dt) {
		yNew  = y + v*dt;
		vNew = v + (-k / m * y) * dt;	

		y = yNew;
		v = vNew;
	};

	function updateView() {
		view.move(y);
	};

	return {
		calculateTimeStep: calculateTimeStep,
		updateView: updateView,
	}
}

var simpleSpringView,simpleSpringModel;
function addSpring(a){
	simpleSpringView = SimpleSpringView(a, 2, -2, L0, stretch, "rgb(255,0,0)"); 
	simpleSpringModel = SimpleSpringModel(simpleSpringView, k, m, stretch, 0); 
	simpleSpringView.addToScene();
}

var orangeRadius = 0.2,g=9.8,vy=0,orange;
var wallThickness = 0.2;
function OrangeView(orangeRadius){
	init();

	function init(){
		var loader = new THREE.TextureLoader();

		var sphereGeometry = new THREE.SphereGeometry(orangeRadius,32,32);
		var sphereMaterial = new THREE.MeshPhongMaterial({color : "rgb(255,0,0)"});
    	orange = new THREE.Mesh( sphereGeometry, sphereMaterial);
    	move(-0.6, myCenterY+1, -2.0);
	};

	function addToScene(){
		PIEaddElement(orange);
	};

	function move(xp,yp,zp){
	    orange.position.set(xp, yp, zp);
	};

	function remove(){
		PIEscene.remove(orange);
	};

	function reset(){
		move(-0.6, myCenterY+1, -2.0);
		vy=0;
	};

	return {
		addToScene: addToScene,
		move: move,
		remove: remove,
		reset: reset,
	}
}

function OrangeModel(view){
	var xa,ya,za;
	function calculateTimeStep(dt){
		xa = orange.position.x;
		ya = orange.position.y;
		za = orange.position.z;           
		var newY;                     
		var newVY;                 
		var changeY;        
		var boundaryT;
		var tempT;      
		var e=0.9;         

		if(ya>=mySceneBRY+orangeRadius){
		    changeX   = 1;
		    changeY   = 1;
		    boundaryT = dt / 1000.0;    

		    newY = ya + vy * boundaryT + 0.5 * (-g) * boundaryT * boundaryT;
		
		    if (newY <= (mySceneBRY + orangeRadius)){  
		        tempT = ((-vy) - Math.sqrt(vy * vy + 2 * (-g) * ((mySceneBRY + orangeRadius) - ya))) / g;
		    }
		    if (tempT == boundaryT) { changeY = -1; vy = e * vy;}
		    if (tempT < boundaryT)  { changeY = -1; boundaryT = tempT ; vy = e * vy;}
		    if (changeY == 1)
		    {
		        newVY = (vy - g * boundaryT);
		        if ((newVY * vy) < 0)
		        {   
		        	tempT = (-vy) / (-g);
		        	if (tempT < boundaryT)  { boundaryT = tempT }
		        }
		    }
		    ya  = (ya + vy * boundaryT + 0.5 * -g * boundaryT * boundaryT);
		    vy = (vy + -g * boundaryT) * changeY;

		    boundaryT *= 1000;
	    	if (boundaryT < dt) { PIEadjustAnimationTime(dt - boundaryT); }

	    	view.move(xa,ya,za);
    	}
	};

	function updateView(){
		view.move(xa,ya,za);
	};

	return {
		calculateTimeStep: calculateTimeStep,
		updateView: updateView,
	}
}

var orangeModel,orangeView;
function addOrange(){
	orangeView = OrangeView(orangeRadius);
	orangeModel = OrangeModel(orangeView);
	orangeView.addToScene();
}

function changeCircular(){
	if(isWheel==0){
		fanView.remove();
		addWheel(myCenterX);
		wheelView.reset();
		CircularButton.innerHTML="Example 2";
		isWheel=1;
	}
	else{
		wheelView.remove();
		addFan(myCenterX);
		fanView.reset();
		CircularButton.innerHTML = "Example 1";
		isWheel=0;
	}
	PIEstopAnimation();
	resetExperiment();
}

function circularButton(){
	CircularButton = document.createElement( 'button' );
   	CircularButton.style.position = 'absolute';
   	CircularButton.style.top = window.innerWidth*8/20 + "px";
   	CircularButton.style.right = window.innerHeight*9.8/10 + "px";
   	CircularButton.style.width = 7 + "%";
   	CircularButton.style.height = 10 + "%";
   	CircularButton.style.value = "abc";
   	CircularButton.style.background = '#d3d3d3';
   	CircularButton.style.color = '#000';
   	if(isWheel==1) CircularButton.innerHTML = "Example 2";
   	else CircularButton.innerHTML = "Example 1";
   	CircularButton.addEventListener("click",changeCircular);
    document.body.appendChild(	CircularButton );
}

function changeRectilinear(){
	if(isSpring==0){
		orangeView.remove();
		addSpring(-0.6);
		simpleSpringView.reset();
		RectilinearButton.innerHTML="Example 2";
		isSpring=1;
	}
	else{
		simpleSpringView.remove();
		addOrange();
		orangeView.reset(-0.6);
		RectilinearButton.innerHTML = "Example 1";
		isSpring=0;
	}
	PIEstopAnimation();
	resetExperiment();
}

function rectilinearButton(){
	RectilinearButton = document.createElement( 'button' );
   	RectilinearButton.style.position = 'absolute';
   	RectilinearButton.style.top = window.innerWidth*8/20 + "px";
   	RectilinearButton.style.right = window.innerHeight*16.25/10 + "px";
   	RectilinearButton.style.width = 7 + "%";
   	RectilinearButton.style.height = 10 + "%";
   	RectilinearButton.style.value = "abc";
   	RectilinearButton.style.background = '#d3d3d3';
   	RectilinearButton.style.color = '#000';
   	if(isSpring==0) RectilinearButton.innerHTML = "Example 1";
   	else RectilinearButton.innerHTML = "Example 2";
   	RectilinearButton.addEventListener("click",changeRectilinear);
    document.body.appendChild(	RectilinearButton );
}

function changePeriodic(){
	if(isPendulum==0){
		earthView.remove();
		addPendulum(4);
		pendulumView.reset();
		PeriodicButton.innerHTML="Example 2";
		isPendulum=1;
	}
	else{
		pendulumView.remove();
		addEarth(4.75);
		earthView.reset();
		PeriodicButton.innerHTML = "Example 1";
		isPendulum=0;
	}
	PIEstopAnimation();
	resetExperiment();
}

function periodicButton(){
	PeriodicButton = document.createElement( 'button' );
   	PeriodicButton.style.position = 'absolute';
   	PeriodicButton.style.top = window.innerWidth*8/20 + "px";
   	PeriodicButton.style.right = window.innerHeight*3/10 + "px";
   	PeriodicButton.style.width = 7 + "%";
   	PeriodicButton.style.height = 10 + "%";
   	PeriodicButton.style.value = "abc";
   	PeriodicButton.style.background = '#d3d3d3';
   	PeriodicButton.style.color = '#000';
   	if(isSpring==0) PeriodicButton.innerHTML = "Example 1";
   	else PeriodicButton.innerHTML = "Example 2";
   	PeriodicButton.addEventListener("click",changePeriodic);
    document.body.appendChild(	PeriodicButton );
}
var circularText;
function addTypes(){
	circularButton();
	if(isWheel==1) addWheel(myCenterX);
	else addFan(myCenterX);
	if(isCircularButton==1) document.body.removeChild(CircularButton);
	else{ 
		document.body.appendChild(CircularButton);
		isCircularButton=1;
	}
	rectilinearButton();
	if(isSpring==1) addSpring(-0.6);
	else addOrange();
	if(isRectilinearButton==1) document.body.removeChild(RectilinearButton);
	else{ 
		document.body.appendChild(RectilinearButton);
		isRectilinearButton=1;
	}
	periodicButton();
	if(isPendulum==1) addPendulum(4);
	else addEarth(4.75);
	if(isPeriodicButton==1) document.body.removeChild(PeriodicButton);
	else{ 
		document.body.appendChild(PeriodicButton);
		isPeriodicButton=1;
	}
	circularText= createInitialText("Circular",myCenterX+0.25,myCenterY+1.5,-2,1);
	circularText.addToScene();
	periodicText= createInitialText("Periodic",myCenterX+3.5,myCenterY-1.25,-2,1);
	periodicText.addToScene();
	rectilinearText= createInitialText("Rectilinear",myCenterX-3,myCenterY-1.25,-2,1);
	rectilinearText.addToScene();
}

function removeCircular(){
	if(isWheel==1) wheelView.remove();
	else fanView.remove();
	if(isCircularButton==1) document.body.removeChild(CircularButton);
	isCircularButton=0;
}

function removeRectilinear(){
	if(isSpring==1) simpleSpringView.remove();
	else orangeView.remove();
	if(isRectilinearButton==1) document.body.removeChild(RectilinearButton);
	isRectilinearButton=0;
}

function removePeriodic(){
	if(isPendulum==1) pendulumView.remove();
	else earthView.remove();
	if(isPeriodicButton==1) document.body.removeChild(PeriodicButton);
	isPeriodicButton=0;
}

function removeTypes(){
	removeCircular();
	removeRectilinear();
	removePeriodic();
	circularText.remove();
	periodicText.remove();
	rectilinearText.remove();
}

function createCorrectText(text,x,y,z) {
	var bitmap = document.createElement('canvas');
	var g = bitmap.getContext('2d');
	bitmap.width = 1024;
	bitmap.height = 1024;
	console.log("Canvas");
	console.log(bitmap);
	g.fillStyle = '#ffffff';
	g.fillRect(0,0,bitmap.width,bitmap.height);
	g.font = 'Bold 75px Arial';
	g.fillStyle = '#000000';
	g.fillText(text, 10,360);
	var texture = new THREE.Texture(bitmap)
	texture.needsUpdate = true;
	var myGeometry = new THREE.BoxGeometry(3,1,0.0001);
	var myMaterial = new THREE.MeshBasicMaterial({map: texture});
	var textBox = new THREE.Mesh(myGeometry,myMaterial);
	textBox.position.set(x,y,z);

	function addToScene(){
		PIEaddElement(textBox);
	};

	function remove(){
		PIEscene.remove(textBox);
	};

	return {
		addToScene: addToScene,
		remove: remove,
	}
}

var correct,isFinished=0;
function isPeriodic(){
	if(random==5 || random==6){
		removeButtons();
		correct=createCorrectText("You are right",myCenterX+0.75,myCenterY-2,-2);
		correct.addToScene();
		isFinished=1;
	}
	else{
		pButton.innerHTML="Wrong Ans";
	}
}

function isRectilinear(){
	if(random==3 || random==4){
		removeButtons();
		correct=createCorrectText("You are right",myCenterX+0.75,myCenterY-2,-2);
		correct.addToScene();
		isFinished=1;
	}
	else{
		rButton.innerHTML="Wrong Ans";
	}
}

function isCircular(){
	if(random==2 || random==1){
		removeButtons();
		correct=createCorrectText("You are right",myCenterX+0.75,myCenterY-2,-2);
		correct.addToScene();
		isFinished=1;
	}
	else{
		cButton.innerHTML="Wrong Ans";
	}
}

var pButton=document.createElement('button');
var cButton=document.createElement('button');
var rButton=document.createElement('button');
function addButtons(object,text,x,y){
   	object.style.position = 'absolute';
   	object.style.top = window.innerWidth*x/20 + "px";
   	object.style.right = window.innerHeight*y/10 + "px";
   	object.style.width = 7 + "%";
   	object.style.height = 5 + "%";
   	object.style.value = "abc";
   	object.style.background = '#d3d3d3';
   	object.style.color = '#000';
   	object.innerHTML = text;
    document.body.appendChild(	object );
}

function removeButtons(){
	if(isLearn==1 && isFinished==0){
		document.body.removeChild(pButton);
		document.body.removeChild(rButton);
		document.body.removeChild(cButton);
	}
}

var random;
function learningAnimation(){
	random = Math.floor((Math.random() * 6) + 1);
	console.log(random);
	switch(random){
		case 1: isWheel=1;
				addWheel(myCenterX);
				break;
		case 2: isWheel=0;
				addFan(myCenterX);
				break;
		case 3: isSpring=1;
				addSpring(myCenterX);
				break;
		case 4: isSpring=0;
				addOrange();
				orangeView.move(myCenterX,myCenterY,-2);
				break;
		case 5: isPendulum=0;
				addEarth(myCenterX);
				earthView.reset();
				break;
		case 6: isPendulum=1;
				addPendulum(myCenterX);
				break; 
	}
}

var learningText,isLearn=0;
function addLearning(){
	isLearn=1;
	addButtons(pButton,"Periodic",8,3);
	addButtons(cButton,"Circular",8,9.8);
	addButtons(rButton,"Rectilinear",8,16.25);
	pButton.addEventListener("click",isPeriodic);
	cButton.addEventListener("click",isCircular);
	rButton.addEventListener("click",isRectilinear);
	
	learningAnimation();
	learningText=createLearningText("What type is this?",myCenterX,myCenterY+1.75,-4);
	learningText.addToScene();
}

function removeLearning(){
	if(isLearn==1){ 
		learningText.remove();
		removeButtons();
	switch(random){
		case 1: if(isWheel==1){
					wheelView.remove();
				}
				break;
		case 2: if(isWheel==0){
					fanView.remove();
				}
				break;
		case 3: if(isSpring==1){
					simpleSpringView.remove();
				}
				break;
		case 4: if(isSpring==0){
					orangeView.remove();
				}
				break;
		case 5: if(isPendulum==0){
					earthView.remove();
				}
				break;
		case 6: if(isPendulum==1){
					pendulumView.remove();
				}
				break; 
	}
	if(isFinished==1){
		correct.remove();
		isFinished=0;
	}
}
	isLearn=0;
}

function resetLearning(){
	removeLearning();
	addLearning();
	isFinished=0;
}

var wheelBonus;
function WheelBonusView(x,y,z){
	init();
	function init(){
		var loader = new THREE.TextureLoader();
		var wheelMaterial = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map : loader.load('wheel.png'),
			depthWrite: false,
			alphaTest: 0.5
		});
		wheelMaterial.overdraw = true;

		wheelBonus = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),wheelMaterial);

		move(x,y,z);
	}

	function addToScene(){
		PIEaddElement(wheelBonus);
	}

	function remove(){
		PIEscene.remove(wheelBonus);
	}

	function move(xp,yp,zp){
		wheelBonus.position.set(xp,yp,zp);
	}

	function reset(){
		wheelBonus.rotation.z=0;
		move(-1,myCenterY,-2);
	}

	return {
		addToScene: addToScene,
		move: move,
		remove : remove,
		reset : reset,
	}
}

function WheelBonusModel(){
	var myBallX,myBallY,myBallZ;
	function calculateTimeStep(dt){
		myBallX = wheelBonus.position.x;
		myBallY = wheelBonus.position.y;
		myBallZ = wheelBonus.position.z;                  
		var boundaryT;
		var tempT;
		var myBallVX=0;
		var myBallAX=20; 
    	boundaryT = dt / 1000.0;

    	myBallX  = (myBallX + myBallVX * boundaryT + 0.5 * myBallAX * boundaryT * boundaryT);
    	myBallVX = (myBallVX + myBallAX * boundaryT);

    	if(myBallX>=myCenterX-0.5) PIEstopAnimation();
	};

	function updateView(){
		wheelBonus.rotation.z-=0.02;
		wheelBonus.position.set(myBallX,myBallY,myBallZ);
	};

	return {
		calculateTimeStep: calculateTimeStep,
		updateView: updateView,
	}
}

var wheelBonusView,wheelBonusModel;
function addWheelBonus(a){
	wheelBonusView = WheelBonusView(a,myCenterY,-2.0);
	wheelBonusModel = WheelBonusModel();
	wheelBonusView.addToScene();
}

var isBonus=0;
function addBonus(){
	addWheelBonus(-1);
	isBonus=1;
	addClock(4);
}
var clock,hand;
function ClockView(x,y,z){
	init();
	function init(){
		var loader = new THREE.TextureLoader();
		var clockMaterial = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map : loader.load('clock.jpg'),
			depthWrite: false,
			alphaTest: 0.5
		});
		clockMaterial.overdraw = true;

		var handMaterial = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map : loader.load('secondHand.png'),
			depthWrite: false,
			alphaTest: 0.5
		});
		handMaterial.overdraw = true;

		clock = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),clockMaterial);
		hand = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),handMaterial);

		move(x,y,z);
	}

	function addToScene(){
		PIEaddElement(clock);
		PIEaddElement(hand);
	}

	function remove(){
		PIEscene.remove(clock);
		PIEscene.remove(hand);
	}

	function move(xp,yp,zp){
		clock.position.set(xp,yp,zp);
		hand.position.set(xp,yp,zp);
	}

	function reset(){
		clock.rotation.z=0;
		hand.rotation.z=0;
	}

	return {
		addToScene: addToScene,
		move: move,
		remove : remove,
		reset : reset
	}
}

function ClockModel(){
	function updateView(){
		hand.rotation.z-=Math.sin(1/360);
	}

	return {
		updateView: updateView,
	}
}

function addClock(a){
	clockView = ClockView(a,myCenterY,-2.0)
	clockModel = ClockModel();
	clockView.addToScene();
}

function removeBonus(){
	if(isBonus==1){
		wheelBonusView.remove();
		clockView.remove();
		isBonus=0;
	}
}

function resetBonus(){
	wheelBonusView.reset();
	clockView.reset();
}

function checkTypes(){
	PIEchangeInputCheckbox("Bonus",false);
	PIEchangeDisplayCheckbox("Bonus",false);
	PIEchangeInputCheckbox("Learn",false);
	PIEchangeDisplayCheckbox("Learn",false);
	removeTypes();
	removeLearning();
	removeBonus();
	PIEstopAnimation();
	addTypes();
	PIErender();
}

function checkLearning(){
	PIEchangeInputCheckbox("Bonus",false);
	PIEchangeDisplayCheckbox("Bonus",false);
	PIEchangeInputCheckbox("Types of motion",false);
	PIEchangeDisplayCheckbox("Types of motion",false);
	removeTypes();
	removeBonus();
	removeLearning();
	PIEstopAnimation();
	addLearning();
	PIErender();
}

function checkBonus(){
	PIEchangeInputCheckbox("Types of motion",false);
	PIEchangeDisplayCheckbox("Types of motion",false);
	PIEchangeInputCheckbox("Learn",false);
	PIEchangeDisplayCheckbox("Learn",false);
	removeTypes();
	removeLearning();
	removeBonus();
	PIEstopAnimation();
	addBonus();
	PIErender();
}

function loadExperimentElements(){
	PIEsetExperimentTitle("Types of motion");
	PIEsetDeveloperName("Sulay Shah");

	initialiseHelp();
	initialiseInfo();

	PIEscene.background = new THREE.Color( 0xffffff );
	PIEaddInputCheckbox("Types of motion", true, checkTypes);
    PIEaddInputCheckbox("Bonus", false, checkBonus);
    PIEaddInputCheckbox("Learn",false,checkLearning);

    addTypes();
	resetExperiment();
	PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
}

function resetExperiment(){
	if(isWheel==1) wheelView.reset();
	else fanView.reset();
	if(isSpring==1) simpleSpringView.reset();
	else orangeView.reset();
	if(isPendulum==1) pendulumView.reset();
	else earthView.reset();
	time=0;
	if(isLearn==1) resetLearning();
	if(isBonus==1) resetBonus();
}

function updateExperimentElements(t,dt){
	if(isWheel==1) wheelModel.updateView();
	else fanModel.updateView();
	if(isSpring==0){
		orangeModel.calculateTimeStep(dt);
		orangeModel.updateView();
	}
	if(isPendulum==0){
		earthModel.calculateTimeStep(t);
		earthModel.updateView();
	}
	if(isBonus==1){
		wheelBonusModel.calculateTimeStep(dt);
		wheelBonusModel.updateView();
		clockModel.updateView();
	}
	newTime = getTimeInSeconds();
	frameTime = newTime - currentTime;
        currentTime = newTime;

        accumulator += frameTime;

	while (accumulator >= dt1) {
		pendulumModel.calculateTimeStep(dt1);
		simpleSpringModel.calculateTimeStep(dt1);
		accumulator -= dt1;
		time += dt1;
	}
	pendulumModel.updateView();
	simpleSpringModel.updateView();
}

var helpContent;
function initialiseHelp(){
	helpContent="";
	helpContent=helpContent + "<h2>Types of motion</h2>";
	helpContent = helpContent + "<h3>About the experiment</h3>";
	helpContent = helpContent + "<p>The experiment shows 3 scenes.</p>";
	helpContent = helpContent + "<ol><li>Examples of Motion</li><li>Bonus</li><li>Learn</li></ol>";
	helpContent = helpContent + "<p>It has 3 types of Examples.</p>";
	helpContent = helpContent + "<ol><li>Rectilinear Motion</li><li>Circular Motion</li><li>Periodic Motion</li></ol>";
	helpContent = helpContent + "<p>The next example can be seen by clicking the button below the example.</p>";
	helpContent = helpContent + "<p>The bonus scene shows some complex day to day animations.</p>";
	helpContent = helpContent + "<p>In the learning scene, we have to give the type of motion and it will say if we are right or wrong.<p>";
	helpContent = helpContent + "<h3>Animation controls</h3>";
	helpContent = helpContent + "<p>The animation controls are given in the top bar of the scene.</p>";
	helpContent = helpContent + "<p>You can enter the animation stage by clicking the start button</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>The round button is for resetting the animation.</p>";
    helpContent = helpContent + "<h3>The learning stage</h3>";
    helpContent = helpContent + "<p>Select the correct answer by clicking the corresponding button and according to your choice some output will be printed.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";

	PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo(){
	infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>Types of motion</h3>";
    infoContent = infoContent + "<ol><li>Rectilinear Motion</li><li>Circular Motion</li><li>Periodic Motion</li></ol>";
    infoContent = infoContent + "<h3>Rectilinear Motion</h3>";
    infoContent = infoContent + "<p>The motion in which object move along a Straight Line is called rectilinear motion.</p>";
    infoContent = infoContent + "<p>eg. Ball falling from sky</p>";
    infoContent = infoContent + "<h3>Circular Motion</h3>";
    infoContent = infoContent + "<p>The motion in which object moves in a Circular Path is called circular motion.</p>";
    infoContent = infoContent + "<p>eg. wheel spinning</p>";
    infoContent = infoContent + "<h3>Periodic Motion</h3>";
    infoContent = infoContent + "<p>The motion in which object repeats its motion after certain time is called periodic motion.</p>";
    infoContent = infoContent + "<p>eg. Pendulum, Earth revolving around Sun</p>";
    infoContent = infoContent + "<h3>Bonus</h3>";
    infoContent = infoContent + "<ol><li>Rolling Wheel(circular & rectilinear)</li><li>Clock(circular & periodic)</li></ol>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";

	PIEupdateInfo(infoContent);
}