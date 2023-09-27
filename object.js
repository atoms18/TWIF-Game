
class GameObject {

  constructor(name, color_, size) {
    this.name = name;
    this.color = color(color_);
    this.setSize(size);

    this.position = createVector(floor(random(total_space_over_map[0])), floor(random(total_space_over_map[1])));
    // this.in_inventory_slot;
    this.image;

    this.amount_of_shadowblur = 0;
    this.states_of_shadowblur = "up";
  }

  draw(pos_x, pos_y, halfH, is_tick) {
    if(is_tick) {
      let player_circle = {
        x: main_map.player.canvas_position.x,
        y: main_map.player.canvas_position.y,
        radius: main_map.player.radius
      };
      let block_rect = {
        x: pos_x,
        y: pos_y,
        halfWidth: this.half_size,
        halfHeight: halfH
      };

      if(Utils.rectCircleOverlap(block_rect, player_circle) !== false) {
        let that_space = main_map.space[this.position.x][this.position.y];
        that_space.is_stuff_available = false;
        that_space.floating_stuff = undefined;
        if(this instanceof ItemPill || this instanceof ItemWeapon) {
          main_map.player.inventory.addSpecialItem(this);
        } else {
          main_map.player.inventory.addStuff(this);
        }
      }
    }

    if(typeof this.image !== "undefined") {
      let newHeight = this.size;
      if(this.image.width != this.image.height) {
        let aspectRatio = this.image.width / this.image.height;
        newHeight /= aspectRatio;
        pos_y += abs(newHeight-this.size)*0.5;
      }
      image(
        this.image,
        pos_x,
        pos_y,
        this.size,
        newHeight
      );
      return true;
    }

    if(is_tick) {
      if(this.amount_of_shadowblur <= 0) {
        this.states_of_shadowblur = "up";
      } else if(this.amount_of_shadowblur >= 10) {
        this.states_of_shadowblur = "down";
      }
      if(this.states_of_shadowblur == "up") {
        this.amount_of_shadowblur++;
      } else if(this.states_of_shadowblur == "down") {
        this.amount_of_shadowblur--;
      }
    }
    return false;
  }

  setSize(size) {
    this.size = size;
    this.half_size = size*0.5;
  }
}
