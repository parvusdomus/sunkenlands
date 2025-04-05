import {attibuteRoll} from "../../dice/rolls.js";
import {attackRoll} from "../../dice/rolls.js";
import {saveRoll} from "../../dice/rolls.js";
import {skillRoll} from "../../dice/rolls.js";
import {healingRoll} from "../../dice/rolls.js";

export default class ActorSheetSUNKEN extends ActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["sunken", "sheet", "actor", "character"],
			width: 620,
			height: 750,
			scrollY: [".window-content"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }],
			dragDrop: [{ dragSelector: ".items-list .item" }]
		});
	}

	get template() {
		return "systems/sunkenlands/templates/actors/actor-sheet.hbs";
	}

	/**
	 * Blocklist of item types that shouldn't be added to the actor.
	 * @returns {Set<string>}
	 */
	get unsupportedItemTypes() {
		return new Set();
	}

	async getData() {
		const source = this.actor.toObject();
		const context = {
			actor: this.actor,
			source: source.system,
			system: foundry.utils.duplicate(this.actor.system),
			items: Array.from(this.actor.items.toObject()).sort((a, b) => (a.sort || 0) - (b.sort || 0)),
			abilities: foundry.utils.deepClone(this.actor.system.abilities),
			saves: foundry.utils.deepClone(this.actor.system.saves),

			config: CONFIG.SUNKEN
		};

		const enrichmentOptions = {
			async: true,
			secrets: source.isOwner,
			rollData: this.actor?.getRollData() ?? {},
			relativeTo: this.actor
		};

		for (const [a, abl] of Object.entries(context.abilities)) {
			abl.label = CONFIG.SUNKEN.abilities[a]?.label;
			abl.features = CONFIG.SUNKEN.abilities[a]?.features.split(", ");
			abl.abbreviation = CONFIG.SUNKEN.abilities[a]?.abbreviation;
		}
		for (const [s, save] of Object.entries(context.saves)) {
			save.label = CONFIG.SUNKEN.saves[s]?.label;
		}

		context.descriptionHTML = await TextEditor.enrichHTML(source.system.notes, enrichmentOptions);

		this._prepareItems(context);

		if (context.class) {
			context.abilitiesHTML = await TextEditor.enrichHTML(context.class.system.abilities, enrichmentOptions);
		}

		return context;
	}

	_prepareItems(context) {
		context.favorites = [];
		context.itemList = {
			equipment: [],
			loot: [],
			spell: [],
			trait: [],
			weapon: []
		};
		context.skills = [];
		context.items.forEach((i) => {
			if (i.type === "class") {
				context.class = i;
			} else if (i.type === "skill") {
				i.abl = CONFIG.SUNKEN.abilities[i.system.ability]?.abbreviation;
				context.skills.push(i);
			} else context.itemList[i.type].push(i);
			if (i.system.favorite) context.favorites.push(i);
		});
		context.settings = {
			luckHealing: game.settings.get("sunkenlands", "luckHealing"),
			settingTitle: game.settings.get("sunkenlands", "settingTitle"),
			titleSize: game.settings.get("sunkenlands", "titleSize"),
			goldName: game.settings.get("sunkenlands", "goldName"),
			silverName: game.settings.get("sunkenlands", "silverName"),
			copperName: game.settings.get("sunkenlands", "copperName"),
			
		  }
	}

	activateListeners(html) {
		super.activateListeners(html);

		if (!this.isEditable) return;

		html.find("[data-ability] .rollable").on("click", async (ev) => {
			const { ability } = ev.target.closest(".ability").dataset;
			const abl = this.actor.system.abilities[ability];
			console.log ("ABL")
			console.log (abl)
			let atributo=CONFIG.SUNKEN.abilities[ability].label
			let title=atributo+" "+abl.value
			if (Number(abl.mod)!=0){
				title+=" ("
				if (Number(abl.mod)>0){
					title+="+"+Math.abs(abl.mod)
				}
				else {
					title+=abl.mod
				}
				title+=")"
			}
			let html_content='<div class="dialogo">'
			html_content+='<table><tr><td><h3><label>'+title+'</label></h3></td></tr></table>'
			html_content+='<table><tr><td><h3><label>BONO&nbsp;</label><input name="modificador" id="modificador" data-dtype="Number" value="0" size=2></input></h3></td>'
			html_content+='</tr></table></div>'
			let d = new Dialog({
				title: CONFIG.SUNKEN.abilities[ability].label,
				content: html_content,
				buttons: {
				 roll: {
				  icon: '<i class="fa-solid fa-dice" style="color: #34435C;"></i>',
				  label: "Tirar",
				  callback: () => {
					attibuteRoll (this.actor, "1d20", CONFIG.SUNKEN.abilities[ability].label, abl.value, abl.mod, document.getElementById("modificador").value, true);
				  }
				 }
				},
				render: html => console.log("Register interactivity in the rendered dialog"),
				close: html => console.log("This always is logged no matter which option is chosen")
			   });
			   d.render(true);
		});

		html.find("[data-save] .rollable").on("click", async (ev) => {
			const { save } = ev.target.closest(".save").dataset;
			const s = this.actor.system.saves[save];
			console.log ("SAVE ROLL")
			console.log (s)
			let titulo=CONFIG.SUNKEN.saves[save].label+" "+s.value
			let html_content='<div class="dialogo">'
			html_content+='<table><tr><td><h3><label>'+titulo+'</label></h3></td></tr></table>'
			html_content+='<table><tr><td><h3><label>BONO&nbsp;</label><input name="modificador" id="modificador" data-dtype="Number" value="0" size=2></input></h3></td>'
			html_content+='</tr></table></div>'
			let d = new Dialog({
				title: CONFIG.SUNKEN.saves[save].label,
				class: "sunken",
				content: html_content,
				buttons: {
				 roll: {
				  icon: '<i class="fa-solid fa-dice" style="color: #34435C;"></i>',
				  label: "Tirar",
				  callback: () => {
					let modificador=document.getElementById("modificador").value;
					let rolltext="1d20+"+modificador
					//attibuteRoll (rolltext, this.actor, s.value, false, titulo);
					saveRoll (this.actor, "1d20", CONFIG.SUNKEN.saves[save].label, s.value, document.getElementById("modificador").value, true)
				  }
				 }
				},
				render: html => console.log("Register interactivity in the rendered dialog"),
				close: html => console.log("This always is logged no matter which option is chosen")
			   });
			   d.render(true);
		});

		html.find("[data-action] .item-image").on("click", (ev) => {
			ev.preventDefault();
			console.log ("FUNCION MOSTRAR")
			const itemId = ev.currentTarget.closest(".item").dataset.itemId;
			const item = this.actor.items.get(itemId);
			return item.displayCard(ev);
		});

		html.find(".item-rollable").on("click", async (ev) => {
			if (this.actor.type=='npc'){return}
			const { itemId } = ev.target.closest(".item").dataset;
			const item = this.actor.items.get(itemId);
			console.log ("INFO ITEM")
			console.log (item)
			let { ability, bonus } = item.system;
			switch (item.type){
				case 'weapon':
				{
					console.log ("SOY UN ARMA")
					if (item.system.type=='melee'){
						ability="str"
					}
					else{
						ability="dex"
					}
					const abl = this.actor.system.abilities[ability];
					console.log ("ACTOR")
					console.log (this.actor)
					console.log (abl)
					let title=item.name
					if (Number(bonus)!=0){
						title+=" ("
						if (Number(bonus)>0){
							title+="+"+Math.abs(bonus)
						}
						else {
							title+=bonus
						}
						title+=")"
					}
					title+="<br>"+CONFIG.SUNKEN.abilities[ability].label+" "+abl.value
					if (Number(abl.mod)!=0){
						title+=" ("
						if (Number(abl.mod)>0){
							title+="+"+Math.abs(abl.mod)
						}
						else {
							title+=abl.mod
						}
						title+=")"
					}
					title+=" BAB: "
					if (Number(this.actor.system.bab)>0){
						title+="+"+this.actor.system.bab
					}
					else {
						title+=this.actor.system.bab
					}
					let html_content='<div class="dialogo">'
					html_content+='<table><tr><td><h3><label>'+title+'</label></h3></td></tr></table>'
					html_content+='<table><tr><td><h3><label>BONO ATAQUE&nbsp;</label></h3></td><td><h3><label>BONO DAÑO&nbsp;</label></h3></td></tr>'
					html_content+='<tr><td><input style="font-size: 1.5em;" name="modificador" id="modificador" data-dtype="Number" value="0" size=2></input></td>'
					html_content+='<td><input style="font-size: 1.5em;" name="modificadordano" id="modificadordano" data-dtype="Number" value="0" size=2></input></td>'
					html_content+='</tr></table></div>'
					let enemy= Array.from(game.user.targets)[0]?.actor;
					if (enemy){
						console.log ("TENGO TARGET")
						console.log (enemy)
						let d = new Dialog({
							title: item.name+" ("+item.system.type+")",
							content: html_content,
							buttons: {
				 				roll: {
				  					icon: '<i class="fa-solid fa-dice" style="color: #34435C;"></i>',
				  					label: "Tirar",
				  					callback: () => {
										let dano=item.system.damage
										if (item.system.type=='melee'){
											dano+="+"+abl.mod
										}
										attackRoll (this.actor, "1d20", CONFIG.SUNKEN.abilities[ability].label, abl.value, abl.mod, document.getElementById("modificador").value, bonus, this.actor.system.bab, dano, document.getElementById("modificadordano").value, enemy, true);
				  					}
				 				}
							},
							render: html => console.log("Register interactivity in the rendered dialog"),
							close: html => console.log("This always is logged no matter which option is chosen")
			   			});
						d.render(true);
					}
					else{
						console.log ("NO TENGO TARGET")
						ui.notifications.warn(game.i18n.localize("SUNKEN.messages.noTarget"));
					}
					break
			   		
				}
				case 'spell':
				{
					console.log ("SOY UN HECHIZO")
					if (item.system.ability=='int'||item.system.ability=='wis'||item.system.ability=='cha'){
						const abl = this.actor.system.abilities[item.system.ability];
						let title=item.name+"<br>"+CONFIG.SUNKEN.abilities[ability].label+" "+abl.value
						if (Number(abl.mod)!=0){
							title+=" ("
							if (Number(abl.mod)>0){
								title+="+"+Math.abs(abl.mod)
							}
							else {
								title+=abl.mod
							}
							title+=")"
						}
						let html_content='<div class="dialogo">'
						html_content+='<table><tr><td><h3><label>'+title+'</label></h3></td></tr></table>'
						html_content+='<table><tr><td><h3><label>BONO&nbsp;</label><input name="modificador" id="modificador" data-dtype="Number" value="0" size=2></input></h3></td>'
						html_content+='</tr></table></div>'
						let d = new Dialog({
							title: item.name,
							content: html_content,
							buttons: {
				 				roll: {
				  					icon: '<i class="fa-solid fa-dice" style="color: #34435C;"></i>',
				  					label: "Tirar",
				  					callback: () => {
										attibuteRoll (this.actor, "1d20", CONFIG.SUNKEN.abilities[ability].label, abl.value, abl.mod, document.getElementById("modificador").value, true);
				  					}
				 				}
							},
							render: html => console.log("Register interactivity in the rendered dialog"),
							close: html => console.log("This always is logged no matter which option is chosen")
			   			});
			   			d.render(true);
					}
					break
				}
				case 'equipment':
				{
					console.log ("SOY UN EQUIPO")
					break
				}
				case 'skill':
				{
					if (!ability) return;
					const abl = this.actor.system.abilities[ability];
					console.log (abl)
					let title=item.name+" +"+bonus+ "<br>"+CONFIG.SUNKEN.abilities[ability].label+" "+abl.value
					if (Number(abl.mod)!=0){
						title+=" ("
						if (Number(abl.mod)>0){
							title+="+"+Math.abs(abl.mod)
						}
						else {
							title+=abl.mod
						}
						title+=")"
					}
					let html_content='<div class="dialogo">'
					html_content+='<table><tr><td><h3><label>'+title+'</label></h3></td></tr></table>'
					html_content+='<table><tr><td><h3><label>BONO&nbsp;</label><input name="modificador" id="modificador" data-dtype="Number" value="0" size=2></input></h3></td>'
					html_content+='</tr></table></div>'
					let d = new Dialog({
						title: item.name,
						content: html_content,
						buttons: {
				 			roll: {
				  				icon: '<i class="fa-solid fa-dice" style="color: #34435C;"></i>',
				  				label: "Tirar",
				  				callback: () => {
									skillRoll (this.actor, "1d20", CONFIG.SUNKEN.abilities[ability].label, abl.value, abl.mod, item.name, bonus, document.getElementById("modificador").value, true);
				  				}
				 			}
						},
						render: html => console.log("Register interactivity in the rendered dialog"),
						close: html => console.log("This always is logged no matter which option is chosen")
			   		});
			   		d.render(true);
					break
				}

			}
		});
		html.find(".healing-roll").on("click", (ev) => {
			ev.preventDefault();
			console.log ("HEALLING FUNCTION")
			console.log (this.actor)
			let actorclass=this.actor.items.find((k) => k.type === "class");
			console.log ("CLASS")
			console.log (actorclass)
			if (Number(this.actor.system.fortunePoints.value)<=0){
				ui.notifications.warn(game.i18n.localize("SUNKEN.messages.noFortune"));
			}
			else{
				let fortuna=Number(this.actor.system.fortunePoints.value)
				fortuna--
				this.actor.update({'system.fortunePoints.value': fortuna})
				healingRoll (this.actor)
			}
			
		});

		html.find(".item-favorite").on("click", (ev) => {
			ev.preventDefault();
			const li = ev.currentTarget.closest(".item");
			const item = this.actor.items.get(li.dataset.itemId);
			item.update({ "system.favorite": !item.system.favorite });
		});

		html.find(".item-equip").on("click", (ev) => {
			ev.preventDefault();
			const li = ev.currentTarget.closest(".item");
			const item = this.actor.items.get(li.dataset.itemId);
			item.update({ "system.equipped": !item.system.equipped });
		});

		html.find(".item-create").on("click", (ev) => {
			ev.preventDefault();
			const header = ev.currentTarget;
			const type = header.dataset.type;

			const itemData = {
				name: CONFIG.Item.documentClass.defaultName({ type, parent: this.actor }),
				type: type
			};
			this.actor.createEmbeddedDocuments("Item", [itemData], { renderSheet: true });
		});

		html.find(".item-edit").click((ev) => {
			const li = ev.currentTarget.closest(".item");
			const item = this.actor.items.get(li.dataset.itemId);
			item.sheet.render(true);
		});

		// Delete Inventory Item
		html.find(".item-delete").click((ev) => {
			const li = ev.currentTarget.closest(".item");
			this.actor.deleteEmbeddedDocuments("Item", [li.dataset.itemId]);
			this.render(false);
		});
	}

	async _onDropItemCreate(itemData) {
		const items = Array.isArray(itemData) ? itemData : [itemData];
		const toCreate = items.filter((item) => !this.unsupportedItemTypes.has(item.type));
		// Create the owned items as normal
		return this.actor.createEmbeddedDocuments("Item", toCreate);
	}
}
