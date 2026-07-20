let scene,camera,renderer;
let controls;

let keys={};

let bullets=[];
let enemies=[];

let hp=100;
let ammo=30;
let kills=0;


scene=new THREE.Scene();
scene.background=new THREE.Color(0x87ceeb);


camera=new THREE.PerspectiveCamera(
75,
innerWidth/innerHeight,
0.1,
1000
);


renderer=new THREE.WebGLRenderer();
renderer.setSize(
innerWidth,
innerHeight
);

document.body.appendChild(renderer.domElement);


// FPS

controls=new THREE.PointerLockControls(
camera,
document.body
);

scene.add(
controls.getObject()
);


document.body.onclick=()=>{
controls.lock();
};


// 바닥

let floor=new THREE.Mesh(
new THREE.PlaneGeometry(200,200),
new THREE.MeshBasicMaterial({
color:0x228822
})
);

floor.rotation.x=-Math.PI/2;
scene.add(floor);


// 벽 생성

function wall(x,z){

let w=new THREE.Mesh(
new THREE.BoxGeometry(5,5,1),
new THREE.MeshBasicMaterial({
color:0x555555
})
);

w.position.set(x,2.5,z);

scene.add(w);

}


for(let i=0;i<10;i++){

wall(
Math.random()*40-20,
-20
);

}



// 적 생성

function spawnEnemy(){

let e=new THREE.Mesh(
new THREE.BoxGeometry(1,2,1),
new THREE.MeshBasicMaterial({
color:0xff0000
})
);


e.position.set(
Math.random()*30-15,
1,
Math.random()*-50
);


e.hp=50;

scene.add(e);

enemies.push(e);

}


for(let i=0;i<8;i++)
spawnEnemy();




// 이동

document.addEventListener(
"keydown",
e=>{
keys[e.code]=true;
});


document.addEventListener(
"keyup",
e=>{
keys[e.code]=false;
});




// 총

document.addEventListener(
"mousedown",
()=>{


if(ammo<=0)return;


ammo--;

document.getElementById("ammo").innerHTML=ammo;



let b=new THREE.Mesh(
new THREE.SphereGeometry(.05),
new THREE.MeshBasicMaterial({
color:0xffff00
})
);


b.position.copy(camera.position);


let dir=new THREE.Vector3();

camera.getWorldDirection(dir);

b.dir=dir;


scene.add(b);

bullets.push(b);


});



// 재장전

document.addEventListener(
"keydown",
e=>{

if(e.code==="KeyR"){

ammo=30;

document.getElementById("ammo").innerHTML=ammo;

}

});





function update(){


// 이동

if(controls.isLocked){

if(keys["KeyW"])
controls.moveForward(.15);

if(keys["KeyS"])
controls.moveForward(-.15);

if(keys["KeyA"])
controls.moveRight(-.15);

if(keys["KeyD"])
controls.moveRight(.15);

}



// 총알

for(let i=bullets.length-1;i>=0;i--){

let b=bullets[i];

b.position.add(
b.dir.clone().multiplyScalar(1)
);



for(let j=enemies.length-1;j>=0;j--){

if(
b.position.distanceTo(
enemies[j].position
)<1
){

enemies[j].hp-=25;

scene.remove(b);
bullets.splice(i,1);


if(enemies[j].hp<=0){

scene.remove(
enemies[j]
);

enemies.splice(j,1);

kills++;

document.getElementById("kills").innerHTML=kills;

spawnEnemy();

}

break;

}

}


}



// 적 AI

for(let e of enemies){

let dir=new THREE.Vector3();

dir.subVectors(
camera.position,
e.position
);

dir.normalize();


e.position.add(
dir.multiplyScalar(.01)
);



if(
e.position.distanceTo(camera.position)<2
){

hp-=0.1;

document.getElementById("hp").innerHTML=
Math.floor(hp);


if(hp<=0){

alert("GAME OVER");

location.reload();

}

}

}


}



function animate(){

requestAnimationFrame(animate);

update();

renderer.render(
scene,
camera
);

}


camera.position.y=2;


animate();




window.onresize=()=>{

camera.aspect=
innerWidth/innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
innerWidth,
innerHeight
);

};
