export default class ItemSheetSUNKEN extends foundry.appv1.sheets.ItemSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["sunken", "sheet", "item"],
			width: 600,
			height: 450,
			scrollY: [".window-content"],
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "moves" }]
		});
	}

	get template() {
		const path = "systems/sunkenlands/templates/items";
		if (["loot", "trait"].includes(this.item.type)) return `${path}/item-sheet.hbs`;
		return `${path}/${this.item.type}-sheet.hbs`;
	}

	async getData() {
		const source = this.item.toObject();
		const context = {
			actor: this.actor,
			item: this.item,
			source: source.system,
			system: foundry.utils.duplicate(this.item.system),

			config: CONFIG.SUNKEN
		};

		const enrichmentOptions = {
			async: true,
			secrets: this.item.isOwner,
			rollData: this.item?.getRollData() ?? {},
			relativeTo: this.item
		};

		context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(source.system.description, enrichmentOptions);

		if (source.system.abilities) {
			context.abilitiesHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(source.system.abilities, enrichmentOptions);
		}

		context.abilitiesLabels = Object.fromEntries(
			Object.entries(CONFIG.SUNKEN.abilities).map(([k, v]) => [k, v.label])
		);

		return context;
	}
}
