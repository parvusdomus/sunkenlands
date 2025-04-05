import ActorSheetSUNKEN from "./base-actor-sheet.js";
import {attackRoll} from "../../dice/rolls.js";

export default class NPCSheetSUNKEN extends ActorSheetSUNKEN {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["sunken", "sheet", "actor", "npc"],
			height: 600,
			scrollY: [".window-content"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }],
			dragDrop: [{ dragSelector: ".items-list .item" }]
		});
	}

	get template() {
		return "systems/sunkenlands/templates/actors/npc-sheet.hbs";
	}

	/**
	 * Blocklist of item types that shouldn't be added to the actor.
	 * @returns {Set<string>}
	 */
	get unsupportedItemTypes() {
		//return new Set(["class", "equipment", "loot", "skill", "spell", "traits"]);
		return new Set(["class", "equipment", "loot", "skill", "traits"]);
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
		context.itemList = {
			weapon: [],
			spell: [],
		};
		context.skills = [];
		context.items.filter((i) => i.type === "weapon" || i.type === "spell")
			.forEach((i) => {
				context.itemList[i.type].push(i);
			});
		context.settings = {
			settingTitle: game.settings.get("sunkenlands", "settingTitle"),
			titleSize: game.settings.get("sunkenlands", "titleSize"),
		}
	}

	activateListeners(html) {
		super.activateListeners(html);

		if (!this.isEditable) return;
	
	html.find(".item-rollable").on("click", async (ev) => {
		console.log ("FUNCION PNJ")
		const { itemId } = ev.target.closest(".item").dataset;
		const item = this.actor.items.get(itemId);
		let { ability, bonus } = item.system;
		switch (item.type){
			case 'weapon':
			{
				console.log ("SOY UN ARMA")
				console.log ("ACTOR")
				console.log (this.actor)
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
									attackRoll (this.actor, "1d20", "", 0, 0, document.getElementById("modificador").value, bonus, 0, dano, document.getElementById("modificadordano").value, enemy, false);
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
			case "spell":
			{
				return item.displayCard(ev);
			}
		}
	});
	}

}
