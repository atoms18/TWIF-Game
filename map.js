
function Map(width_size, height_size, player) {
  this.map_image = loadImage("image/map.jpg");

  this.space = {};
  for(let j = 0; j < height_size; j++) {
    for(let i = 0; i < width_size; i++) {
      if(typeof this.space[i] === "undefined") {
        this.space[i] = {};
      }
      this.space[i][j] = new Space(i, j);
    }
  }
  this.player = player;

  if(!test_mode) {
	  let total_space_over_map_product = total_space_over_map[0]*total_space_over_map[1];

	  let total_stuff_over_map = 0.0625*total_space_over_map_product;
	  for(let k = 0; k < total_stuff_over_map; k++) {
		let index = floor(random(stuffs.length));
		let stuff = new stuffs[index]();

		this.space[stuff.position.x][stuff.position.y].setFloatingStuff(stuff);
	  }

	  let total_item_over_map = 50;
	  for(let k = 0; k < total_item_over_map; k++) {
		let index = floor(random(items.length));
		let item = new items[index]();

		let that_space = this.space[item.position.x][item.position.y];
		if(!that_space.is_stuff_available) {
		  that_space.setFloatingStuff(item);
		}
	  }
  }

  this.draw = function() {

    image(
      this.map_image,
      -this.player.position.x*space_size+width*0.5-this.player.radius+7,
      -this.player.position.y*space_size+height*0.5-this.player.radius+7
    );

    let total_space_within_canvas = [
          round(width / space_size),
          round(height / space_size)
        ],
        half_tswc = total_space_within_canvas.map((x) => round(x*0.5)),
        canvas_center_point = [
          width*0.5-space_size*0.5,
          height*0.5-space_size*0.5
        ];

    let start_x = max(0, round(this.player.position.x - half_tswc[0])-1);
    let end_x = min(total_space_over_map[0], round(this.player.position.x + half_tswc[0]+1));
    let start_y = max(0, round(this.player.position.y - half_tswc[1]));
    let end_y = min(total_space_over_map[1], round(this.player.position.y + half_tswc[1]+1));

    let each_bba = [];
    for(let last_y = start_y; last_y < end_y; last_y++) {
      for(let last_x = start_x; last_x < end_x; last_x++) {
        let pos_x = canvas_center_point[0] + (last_x - this.player.position.x)*space_size,
            pos_y = canvas_center_point[1] + (last_y - this.player.position.y)*space_size;

        each_bba.push([last_x, last_y, pos_x, pos_y]);
      }
    }
    each_bba.map((value) => {
      this.space[value[0]][value[1]].draw(value[2], value[3]);
    });

    this.player.draw();
	
	var test = (x1, y1) => {
		if(!(
			x1 < start_x ||
			y1 < start_y ||
			x1 > end_x - 1 ||
			y1 > end_y - 1
		)) {
			return !this.space[x1][y1].is_block_placed && !this.space[x1][y1].floodfill_checked;
		}
		return false;
	}
	var paint = (x1, y1, swna) => {
		swna.push(x1+","+y1);
		this.space[x1][y1].floodfill_checked = true;
	}
	
	let swnas = [];
	swnas.push(Utils.floodFillScanline(start_x, start_y, end_x, end_y, test, paint));
	swnas.push(Utils.floodFillScanline(end_x, start_y, end_x, end_y, test, paint));
	swnas.push(Utils.floodFillScanline(start_x+half_tswc[0], start_y+half_tswc[1], end_x, end_y, test, paint));
	swnas.push(Utils.floodFillScanline(start_x, end_y, end_x, end_y, test, paint));
	swnas.push(Utils.floodFillScanline(end_x-1, end_y, end_x, end_y, test, paint));
	let most_key = 0;
	let most_length = swnas[0].length;
	for(let swna = 1; swna < swnas.length; swna++) {
		if(swnas[swna].length > most_length) {
			most_length = swnas[swna].length;
			most_key = swna;
		}
	}
	
	if(test_mode && typeof this.space_with_no_area !== "undefined") {
		for(let i of this.space_with_no_area) {
			let split_i = i.split(",");
			this.space[split_i[0]][split_i[1]].setBackgroundColor(null);
		}
	}
	
	this.space_with_no_area = swnas[most_key];
	
	if(test_mode) {
	  for(let i of this.space_with_no_area) {
		let split_i = i.split(",");
		this.space[split_i[0]][split_i[1]].setBackgroundColor(color(255, 64));
	  }
    }
  }

  this.keyPressed = function() {
    this.player.keyPressed();
  }
  
  this.mouseReleased = function() {
    /*if(!this.player.inventory.isHolding()) {
      for(let i in this.space) {
        for(let j in this.space[i]) {
          let space = this.space[i][j];
          if(space.mouseIsOnSpace) {
            
          }
        }
      }
    }*/
  }

  this.mouseWheel = function(event) {
    this.player.mouseWheel(event);
  }
}
