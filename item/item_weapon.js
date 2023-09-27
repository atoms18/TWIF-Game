
class ItemWeapon extends Item {
  constructor(color_, sec_name) {
    super("weapon", color_, 50);

    this.secondary_name = sec_name;
  }
}
