
class Block extends GameObject {
  constructor(name, color_, size) {
    super(name, color_, size);

    this.border = 5;
  }

  draw(pos_x, pos_y, only_draw = false) {
    let var1 = super.draw(pos_x, pos_y, this.half_size, !only_draw);
    if(!var1) {
      push();
      fill(0, 0);
      stroke(this.color);
      strokeWeight(this.border);
      drawingContext.shadowBlur=this.amount_of_shadowblur;
      drawingContext.shadowColor=this.color.toString("#rrggbb");
      rect(pos_x, pos_y, this.size, this.size);
      drawingContext.shadowBlur=0;
      pop();
    }
  }
}
