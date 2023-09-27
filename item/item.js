
class Item extends GameObject {

  constructor(name, color_, size) {
    super(name, color_, size);

    this.secondary_name;
  }

  draw(pos_x, pos_y, only_draw = false) {
    let var1 = super.draw(pos_x, pos_y, this.item_height*0.5, !only_draw);
    if(!var1) {
      push();
      strokeWeight(0);
      fill(this.color);
      drawingContext.shadowBlur=this.amount_of_shadowblur;
      drawingContext.shadowColor=this.color.toString("#rrggbb");
      translate(pos_x, pos_y+this.item_height);
      rotate(-QUARTER_PI);
      rect(0, 0, this.item_length, 5);
      drawingContext.shadowBlur=0;
      pop();
    }
  }

  setSize(size) {
    super.setSize(size);
    this.item_height = size*tan(QUARTER_PI);
    this.item_length = size/cos(QUARTER_PI);
  }
}
