export async function attibuteRoll (actor, rolltext, attr_label, attr_value, attr_mod, bonus, reroll) {
	let rollunder=true;
	if (game.settings.get("sunkenlands", "roll-over")==true)rollunder=false;
    const roll =  await new Roll(rolltext).evaluate();
	let title=""
	let target=0
	let rollResult="failed"
	let rollResultText="Fallo"
	let actor_id=actor._id
	let total=0
	let canReroll=reroll
	if (actor.type=="npc"){
		canReroll=false
	}
	else {
		if (Number(actor.system.fortunePoints.value)<=0){
			canReroll=false
		}
	}
	if (game.modules.get('dice-so-nice')?.active){
        game.dice3d.showForRoll(roll,game.user,true,false,null)
    }
	if (rollunder==true){
		target=Number(attr_value)+Number(bonus)
		title=attr_label+" VS "+target
		if (Number(bonus)!=0){
			title+=" ("+attr_value
			if (Number(bonus)>0){
				title+="+"+Math.abs(bonus)
			}
			else {
				title+=bonus
			}	
			title+=")"
		}
		total=Number(roll.total)
		if (Number(roll.total)<=Number(target)){
			rollResult="success"
			rollResultText="Éxito"
		} 	
	}
	else{
		target=12
		title=attr_label
		if ((Number(attr_mod)!=0)||(Number(bonus)!=0)){
			title+=" ("
			if (Number(attr_mod)!=0){
				if (Number(attr_mod)>0){
					title+="+"+Math.abs(attr_mod)
				}
				else {
					title+=attr_mod
				}	
			}
			if (Number(bonus)!=0){
				if (Number(bonus)>0){
					title+="+"+Math.abs(bonus)
				}
				else {
					title+=bonus
				}	
			}
			title+=")"
		}
		title+=" VS "+target
		total=Number(roll.total)+Number(attr_mod)
		if (total>=Number(target)){
			rollResultText="Éxito"
		} 
	}
	if (Number(roll.total)==1){
		rollResult="critical"
		rollResultText="Éxito Crítico"
	}
	if (Number(roll.total)==20){
		rollResult="fumble"
		rollResultText="Pifia"
	}
	let renderedRoll = await renderTemplate("systems/sunkenlands/templates/chat/simpleTestResult.html", { 
		//attibuteRoll (actor, rolltext, attr_label, attr_value, attr_mod, bonus)
		rollType: "attribute",
		canReroll: canReroll,
        pjName: actor.name,
        pjImage: actor.prototypeToken.texture.src,
        rollTitle: title,
        totalRoll: roll.total, 
		total: total,
        rollResult: rollResult,
		rollResultText: rollResultText,
        actor_id: actor_id,
		data_attr_label: attr_label,
		data_attr_value: attr_value,
		data_attr_mod: attr_mod,
		data_bonus: bonus
    });
    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll,
		rollMode: game.settings.get("core", "rollMode")
    };
    ChatMessage.create(chatData);
    return;
}

export async function skillRoll (actor, rolltext, attr_label, attr_value, attr_mod, skill_name, skill_mod, bonus, reroll) {
	let rollunder=true;
	if (game.settings.get("sunkenlands", "roll-over")==true)rollunder=false;
    const roll =  await new Roll(rolltext).evaluate();
	let title=""
	let target=0
	let rollResult="failed"
	let rollResultText="Fallo"
	let actor_id=actor._id
	let total=0
	let canReroll=reroll
	if (Number(actor.system.fortunePoints.value)<=0){
		canReroll=false
	}
	if (game.modules.get('dice-so-nice')?.active){
        game.dice3d.showForRoll(roll,game.user,true,false,null)
    }
	if (rollunder==true){
		target=Number(attr_value)+Number(bonus)+Number(skill_mod)
		title=skill_name+" +"+skill_mod+"<br>"+attr_label+" VS "+target
		title+=" ("+attr_value
		if (Number(skill_mod)!=0){
			if (Number(skill_mod)>0){
				title+="+"+Math.abs(skill_mod)
			}
			else {
				title+=skill_mod
			}	
		}
		if (Number(bonus)!=0){
			if (Number(bonus)>0){
				title+="+"+Math.abs(bonus)
			}
			else {
				title+=bonus
			}	
		}
		title+=")"
		total=Number(roll.total)
		if (Number(roll.total)<=Number(target)){
			rollResult="success"
			rollResultText="Éxito"
		} 	
	}
	else{
		target=12
		title=skill_name+" +"+skill_mod+"<br>"+attr_label
		title=attr_label
		if ((Number(attr_mod)!=0)||(Number(bonus)!=0)||(Number(skill_mod)!=0)){
			title+=" ("
			if (Number(skill_mod)!=0){
				if (Number(skill_mod)>0){
					title+="+"+Math.abs(skill_mod)
				}
				else {
					title+=skill_mod
				}	
			}
			if (Number(attr_mod)!=0){
				if (Number(attr_mod)>0){
					title+="+"+Math.abs(attr_mod)
				}
				else {
					title+=attr_mod
				}	
			}
			if (Number(bonus)!=0){
				if (Number(bonus)>0){
					title+="+"+Math.abs(bonus)
				}
				else {
					title+=bonus
				}	
			}
			title+=")"
		}
		title+=" VS "+target
		total=Number(roll.total)+Number(attr_mod)+Number(skill_mod)
		if (total>=Number(target)){
			rollResult="success"
			rollResultText="Éxito"
		} 
	}
	if (Number(roll.total)==1){
		rollResult="critical"
		rollResultText="Éxito Crítico"
	}
	if (Number(roll.total)==20){
		rollResult="fumble"
		rollResultText="Pifia"
	}
	let renderedRoll = await renderTemplate("systems/sunkenlands/templates/chat/simpleTestResult.html", { 
		rollType: "skill",
		canReroll: canReroll,
        pjName: actor.name,
        pjImage: actor.prototypeToken.texture.src,
        rollTitle: title,
        totalRoll: roll.total, 
		total: total,
        rollResult: rollResult,
		rollResultText: rollResultText,
        actor_id: actor_id,
		data_attr_label: attr_label,
		data_attr_value: attr_value,
		data_attr_mod: attr_mod,
		data_skill_name: skill_name, 
		data_skill_mod: skill_mod,
		data_bonus: bonus
    });
    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll,
		rollMode: game.settings.get("core", "rollMode")
    };
    ChatMessage.create(chatData);
    return;
}

export async function saveRoll (actor, rolltext, attr_label, attr_value, bonus, reroll) {
    const roll =  await new Roll(rolltext).evaluate();
	let title=""
	let target=0
	let rollResult="failed"
	let rollResultText="Fallo"
	let actor_id=actor._id
	let total=0
	let canReroll=reroll
	if (actor.system.fortunePoints){
		if (Number(actor.system.fortunePoints.value)<=0){
			canReroll=false
		}
	}
	else {
		canReroll=false
	}
	if (game.modules.get('dice-so-nice')?.active){
        game.dice3d.showForRoll(roll,game.user,true,false,null)
    }
	target=Number(attr_value)
	title=attr_label
	if (Number(bonus)!=0){
		if (Number(bonus)>0){
			title+=" +"+Math.abs(bonus)
		}
		else {
			title+=" "+bonus
		}	
	}
	title+=" VS "+target
	total=Number(roll.total)+Number(bonus)
	if (total>=Number(target)){
		rollResult="success"
		rollResultText="Éxito"
	} 
	if (Number(roll.total)==20){
		rollResult="critical"
		rollResultText="Éxito Crítico"
	}
	if (Number(roll.total)==1){
		rollResult="fumble"
		rollResultText="Pifia"
	}
	let renderedRoll = await renderTemplate("systems/sunkenlands/templates/chat/simpleTestResult.html", { 
		rollType: "save",
		canReroll: canReroll,
        pjName: actor.name,
        pjImage: actor.prototypeToken.texture.src,
        rollTitle: title,
        totalRoll: roll.total, 
		total:total,
        rollResult: rollResult,
		rollResultText: rollResultText,
		actor_id: actor_id,
		data_attr_label: attr_label,
		data_attr_value: attr_value,
		data_attr_mod: 0,
		data_bonus: bonus
    });
    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll,
		rollMode: game.settings.get("core", "rollMode")
    };
    ChatMessage.create(chatData);
    return;
}

export async function attackRoll (actor, rolltext, attr_label, attr_value, attr_mod, att_mod, item_bonus, bab, dam, dam_mod, enemy, reroll) {
	const roll =  await new Roll(rolltext).evaluate();
	let title="1D20"
	let rollResult="failed"
	let rollResultText="Fallo"
	let actor_id=actor._id
	let total=0
	let canReroll=reroll
	if (actor.system.fortunePoints){
		if (Number(actor.system.fortunePoints.value)<=0){
			canReroll=false
		}
	}
	if (game.modules.get('dice-so-nice')?.active){
        game.dice3d.showForRoll(roll,game.user,true,false,null)
    }
	let target=Number(enemy.system.ac)
	let header=actor.name+"<br>VS<br>"+enemy.name
	if ((Number(attr_mod)!=0)||(Number(item_bonus)!=0||(Number(att_mod)!=0))){
		if (Number(attr_mod)!=0){
			if (Number(attr_mod)>0){
				title+=" +"+Math.abs(attr_mod)
			}
			else {
				title+=" "+attr_mod
			}	
		}
		if (Number(bab)!=0){
			if (Number(bab)>0){
				title+=" +"+Math.abs(bab)
			}
			else {
				title+=" "+bab
			}	
		}
		if (Number(item_bonus)!=0){
			if (Number(item_bonus)>0){
				title+=" +"+Math.abs(item_bonus)
			}
			else {
				title+=" "+item_bonus
			}	
		}
		if (Number(att_mod)!=0){
			if (Number(att_mod)>0){
				title+=" +"+Math.abs(att_mod)
			}
			else {
				title+=" "+att_mod
			}	
		}
	}
	
	title+=" VS "+target
	total=Number(roll.total)+Number(attr_mod)+Number(item_bonus)+Number(att_mod)+Number(bab)
	if (total>=Number(target)){
		rollResult="success"
		rollResultText="Éxito"
	} 
	if (Number(roll.total)==20){
		rollResult="critical"
		rollResultText="Éxito Crítico"
	}
	if (Number(roll.total)==1){
		rollResult="fumble"
		rollResultText="Pifia"
	}
	let renderedRoll = await renderTemplate("systems/sunkenlands/templates/chat/attackTestResult.html", { 
		rollType: "combat",
		canReroll: canReroll,
		header: header,
        pjName: actor.name,
        pjImage: actor.prototypeToken.texture.src,
		enemyName: enemy.name,
    	enemyImage: enemy.prototypeToken.texture.src,
        rollTitle: title,
        totalRoll: roll.total, 
		total:total,
        rollResult: rollResult,
		rollResultText: rollResultText,
        actor_id: actor_id,
		data_attr_label: attr_label,
		data_attr_value: attr_value,
		data_attr_mod: attr_mod,
		data_att_mod: att_mod, 
		data_item_bonus: item_bonus, 
		data_bab: bab, 
		data_dam: dam, 
		data_dam_mod: dam_mod
    });
    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll,
		rollMode: game.settings.get("core", "rollMode")
    };
    ChatMessage.create(chatData);
	if ((rollResult=="success")||(rollResult=="critical")){
		let damageRollText=dam+"+"+dam_mod
		const damRoll =  await new Roll(damageRollText).evaluate();
		if (game.modules.get('dice-so-nice')?.active){
			game.dice3d.showForRoll(damRoll,game.user,true,false,null)
		}
		let title=dam
		if (Number(dam_mod)!=0){
			if (Number(dam_mod)>0){
				title+="+"+Math.abs(dam_mod)
			}
			else {
				title+=dam_mod
			}	
		}
		let damRoll_total=damRoll.total
		if (damRoll_total<1){damRoll_total=1}
		if (game.settings.get("sunkenlands", "doubleDamage")==true && rollResult=="critical"){
			damRoll_total=Number(damRoll_total)*2
		}
		let renderedDamageRoll = await renderTemplate("systems/sunkenlands/templates/chat/damageTestResult.html", { 
			rollType: "damage",
			canReroll: false,
			header: header,
			pjName: actor.name,
			pjImage: actor.prototypeToken.texture.src,
			enemyName: enemy.name,
			enemyImage: enemy.prototypeToken.texture.src,
			rollTitle: title,
			totalRoll: damRoll_total,
			actor_id: actor_id
		});
		const damageChatData = {
			speaker: ChatMessage.getSpeaker(),
			content: renderedDamageRoll,
			rollMode: game.settings.get("core", "rollMode")
		};
		ChatMessage.create(damageChatData);
	}
    return;
}

export async function healingRoll (actor) {
	let actorclass=actor.items.find((k) => k.type === "class");
	let rolltext=actorclass.system.hd+"+"+actor.system.level
	console.log ("ROLLTEXT")
	console.log (rolltext)
	const damRoll =  await new Roll(rolltext).evaluate();
	if (game.modules.get('dice-so-nice')?.active){
		game.dice3d.showForRoll(damRoll,game.user,true,false,null)
	}
	let header=actor.name+" Gasta Fortuna para Curarse"
	let title=rolltext
	let damRoll_total=damRoll.total
	let renderedDamageRoll = await renderTemplate("systems/sunkenlands/templates/chat/healingResult.html", { 
		rollType: "damage",
		canReroll: false,
		header: header,
		pjName: actor.name,
		pjImage: actor.prototypeToken.texture.src,
		rollTitle: title,
		totalRoll: damRoll_total
	});
	const damageChatData = {
		speaker: ChatMessage.getSpeaker(),
		content: renderedDamageRoll,
		rollMode: game.settings.get("core", "rollMode")
	};
	ChatMessage.create(damageChatData);
    return;
}
