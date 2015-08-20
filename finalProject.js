var game;
var background;
var tank;   
var currentTank=0;
var score=0;
var checkScore=false;
var NUM_BULLETS= 10;
var currentBullet=0;
var delay= 0.5;
var a=0;
var tankPlayer=false;
var degrees=0;
var NUM_ENEMIES=5;
var MY_INDEX=6;
var carWins=false;
var tankWins = false;
//TANKS CLASS
function Tank(){
    tTank = new Sprite(game, "tankBase.png", 32 , 32);
    tTurret = new Turret(); 
    tTank.setPosition(45,45);
    tTank.setBoundAction(STOP); 
    tTank.setSpeed(0);
    //UPDATE FUNCTION
    tTank.updateTank=function(){
        this.update();
        tTurret.setNewPosition(this.x,this.y);
        if(tankPlayer){
            if(document.mouseX===undefined || document.mouseY===undefined){
                degrees=0;
            }else{
                diffX = this.x - document.mouseX;
                diffY = this.y - document.mouseY;
                radians = Math.atan2(diffY, diffX);
                degrees = radians * 180 / Math.PI;
            }
        }
        tTurret.setNewAngle(degrees);
        tTurret.updateTurret();
    }
    
    //MOVING THE TANK
    tTank.moveUp=function(){
        this.setPosition(this.x,this.y-5);
        tTurret.setNewPosition(this.x,this.y-5);
    }
    tTank.moveDown=function(){
        this.setPosition(this.x,this.y+5);
        tTurret.setNewPosition(this.x,this.y+5);
    }
    tTank.moveLeft=function(){
        this.setPosition(this.x-5,this.y);
        tTurret.setNewPosition(this.x-5,this.y);
    }
    tTank.moveRight=function(){
        this.setPosition(this.x+5,this.y);
        tTurret.setNewPosition(this.x+5,this.y);
    }
    tTank.getAngle=function(){
        return tTurret.getImgAngle();
    }
    tTank.setNewPosition= function(x,y){
        this.setPosition(x,y);
        tTurret.setNewPosition(x,y);
    }
    tTank.setNewAngle=function(angle1){
        this.setImgAngle(angle1);
    }
    tTank.getTankAngle=function(){
        return this.getImgAngle();
    }
    return tTank;
} 
//TURRET CLASS
function Turret(){
    tempTurret = new Sprite(game, "tankTurret.png", 32, 32);
    tempTurret.setPosition(45,45);
    tempTurret.setBoundAction(CONTINUE);
    tempTurret.setSpeed(0);
    tempTurret.setAngle(0);
    tempTurret.setNewPosition=function(x,y){
        this.setPosition(x,y);
    }
    tempTurret.setNewAngle=function(angle){
        this.setAngle(angle);
    }
    tempTurret.updateTurret=function(){
        this.update();
    }
    return tempTurret;

}
//BULLETS CLASS
function Bullet(){
    tBullet = new Sprite(game, "bullet.png", 16, 16);   
    tBullet.setBoundAction(DIE);
    tBullet.hide();
    tBullet.setPosition(1000,1000);
    tBullet.fire = function(){
        this.setAngle(myTank.getAngle()-90); 
        this.show();      
        this.setSpeed(10);
        this.setPosition(myTank.x,myTank.y);           
    }     
    return tBullet;
}


function makeMyBullets(){
    bullets = new Array(NUM_BULLETS);
    for (i = 0; i < NUM_BULLETS; i++){
        bullets[i] = new Bullet();
        bullets[i].setBoundAction(DIE);
    } 
}
//UPDATE THE BULLETS
function updateBullets(){
    for (i = 0; i < NUM_BULLETS; i++){
        if(tankPlayer){
            sendBulletData(i);
        }
        bullets[i].update();

    } 
}  

function init(){
    
    game = new Scene();
	timer = new Timer();
    explosion = new Sound("explosion.mp3");
    background = new Sprite(game, "finalBG.png", 800, 600);
    car = new Sprite(game, "car.png",32,32);
    car.setPosition(755,555);
    car.setSpeed(0);
    background.setSpeed(0);
	background.setPosition(400, 300);
    myTank= new Tank();
    makeMyBullets();

    document.getElementById("sceneGoesHere").style.visibility = 'hidden';
} // end init
function run(){
    document.getElementById("sceneGoesHere").style.visibility = 'visible';
    document.getElementById("startGameButton").style.visibility = 'hidden';
    game.start();
}
function update(){
    game.clear();
    if(tankWins || carWins){
        if(tankWins){
            if(tankPlayer){
                sendAlertTank();
            }
            explosion.play();
            alert("Tank Wins!");
        }else{
            if(tankPlayer){
                sendAlertCar();
            }
            alert("Car Wins!");
        }
    }else{
        if(tankPlayer){
            sendTankData();
            checkWins();
        }else{
            sendCarData();
        }
        checkKeys();     
        background.update(); 
        output = "Score: " + myTank.x + "<br />"+myTank.y;  
        stats.innerHTML = output;
        updateBullets();
        myTank.updateTank(); 
        car.update();
        
    }

} // end update
function checkSpace(){
    elapsedTime = timer.getElapsedTime();
    if (keysDown[K_SPACE]){
        if (elapsedTime > delay){
            //increment bullet number
            currentBullet++;
            if (currentBullet >= NUM_BULLETS){
                currentBullet=0;
            }
            bullets[currentBullet].fire();
            timer.reset(); 
            
             // end currentBall if
                //fire the new bullet    
        }
    }
}
function checkKeys(){                                                          
    elapsedTime = timer.getElapsedTime();
    if(tankPlayer){
        if(keysDown[K_W]){
            myTank.setAngle(90);
            myTank.moveUp();
        }else if(keysDown[K_S]){
            myTank.setAngle(270);
            myTank.moveDown();
        }else if(keysDown[K_D]){
            myTank.setAngle(180);
            myTank.moveRight();
        }else if(keysDown[K_A]){
            myTank.setAngle(0);
            myTank.moveLeft();
        }
        checkSpace();
    }else{
        if(keysDown[K_W]){
            car.setAngle(0);
            car.setPosition(car.x,car.y-5);
        }else if(keysDown[K_S]){
            car.setAngle(180);
            car.setPosition(car.x,car.y+5);
        }else if(keysDown[K_D]){
            car.setAngle(90);
            car.setPosition(car.x+5,car.y);
        }else if(keysDown[K_A]){
            car.setAngle(270);
            car.setPosition(car.x-5,car.y);
        }
    }
}
function checkWins(){
    for (i = 0; i < NUM_BULLETS; i++){
        if(bullets[i].collidesWith(car)){
            tankWins=true;
        }
    } 
    if(car.x<=100){
        carWins=true;
    }
}
var socket = io('http://ec2-54-148-103-224.us-west-2.compute.amazonaws.com:9000');
function getPlayerData(){
    socket.emit('queryServer');
}
function sendBulletData(index){

    socket.emit('bulletData', index, bullets[index].x, bullets[index].y);
}
function sendTankData(){

    socket.emit('tankData', myTank.x, myTank.y, myTank.getAngle(), myTank.getTankAngle());
}
function sendCarData(){
    socket.emit('carData',car.x,car.y, car.getImgAngle());
}
function sendAlertTank(){
    socket.emit('tankWins');
}
function sendAlertCar(){
    socket.emit('carWins');
}
socket.on('queryAnswer', function(ans){
    if(tankPlayer===false){
        tankPlayer=ans;
    }    

});
socket.on('carNumber', function(currentPlayer){
    MY_INDEX=currentPlayer;
});
socket.on('tankData', function(x, y, angle, angle2){
    if(!tankPlayer){
        myTank.setNewPosition(x,y);
        myTank.setNewAngle(angle2)
        degrees=angle;   
    }
});
socket.on('carWins', function(){
    carWins=true;
});
socket.on('tankWins', function(){
    tankWins=true;
});
socket.on('carData', function(x,y, angle){
    if(tankPlayer){
        car.setPosition(x,y);
        car.setImgAngle(angle);
    }
});
socket.on('bulletData', function(index,x,y){
    if(!tankPlayer){
        bullets[index].show();
        bullets[index].setPosition(x,y);
    }
});
window.addEventListener("beforeunload", function () {

    if(tankPlayer){
        socket.emit('tankPlayerLeft');
    }
    return null;
});
 