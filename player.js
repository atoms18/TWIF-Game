
function Player(init_x, init_y) {
  this.diameter = default_player_diameter;
  this.radius = this.diameter*0.5;

  this.collision_axis;
  this.position = createVector(init_x, init_y);
  this.prev_position = this.position.copy();
  this.canvas_position = createVector(0, 0);

  this.velocity = 5;
  this.is_moving = false;
  this.total_distance = 0;

  this.inventory = new Inventory();

  this.draw = function() {
    this.canvas_position.set(width*0.5, height*0.5);
	
    this.speed = (1/frameRate())*this.velocity;
    this.half_speed = this.speed / SQRT_TWO;
  
    push();
    strokeWeight(0);
    fill(player_color);
    ellipse(this.canvas_position.x, this.canvas_position.y, this.diameter);
    pop();

    if(!this.prev_position.equals(this.position)) {
      this.is_moving = true;
      this.total_distance += this.prev_position.dist(this.position);
	  
	  let next_block = this.position.copy();
	  let direction = this.position.copy().sub(this.prev_position);
	  
	  if(direction.x > 0) {
		  next_block.x += 1;
	  } else if(direction.x < 0) {
		  next_block.x -= 1;
	  }
	  
	  if(direction.y > 0) {
		  next_block.y += 1;
	  } else if(direction.y < 0) {
		  next_block.y -= 1;
	  }
	  
	  if(next_block.x < 0) next_block.x = 0;
	  if(next_block.y < 0) next_block.y = 0;
	  if(next_block.x > total_space_over_map[0]-1) next_block.x = total_space_over_map[0]-1;
	  if(next_block.y > total_space_over_map[1]-1) next_block.y = total_space_over_map[1]-1;
	  next_block.set(round(next_block.x), round(next_block.y));
	  
	  let is_next_space_an_area = !main_map.space_with_no_area.includes(next_block.x+","+next_block.y);
	  let is_next_space_contain_block = main_map.space[next_block.x][next_block.y].is_block_placed;
	  
	  if(is_next_space_an_area && !is_next_space_contain_block) this.position.set(this.prev_position);

      this.prev_position.set(this.position);
    } else {
      this.is_moving = false;
    }
	
	/*if(test_mode){
		if(this.is_moving) {
		  print("Speed: ", this.total_distance / ((millis() - this.timers)*0.001));
		} else {
		  this.timers = millis();
		  this.total_distance = 0;
		}
	}*/


    this.keyEvent();

    /*let gap = 0.1;
    if(this.position.x < gap || this.position.x > total_space_over_map[0]-1-gap) {
      this.position.x = this.prev_position.x;
    }
    if(this.position.y < gap || this.position.y > total_space_over_map[1]-1-gap) {
      this.position.y = this.prev_position.y;
    }*/
	
	let isInMapX = true;
	let isInMapY = true;
	let setToDefaultDiameter = false;
    if(this.position.x < -1 || this.position.x > total_space_over_map[0]) {
		if(this.diameter < 0) {
			setToDefaultDiameter = true;
		} else {
			this.diameter -= 1.5;
		}
		isInMapX = false;
    }
    if(this.position.y < -1 || this.position.y > total_space_over_map[1]) {
		if(this.diameter < 0) {
			setToDefaultDiameter = true;
		} else {
			this.diameter -= 1.5;
		}
		isInMapY = false;
    }
	
	if((isInMapX && isInMapY) || setToDefaultDiameter) {
		this.diameter = default_player_diameter;
	}

    this.inventory.draw();
  }

  this.keyEvent = function() {
    let pressedw = keyIsDown(87);
    let presseda = keyIsDown(65);
    let presseds = keyIsDown(83);
    let pressedd = keyIsDown(68);

    let speed = this.speed;
    if(
      (pressedw && presseda) ||
      (presseda && presseds) ||
      (presseds && pressedd) ||
      (pressedw && pressedd)
    ) speed = this.half_speed;

    let speeds = [0, 0];
    if (pressedw) speeds[1] = -speed;
    if (presseda) speeds[0] = -speed;
    if (presseds) speeds[1] = speed;
    if (pressedd) speeds[0] = speed;
    this.position.add(speeds[0], speeds[1]);
  }

  this.keyPressed = function() {
    this.inventory.keyPressed();
  }

  this.mouseWheel = function(event) {
    this.inventory.mouseWheel(event);
  }
}
