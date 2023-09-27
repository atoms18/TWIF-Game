
function Space(x, y) {
  this.position = createVector(x, y);

  this.block_placed;
  this.is_block_placed = false;
  this.floating_stuff;
  this.is_stuff_available = false;

  this.stuff_gap = [6, 6];
  this.mouseIsOnSpace = false;
  this.floodfill_checked = false;

  this.present_color = null;
  // let border_color = main_color.map((x) => x+8);
  this.draw = function(pos_x, pos_y) {
    // push();
    // stroke(border_color);
    // strokeWeight(5);
    // fill(this.present_color);
    // rect(pos_x, pos_y, space_size, space_size);
    // pop();

    if(this.present_color !== null) {
      push();
      fill(this.present_color);
      rect(pos_x, pos_y, space_size, space_size);
      pop();
    }

    if(this.is_stuff_available) {
      this.floating_stuff.draw(pos_x+this.stuff_gap[0], pos_y+this.stuff_gap[1]);
    }

    let space_rect = {
      x: pos_x,
      y: pos_y,
      width: space_size,
      height: space_size
    }
    if(Utils.pointInRectangle(mouseX, mouseY, space_rect)) {
      this.mouseIsOnSpace = true;
    } else {
      this.mouseIsOnSpace = false;
    }
    
    if(!this.is_block_placed) {
      if(main_map.player.inventory.isHolding(Block)) {
        if(this.mouseIsOnSpace) {
		  let dist = this.position.dist(main_map.player.position);
		  if(dist <= 5) {
			  let holding_stuff = main_map.player.inventory.getHoldingStuff();
			  holding_stuff[0].amount_of_shadowblur = 0;
			  holding_stuff[0].setSize(space_size - holding_stuff[0].border);
			  holding_stuff[0].draw(pos_x, pos_y, true);
			  if (mouseIsPressed) {
				if (mouseButton === LEFT) {
				  this.is_block_placed = true;
				  this.block_placed = holding_stuff[0];
				  holding_stuff.shift();
				}
			  }  
		  }
        }
      }
    } else {
      this.block_placed.draw(pos_x, pos_y, true);

      /*let player_circle = {
        x: main_map.player.canvas_position.x,
        y: main_map.player.canvas_position.y,
        radius: main_map.player.radius
      };
      let block_rect = {
        x: pos_x,
        y: pos_y,
        halfWidth: space_size*0.5,
        halfHeight: space_size*0.5
      };

      let is_collision = Utils.rectCircleOverlap(block_rect, player_circle);
      if(is_collision !== false) {
        if(is_collision === 1) {
          main_map.player.position.x = main_map.player.prev_position.x;
          main_map.player.collision_axis = "x";
        } else if(is_collision === 2) {
          main_map.player.position.y = main_map.player.prev_position.y;
          main_map.player.collision_axis = "y";
        } else {
          if(main_map.player.collision_axis == "x") {
            main_map.player.position.x = main_map.player.prev_position.x;
          }
          if(main_map.player.collision_axis == "y") {
            main_map.player.position.y = main_map.player.prev_position.y;
          }
        }
      }*/
    }
  }

  this.setFloatingStuff = function(stuff) {
    this.floating_stuff = stuff;
    this.is_stuff_available = true;

    let w_gap_max = (space_size-this.floating_stuff.size) - this.stuff_gap[0];
    let h_gap_max = (space_size-this.floating_stuff.size) - this.stuff_gap[1];
    this.stuff_gap[0] = max(this.stuff_gap[0], random() * w_gap_max);
    this.stuff_gap[1] = max(this.stuff_gap[1], random() * h_gap_max);
  }

  this.setBackgroundColor = function(color) {
    this.present_color = color;
  }
}
