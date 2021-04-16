var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFed,time;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy_dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


  lastFed = database.ref('FeedTime');
  lastFed.on("value",getTime);
}

function draw() {
  background(46,139,87);
  foodObj.display();

  textSize(16);
  fill(255,255,0);
  //write code to read fedtime value from the database 

  if(time >= 12){
    text(`Last fed at ${time-12} PM`,350,30);
  }else if (time == 0){
    text("Last fed at 12 AM",350,30);
  }else{
    text(`Last fed at ${time} AM`,350,30);
  }
 
  //write code to display text lastFed time here

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function getTime(data){
  time = data.val();
  foodObj.getFedTime(time);
}

function feedDog(){
  if(foodObj.getFoodStock() > 0){
  dog.addImage(happyDog);

  foodObj.deductFood();
  foodS--;

  database.ref('/').update({
    Food:foodS
  });
  
  time = hour();

  foodObj.getFedTime(lastFed);

  database.ref('/').update({
    FeedTime : time
  })
  //write code here to update food stock and last fed time
  }
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
