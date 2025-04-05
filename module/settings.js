export default function registerSettings() {
	game.settings.register("sunkenlands", "simplified-saves", {
		name: game.i18n.localize("SUNKEN.config.simplified-savesName"),
		hint: game.i18n.localize("SUNKEN.config.simplified-savesHint"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		requiresReload: true
	});
	game.settings.register("sunkenlands", "roll-over", {
		name: game.i18n.localize("SUNKEN.config.roll-overName"),
		hint: game.i18n.localize("SUNKEN.config.roll-overHint"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false
	});
	game.settings.register("sunkenlands", "doubleDamage", {
		name: game.i18n.localize("SUNKEN.config.doubleDamageName"),
		hint: game.i18n.localize("SUNKEN.config.doubleDamageHint"),
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false
	});
	game.settings.register("sunkenlands", "luckHealing", {
		name: game.i18n.localize("SUNKEN.config.luckHealingName"),
		hint: game.i18n.localize("SUNKEN.config.luckHealingHint"),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false
	});
	game.settings.register("sunkenlands", "settingTitle", {
		name: game.i18n.localize("SUNKEN.config.settingTitleName"),
		hint: game.i18n.localize("SUNKEN.config.settingTitleHint"),
		scope: "world",
		config: true,
		type: String,
		default: "Through the Sunken Lands",
		requiresReload: false
	});

	game.settings.register("sunkenlands", "titleSize", {
		name: game.i18n.localize("SUNKEN.config.titleSizeName"),
		hint: game.i18n.localize("SUNKEN.config.titleSizeHint"),
		scope: "world",
		config: true,
		type: Number,
		default: "2.5",
		requiresReload: false
	});

	game.settings.register("sunkenlands", "goldName", {
		name: game.i18n.localize("SUNKEN.config.settingGoldName"),
		hint: game.i18n.localize("SUNKEN.config.settingGoldHint"),
		scope: "world",
		config: true,
		type: String,
		default: "Gold",
		requiresReload: false
	});

	game.settings.register("sunkenlands", "silverName", {
		name: game.i18n.localize("SUNKEN.config.settingSilverName"),
		hint: game.i18n.localize("SUNKEN.config.settingSilverHint"),
		scope: "world",
		config: true,
		type: String,
		default: "Silver",
		requiresReload: false
	});

	game.settings.register("sunkenlands", "copperName", {
		name: game.i18n.localize("SUNKEN.config.settingCopperName"),
		hint: game.i18n.localize("SUNKEN.config.settingCopperHint"),
		scope: "world",
		config: true,
		type: String,
		default: "Copper",
		requiresReload: false
	});
}
