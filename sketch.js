
const canvas_size = 0;//[720, 576];
const total_space_over_map = [100, 100];
const space_size = 45;
const default_player_diameter = 60;
const test_mode = true;

const SQRT_TWO = 1.4142135623730951;

const stuffs = [
  BlockWood,
  BlockDirt,
  BlockStone,
  BlockSteel
];
const items = [
  ItemPillFirstAid,
  ItemPillEnergyDrink,
  ItemWeaponBomb,
  ItemWeaponC4
];
const main_color = [39, 54, 84];

let main_map,
    start_time,
    frame_rate = 0,
    inverse_main_color = main_color.map((x) => 255-x);

let simple_player,
    player_color = 0;

function setup() {
  start_time = millis();

  if(typeof canvas_size == "object") {
	createCanvas(canvas_size[0], canvas_size[1]);
  } else {
	createCanvas(windowWidth, windowHeight - 4);
  }

  simple_player = new Player(floor(random(total_space_over_map[0])), floor(random(total_space_over_map[1])));
  if(test_mode) {
	  for(let i = 0; i < 100; i++) {
		 simple_player.inventory.addStuff(new stuffs[0]());
		 simple_player.inventory.addStuff(new stuffs[1]());
		 simple_player.inventory.addStuff(new stuffs[2]());
		 simple_player.inventory.addStuff(new stuffs[3]());
	  }
  }
  main_map = new Map(total_space_over_map[0], total_space_over_map[1], simple_player);
}

function draw() {
  textSize(16);
  background(main_color);

  main_map.draw();

  if(millis() - start_time > 500) {
    frame_rate = int(frameRate());
    start_time = millis();
    player_color = [floor(random(255)), floor(random(255)), floor(random(255))];
  }
  push();
  fill(inverse_main_color);
  text("FPS: " + frame_rate, 10, 20);
  pop();
}

function keyPressed() {
  main_map.keyPressed();
}

function mouseReleased() {
  main_map.mouseReleased();
}

function mouseWheel(event) {
  main_map.mouseWheel(event);
}

function windowResized() {
  if(typeof canvas_size == "object") {
	resizeCanvas(canvas_size[0], canvas_size[1]);
  } else {
	resizeCanvas(windowWidth, windowHeight - 4);
  }
}
