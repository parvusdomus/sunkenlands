
import {attibuteRoll} from "../dice/rolls.js";
import {attackRoll} from "../dice/rolls.js";
import {saveRoll} from "../dice/rolls.js";
import {skillRoll} from "../dice/rolls.js";

export const addChatMessageContextOptions = function (html, options) {
	const canApply = function (li) {
		console.log("LI")
		console.log(li)
	  if (canvas.tokens.controlled.length === 0) return false
	  if ((li.find('.damageRoll').length)||(li.find('.dice-rolls').length)) {
		console.log ("ENCONTRADO")
		return true
	  }
	}

	const luckReroll = function (li) {
		const canReroll=li.find('.totalRoll').attr('data-canReroll')
		if ((li.find('.failed').length || li.find('.fumble').length) && canReroll=="true") return true
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
	//const amount = roll.find('.damage-applyable').attr('data-damage') || roll.find('.dice-total').text()
	const amount = roll.find('.dice-total').text()
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
	  
		console.log ("AAAAAAAAAAAAAAAAAA")
		console.log (a)
		console.log ("COMBATANT")
		console.log (combatant)
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
    const messageId = roll[0].dataset.messageId;
	let previousMessage= game.messages.get(messageId)
	const rollType = roll.find('.totalRoll').attr('data-rollType')
	let actor=game.actors.get(roll.find('.totalRoll').attr('data-actorId'))
	console.log ("ACTOR")
	console.log (actor)
	let fortuna=Number(actor.system.fortunePoints.value)
	if (fortuna<=0){
		ui.notifications.warn(game.i18n.localize("SUNKEN.messages.noFortune"));
		return
	}
	let attr_label=roll.find('.totalRoll').attr('data-attrLabel')
	let attr_value=roll.find('.totalRoll').attr('data-attrValue')
	let attr_mod=roll.find('.totalRoll').attr('data-attrMod')
	let bonus=roll.find('.totalRoll').attr('data-bonus')
	let skill_name=roll.find('.totalRoll').attr('data-skillName')
	let skill_mod=roll.find('.totalRoll').attr('data-skillMod')
	let att_mod=roll.find('.totalRoll').attr('data-attMod')
	let item_bonus=roll.find('.totalRoll').attr('data-itemBonus')
	let bab=roll.find('.totalRoll').attr('data-bab')
	let dam=roll.find('.totalRoll').attr('data-dam')
	let dam_mod=roll.find('.totalRoll').attr('data-damMod')
	switch(rollType) {
		case "attribute":
			console.log ("SOY UNA TIRADA DE ATRIBUTO")
			fortuna--
			actor.update({'system.fortunePoints.value': fortuna})
			ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
			attibuteRoll (actor, "1d20", attr_label, attr_value, attr_mod, bonus, false)
			previousMessage.delete();
			break;
		case "skill":
			console.log ("SOY UNA TIRADA DE HABILIDAD")
			fortuna--
			actor.update({'system.fortunePoints.value': fortuna})
			ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
			skillRoll (actor, "1d20", attr_label, attr_value, attr_mod, skill_name, skill_mod, bonus, false)
			previousMessage.delete();
			break;
		case "save":
			console.log ("SOY UNA TIRADA DE SALVACION")
			fortuna--
			actor.update({'system.fortunePoints.value': fortuna})
			ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
			saveRoll (actor, "1d20", attr_label, attr_value, bonus, false)
			previousMessage.delete();
			break;
		case "combat":
			console.log ("SOY UNA TIRADA DE ATAQUE")
			let enemy= Array.from(game.user.targets)[0]?.actor;
			if (enemy){
				console.log ("TENGO TARGET")
				fortuna--
				actor.update({'system.fortunePoints.value': fortuna})
				ui.notifications.info(game.i18n.localize("SUNKEN.messages.spendsFortuneReroll"));
				attackRoll (actor, "1d20", attr_label, attr_value, attr_mod, att_mod, item_bonus, bab, dam, dam_mod, enemy, false) 
				previousMessage.delete();
			}
			else{
				console.log ("NO TENGO TARGET")
				ui.notifications.info(game.i18n.localize("SUNKEN.messages.noTarget"));
			}
			break;
		case "damage":
			console.log ("SOY UNA TIRADA DE DAÑO")
			break;
	  }
	
}





  
