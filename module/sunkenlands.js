import * as applications from "./applications/_module.js";
import * as dataModels from "./data/_module.js";
import * as dice from "./dice/_module.js";
import * as documents from "./documents/_module.js";
import * as utils from "./utils.js";
import * as chat from './documents/chat-message.js'
import SUNKEN from "./config.js";

import registerSettings from "./settings.js";

globalThis.sunken = {
	// applications,
	config: SUNKEN,
	dice,
	dataModels,
	documents,
	utils
};

//Hooks.on('getChatLogEntryContext', chat.addChatMessageContextOptions)
Hooks.on('getChatMessageContextOptions', chat.addChatMessageContextOptions)

Hooks.once("init", function () {
	globalThis.sunken = game.sunken = Object.assign(game.system, globalThis.sunken);
	CONFIG.SUNKEN = SUNKEN;
	CONFIG.Dice.RollSUNKEN = dice.RollSUNKEN;
	CONFIG.Dice.rolls.push(dice.RollSUNKEN);

	CONFIG.Actor.dataModels.character = dataModels.CharacterData;
	CONFIG.Actor.dataModels.npc = dataModels.NpcData;

	CONFIG.Item.dataModels.class = dataModels.ClassData;
	CONFIG.Item.dataModels.equipment = dataModels.EquipmentData;
	CONFIG.Item.dataModels.loot = dataModels.ItemTemplate;
	CONFIG.Item.dataModels.skill = dataModels.SkillData;
	CONFIG.Item.dataModels.spell = dataModels.SpellData;
	CONFIG.Item.dataModels.trait = dataModels.EquipmentData;
	CONFIG.Item.dataModels.weapon = dataModels.WeaponData;

	CONFIG.Actor.documentClass = documents.ActorSUNKEN;
	CONFIG.Item.documentClass = documents.ItemSUNKEN;

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("sunkenlands", applications.ActorSheetSUNKEN, {
		types: ["character"],
		makeDefault: true
	});
	Actors.registerSheet("sunkenlands", applications.NPCSheetSUNKEN, {
		types: ["npc"],
		makeDefault: true
	});

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("sunkenlands", applications.ItemSheetSUNKEN, {
		makeDefault: true
	});

	registerSettings();

	if (game.settings.get("sunkenlands", "simplified-saves")) {
		delete CONFIG.SUNKEN.saves.poison;
		delete CONFIG.SUNKEN.saves.spell;
		delete CONFIG.SUNKEN.saves.breath;
		delete CONFIG.SUNKEN.saves.magicItem;
		delete CONFIG.SUNKEN.saves.polymorph;
	} else {
		delete CONFIG.SUNKEN.saves.fortitude;
		delete CONFIG.SUNKEN.saves.reflex;
		delete CONFIG.SUNKEN.saves.will;
	}

	utils.registerHandlebarsHelpers();
	utils.preloadTemplates();
});

Hooks.once("i18nInit", () => utils.performPreLocalization(CONFIG.SUNKEN));

//Hooks.on("renderChatLog", (app, html, data) => {
//	documents.ItemSUNKEN.chatListeners(html);
//});

Hooks.on('renderChatMessage', (message, html) => documents.ItemSUNKEN.chatListeners(message, html))
//Hooks.on('renderChatLog', (message, html) => documents.ItemSUNKEN.chatListeners(message, html))

