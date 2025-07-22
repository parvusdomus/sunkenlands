
import {attibuteRoll} from "../dice/rolls.js";
import {attackRoll} from "../dice/rolls.js";
import {saveRoll} from "../dice/rolls.js";
import {skillRoll} from "../dice/rolls.js";

export const addChatMessageContextOptions = function (html, options) {
	const canApply = function (li) {
	  if (canvas.tokens.controlled.length === 0) return false
	  let damageRoll=false
	  let diceRoll=false
	  if (!!li.querySelector(".damageRoll")){damageRoll=true}
	  if (!!li.querySelector(".dice-roll")){diceRoll=true}
	  if (damageRoll||diceRoll) {
		return true
	  }
	}

	const luckReroll = function (li) {
		let message = li.querySelector(".totalRoll")
		if (!!message){
			let dataset = message.dataset
			let isFailed = false
			let isFumble = false
			if (!!li.querySelector(".failed")){isFailed=true}
			if (!!li.querySelector(".fumble")){isFumble=true}
			const canReroll=dataset.canreroll
			if ((isFailed || isFumble) && canReroll=="true") return true
		}
		return false
	  }
  
	options.push(
	  {
		name: game.i18n.localize('SUNKEN.ChatContextDamage'),
		icon: '<i class="fas fa-user-minus"></i>',
		condition: canApply,
		callback: li => applyChatCardDamage(li, -1)
	  }
	)
	options.push(
	  {
		name: game.i18n.localize('SUNKEN.ChatContextHealing'),
		icon: '<i class="fas fa-user-plus"></i>',
		condition: canApply,
		callback: li => applyChatCardDamage(li, 1)
	  }
	)
	options.push(
		{
		  name: game.i18n.localize('SUNKEN.ChatContextReroll'),
		  icon: '<i class="fa-solid fa-rotate"></i>',
		  condition: luckReroll,
		  callback: li => fortuneReroll(li)
		}
	  )
	return options
  }
  
  /* -------------------------------------------- */
  
  /**
   * Apply rolled dice damage to the token or tokens which are currently controlled.
   * This allows for damage to be scaled by a multiplier to account for healing, critical hits, or resistance
   *
   * @param {HTMLElement} roll    The chat entry which contains the roll data
   * @param {Number} multiplier   A damage multiplier to apply to the rolled damage.
   * @return {Promise}
   */
  function applyChatCardDamage (roll, multiplier) {
	let amount = 0
	let message=roll.querySelector(".damageRoll")
	if (message){
		let dataset = message.dataset
		amount = dataset.damage
	}
	else{
		message=roll.querySelector(".dice-total")
		amount = message.innerHTML

	}
	return Promise.all(canvas.tokens.controlled.map(t => {
	  const a = t.actor
	  const effect = CONFIG.statusEffects.find(e => e.id === CONFIG.specialStatusEffects.DEFEATED);
	  let combatant 
      if (game.combat){
        combatant= game.combat.getCombatantByActor(a);
      }
      if (!a){
        ui.notifications.warn(game.i18n.localize("SUNKEN.messages.noTarget"));
      }
	  let cantidad = (Number(multiplier)*Number(amount))
	  let vida_actual=Number(a.system.hp.value)+cantidad
	  if (vida_actual>Number(a.system.hp.max)){
		vida_actual=Number(a.system.hp.max)
	  }
	  if (vida_actual<0){
		vida_actual=0
	  }
	  if (multiplier=='1'){
		//ui.notifications.warn(a.name+" "+game.i18n.localize("recibe curación ("+Math.abs(cantidad)+")"));
		ui.notifications.warn(a.name+" "+game.i18n.localize("SUNKEN.messages.getsHealing")+" ("+Math.abs(cantidad)+")");
		game.i18n.localize("SUNKEN.messages.noTarget")
	  }
	  else {
		//ui.notifications.warn(a.name+" "+game.i18n.localize("recibe daño ("+Math.abs(cantidad)+")"));
		ui.notifications.warn(a.name+" "+game.i18n.localize("SUNKEN.messages.getsDamage")+" ("+Math.abs(cantidad)+")");
	  }
	  //// MUERTO
	  if (vida_actual <= 0){
		//ui.notifications.info(a.name+" ha muerto...");s
		ui.notifications.info(a.name+" "+game.i18n.localize("SUNKEN.messages.dies")+"...")
		if (combatant){
            combatant.token.toggleActiveEffect(effect, {overlay: true});
            combatant.update({defeated: true});
        }
        else{ 
            let label = "dead";
            let icon = "systems/sunkenlands/styles/icons/death-skull.svg"
            let effect = {
              label,
              icon,
              flags: {
                core:{
                  statusId: "dead",
                  overlay: true
                }
              }
            }
            a.createEmbeddedDocuments("ActiveEffect", [effect])
        }		
	  }

	  ////
	  return a.update({
		'system.hp.value': vida_actual
	  })

	}))
	
}

function fortuneReroll (roll){
    const messageId = roll.dataset.messageId;
	let previousMessage= game.messages.get(messageId)
	let message = roll.querySelector(".totalRoll")
	let dataset = message.dataset
	const rollType = dataset.rolltype
	let actor=game.actors.get(dataset.actorid)
	let fortuna=Number(actor.system.fortunePoints.value)
	if (fortuna<=0){
		ui.notifications.warn(game.i18n.localize("SUNKEN.messages.noFortune"));
		return
	}
	let attr_label=dataset.attrlabel
	let attr_value=dataset.attrvalue
	let attr_mod=dataset.attrmod
	let bonus=dataset.bonus
	let skill_name=dataset.skillname
	let skill_mod=dataset.skillmod
	let att_mod=dataset.attmod
	let item_bonus=dataset.itembonus
	let bab=dataset.bab
	let dam=dataset.dam
	let dam_mod=dataset.dammod
	switch(rollType) {
		case "attribute":
			fortuna--
			actor.update({'system.fortunePoints.value': fortuna})
			ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
			attibuteRoll (actor, "1d20", attr_label, attr_value, attr_mod, bonus, false)
			previousMessage.delete();
			break;
		case "skill":
			fortuna--
			actor.update({'system.fortunePoints.value': fortuna})
			ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
			skillRoll (actor, "1d20", attr_label, attr_value, attr_mod, skill_name, skill_mod, bonus, false)
			previousMessage.delete();
			break;
		case "save":
			fortuna--
			actor.update({'system.fortunePoints.value': fortuna})
			ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
			saveRoll (actor, "1d20", attr_label, attr_value, bonus, false)
			previousMessage.delete();
			break;
		case "combat":
			let enemy= Array.from(game.user.targets)[0]?.actor;
			if (enemy){
				fortuna--
				actor.update({'system.fortunePoints.value': fortuna})
				ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
				attackRoll (actor, "1d20", attr_label, attr_value, attr_mod, att_mod, item_bonus, bab, dam, dam_mod, enemy, false) 
				previousMessage.delete();
			}
			else{
				ui.notifications.info(game.i18n.localize("SUNKEN.messages.noTarget"));
			}
			break;
		case "damage":
			break;
	  }
	
}





  
