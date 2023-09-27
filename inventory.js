
function Inventory() {

  this.stuff_slot = stuffs.length;
  this.stuff_inventory = [];
  this.special_inventory = ["weapon", "pill", "pill"];

  for(let i = 0; i < this.stuff_slot; i++) {
    this.stuff_inventory[i] = {
      name: false,
      contains: []
    };
  }
  for(let i = 0; i < this.special_inventory.length; i++) {
    let selected_name = this.special_inventory[i];

    this.special_inventory[i] = {
      name: selected_name,
      contains: [],
      selected_item: selected_name == "pill" ? -1:false
    };
  }

  this.total_slot = this.stuff_slot + this.special_inventory.length;
  this.selected_slot = false;

  let gap = 20;
  let stuff_size = 27;
  let width_size = (stuff_size*this.total_slot)+(gap*(this.total_slot-1));
  let size_gap_sum = stuff_size+gap;
  this.draw = function() {
    push();
    textStyle(BOLD);
    fill(inverse_main_color);
    let pos_y = 0.925*height;

    let i = 0;
    let start_x = (width - width_size) * 0.5;
    for(let stuff of this.stuff_inventory) {
      if(stuff.contains.length > 0) {
        let choosed_stuff = stuff.contains[0];
        choosed_stuff.setSize(stuff_size);
        let pos_x = start_x+i*size_gap_sum;
        choosed_stuff.draw(pos_x, pos_y, true);
        text(stuff.contains.length, pos_x, pos_y+10);
      }
      i++;
    }
    for(let stuff of this.special_inventory) {
      if(stuff.selected_item === -1) {
        if(stuff.contains.length > 0) {
          let selected_stuff = stuff.contains;
          selected_stuff[0].setSize(stuff_size);
          let pos_x = start_x+i*size_gap_sum;
          selected_stuff[0].draw(pos_x, pos_y, true);
          text(selected_stuff.length, pos_x, pos_y+10);
          text(selected_stuff[0].key_binding, pos_x+9, pos_y-7);
        }
      } else {
        if(stuff.selected_item !== false) {
          let selected_stuff = stuff.contains[stuff.selected_item];
          selected_stuff.contains[0].setSize(stuff_size);
          let pos_x = start_x+i*size_gap_sum;
          selected_stuff.contains[0].draw(pos_x, pos_y, true);
          text(selected_stuff.contains.length, pos_x, pos_y+10);
          strokeWeight(0);
          push();
          translate(pos_x+9, pos_y-13);
          triangle(5, 0, 0, 5, 10, 5);
          pop();
          push();
          translate(pos_x+9, pos_y+stuff_size+10);
          triangle(0, 0, 10, 0, 5, 5);
          pop();
        }
      }
      i++;
    }

    if(this.selected_slot !== false) {
      fill(0, 0);
      stroke(128);
      strokeWeight(3);
      rect(
        start_x+this.selected_slot*size_gap_sum-5,
        pos_y-5,
        stuff_size+10,
        stuff_size+10
      );
    }
    pop();
  }

  this.addStuff = function(stuff) {
    for(let i = 0; i < this.stuff_slot; i++) {
      if(typeof this.stuff_inventory[i] !== "undefined") {
        let inventory = this.stuff_inventory[i];
        if(inventory.name == stuff.name) {
          let contains = inventory.contains;
          // stuff.in_inventory_slot = [i, contains.length];
          contains.push(stuff);
          return;
        } else if(inventory.name === false && inventory.contains.length == 0) {
          inventory.name = stuff.name;
          this.addStuff(stuff);
          return;
        }
      }
    }
  }

  this.addSpecialItem = function(item) {
    for(let i = 0; i < this.special_inventory.length; i++) {
      let inventory = this.special_inventory[i];
      if(inventory.name == item.name) {
        if(inventory.selected_item !== -1) {
          let contains = inventory.contains;
          for(let secondary_item of contains) {
            if(secondary_item.name == item.secondary_name) {
              // item.in_inventory_slot = [i, secondary_item.contains.length];
              secondary_item.contains.push(item);
              return;
            }
          }
          contains.push({
            name: item.secondary_name,
            contains: []
          });
          inventory.selected_item = contains.length - 1;
          this.addSpecialItem(item);
          return;
        } else {
          inventory.name = item.secondary_name;
          this.addSpecialItem(item);
          return;
        }
      } else if(inventory.name == item.secondary_name) {
        // item.in_inventory_slot = [i, inventory.contains.length];
        inventory.contains.push(item);
        return;
      }
    }
  }

  let keycode_one = 49;
  this.keyPressed = function() {

    let special_slot;
    // +1 is for weapon
    for(let i = 0; i < this.stuff_slot+1; i++) {
      if(keyCode == keycode_one+i) {
        if(this.selected_slot === i) {
          this.selected_slot = false;
        } else {
          this.selected_slot = i;
        }
        break;
      }
    }

    // this.specialSlotToOrdinarySlot(0) : 0 is for weapon
    if(this.selected_slot == this.specialSlotToOrdinarySlot(0)) {
      special_slot = this.special_inventory[this.ordinarySlotToSpecialSlot(this.selected_slot)];
    }

    if(typeof special_slot !== "undefined") {
      if(
        special_slot["selected_item"] !== false
        && special_slot.contains.length > 1
        && special_slot["selected_item"] !== -1
      ) {
        if(keyCode === UP_ARROW) {
          special_slot["selected_item"]--;
          if(special_slot["selected_item"] < 0) {
            special_slot["selected_item"] = special_slot.contains.length-1;
          }
        }
        if(keyCode === DOWN_ARROW) {
          special_slot["selected_item"]++;
          if(special_slot["selected_item"] > special_slot.contains.length-1) {
            special_slot["selected_item"] = 0;
          }
        }
      }
    }
  }

  this.mouseWheel = function(event) {
    if(event.delta > 0) {
      this.selected_slot++;
      if(this.selected_slot > this.specialSlotToOrdinarySlot(0)) {
        this.selected_slot = 0;
      }
    } else {
      this.selected_slot--;
      if(this.selected_slot < 0) {
        this.selected_slot = this.specialSlotToOrdinarySlot(0);
      }
    }
  }

  this.isHolding = function(something = null) {
    if(this.selected_slot !== false && this.getSlotStuff(this.selected_slot) !== false) {
      if(something === null) {
        return true;
      }
      let holding_stuff = this.getHoldingStuff();
      if(holding_stuff[0] instanceof something) {
        return true;
      }
    }
    return false;
  }

  this.getHoldingStuff = function() {
    if(this.isHolding()) {
      return this.getSlotStuff(this.selected_slot);
    }
    return false;
  }

  this.getSlotStuff = function(slot) {
    if(this.ordinarySlotToSpecialSlot(slot) === false) {
      let that_slot = this.stuff_inventory[slot];
      if(that_slot.contains.length > 0) {
        return that_slot.contains;
      }
    } else {
      let parent_slot = this.special_inventory[this.ordinarySlotToSpecialSlot(slot)];
      if(parent_slot.selected_item !== false && parent_slot.selected_item !== -1) {
        let that_slot = parent_slot.contains[parent_slot.selected_item];
        switch(slot) {
          case this.specialSlotToOrdinarySlot(0):
            if(that_slot.contains.length > 0) {
              return that_slot.contains;
            }
            break;
        }
      }
    }
    return false;
  }

  this.specialSlotToOrdinarySlot = function(s_slot) {
    return s_slot + this.stuff_slot;
  }

  this.ordinarySlotToSpecialSlot = function(o_slot) {
    if(o_slot < this.stuff_slot) {
      return false;
    } else {
      return o_slot - this.stuff_slot;
    }
  }
}
