export default class ItemSUNKEN extends Item {
	static getDefaultArtwork(itemData) {
		switch (itemData.type){
			case "class":
				return { img: "systems/sunkenlands/styles/icons/class.svg" };
			case "equipment":
				return { img: "systems/sunkenlands/styles/icons/armor.svg" };
			case "loot":
				return { img: "systems/sunkenlands/styles/icons/loot.svg" };
			case "skill":
				return { img: "systems/sunkenlands/styles/icons/skill.svg" };
			case "spell":
				return { img: "systems/sunkenlands/styles/icons/spell.svg" };
			case "trait":
				return { img: "systems/sunkenlands/styles/icons/trait.svg" };
			case "weapon":
				return { img: "systems/sunkenlands/styles/icons/weapon.svg" };
		}
	}

	getRollData({ deterministic=false }={}) {
		let data = { ...(this.actor?.getRollData({ deterministic }) ?? {}), item: { ...this.system } };
		if (data?.item) {
			data.item.flags = { ...this.flags };
			data.item.name = this.name;
		}
		return data;
	}

	getAttackToHit() {
		const rollData = this.getRollData();
		const parts = [];

		if (this.isOwned) {
			if (this.system.type === "melee") parts.push("@abilities.str.mod");
			else parts.push("@abilities.dex.mod");

			parts.push("@bab");
		}

		return { rollData, parts };
	}

	static chatListeners(html) {
		html.on("click", ".chat-card button[data-action]", async (event) => {
			event.preventDefault();

			// Extract card data
			const button = event.currentTarget;
			button.disabled = true;
			const card = button.closest(".chat-card");
			const action = button.dataset.action;

			const actor = await this._getChatCardActor(card);
			if (!actor) return;

			let item = actor.items.get(card.dataset.itemId);
			if (!item) return null;

			switch (action) {
				case "attack":
					await item.rollAttack({ event });
					break;
				case "damage":
					await item.rollDamage({ event });
					break;
			}

			button.disabled = false;
		});
	}

	static async _getChatCardActor(card) {

		// Case 1 - a synthetic actor from a Token
		if (card.dataset.tokenId) {
			const token = await fromUuid(card.dataset.tokenId);
			if (!token) return null;
			return token.actor;
		}

		// Case 2 - use Actor ID directory
		const actorId = card.dataset.actorId;
		return game.actors.get(actorId) || null;
	}

	async displayCard(options = {}) {
		console.log ("DISPLAY CARD")
		const item=this;
		console.log (this)
		let template=""
		switch (item.type){
			case "equipment":
				{
					console.log ("SOY UNA ARMADURA")
					//HECHO
					template="systems/sunkenlands/templates/chat/armor-card.html"
					break;
				}
			case "loot":
				{
					//HECHO
					console.log ("SOY UN OBJETO")
					template="systems/sunkenlands/templates/chat/loot-card.html"
					break;
				}
			case "spell":
				{
					console.log ("SOY UN HECHIZO")
					template="systems/sunkenlands/templates/chat/spell-card.html"
					break;
				}
			case "trait":
				{
					console.log ("SOY UNA DOTE")
					//ESTE YA ESTA
					template="systems/sunkenlands/templates/chat/loot-card.html"
					break;
				}
			case "weapon":
				{
					console.log ("SOY UN ARMA")
					//ESTE YA ESTA
					template="systems/sunkenlands/templates/chat/weapon-card.html"
					break;
				}
		}
		// Render the chat card template
		const templateData = {
			actor: this.actor,
			item: this,
			header: item.name,
			description: await TextEditor.enrichHTML(this.toObject().system.description, {
				async: true,
				relativeTo: this,
				rollData: this.getRollData()
			})
		};
		console.log ("TEMPLATE DATA")
		console.log (templateData)

		const html = await renderTemplate(template, templateData);

		// Create the ChatMessage data object
		const chatData = {
			user: game.user.id,
			type: CONST.CHAT_MESSAGE_STYLES.OTHER,
			content: html,
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flags: { "core.canPopout": true }
		};

		// Apply the roll mode to adjust message visibility
		ChatMessage.applyRollMode(chatData, options.rollMode ?? game.settings.get("core", "rollMode"));

		// Create the Chat Message or return its data
		const card = options.createMessage !== false ? await ChatMessage.create(chatData) : chatData;

		return card;
	}

	async rollAttack() {
		// Get the parts and rollData for this item's attack
		const { parts, rollData } = this.getAttackToHit();

		const roll = new CONFIG.Dice.RollSUNKEN(["1d20"].concat(parts).join(" + "), rollData);

		if (roll === null) return null;

		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor: `${this.name} - ${game.i18n.localize("SUNKEN.Attack")}`
		});
		return roll;
	}

	async rollDamage({ critical, event=null, options={} }={}) {
		// Get roll data
		const rollData = this.getRollData();

		const roll = new CONFIG.Dice.RollSUNKEN(this.system.damage, rollData);

		if (roll === null) return null;

		await roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			flavor: `${this.name} - ${game.i18n.localize("SUNKEN.Damage")}`
		});
		return roll;
	}
}
