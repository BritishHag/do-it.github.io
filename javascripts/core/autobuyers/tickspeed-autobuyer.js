"use strict";

Autobuyer.tickspeed = new class TickspeedAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.tickspeed;
  }

  get name() {
    return `Tickspeed`;
  }

  get isUnlocked() {
    return NormalChallenge(9).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.tickspeed.interval;
  }

  get isBought() {
    return this.data.isBought;
  }

  get antimatterCost() {
    return new Decimal(1e140);
  }

  get canBeBought() {
    return true;
  }

  get disabledByContinuum() {
    return Laitela.continuumActive;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get canUnlockSlowVersion() {
    return player.records.thisEternity.maxAM.gte(this.antimatterCost);
  }

  toggleMode() {
    this.mode = [
      AUTOBUYER_MODE.BUY_SINGLE,
      AUTOBUYER_MODE.BUY_MAX
    ]
      .nextSibling(this.mode);
  }

  get canTick() {
    return Tickspeed.isAvailableForPurchase && Tickspeed.isAffordable && super.canTick;
  }

  tick() {
    super.tick();
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        buyTickSpeed();
        break;
      case AUTOBUYER_MODE.BUY_MAX:
        buyMaxTickSpeed();
        break;
    }
  }

  purchase() {
    if (!this.canUnlockSlowVersion) return;
    this.data.isBought = true;
  }

  get resetTickOn() {
    return Perk.antimatterNoReset.isBought ? PRESTIGE_EVENT.ANTIMATTER_GALAXY : PRESTIGE_EVENT.DIMENSION_BOOST;
  }

  reset() {
    super.reset();
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.mode = AUTOBUYER_MODE.BUY_SINGLE;
    this.data.isUnlocked = false;
    this.data.isBought = false;
  }
}();
