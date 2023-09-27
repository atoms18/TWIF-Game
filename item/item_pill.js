
class ItemPill extends Item {
  constructor(sec_name, color_) {
    super("pill", color_, 50);

    this.key_binding;
    this.secondary_name = sec_name;
  }
}
