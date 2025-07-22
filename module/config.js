import { preLocalize } from "./utils.js";

const SUNKEN = {};

SUNKEN.abilities = {
	str: {
		label: "SUNKEN.Ability.Str.Label",
		abbreviation: "SUNKEN.Ability.Str.Abbr",
		features: "SUNKEN.Ability.Str.Features"
	},
	dex: {
		label: "SUNKEN.Ability.Dex.Label",
		abbreviation: "SUNKEN.Ability.Dex.Abbr",
		features: "SUNKEN.Ability.Dex.Features"
	},
	con: {
		label: "SUNKEN.Ability.Con.Label",
		abbreviation: "SUNKEN.Ability.Con.Abbr",
		features: "SUNKEN.Ability.Con.Features"
	},
	int: {
		label: "SUNKEN.Ability.Int.Label",
		abbreviation: "SUNKEN.Ability.Int.Abbr",
		features: "SUNKEN.Ability.Int.Features"
	},
	wis: {
		label: "SUNKEN.Ability.Wis.Label",
		abbreviation: "SUNKEN.Ability.Wis.Abbr",
		features: "SUNKEN.Ability.Wis.Features"
	},
	cha: {
		label: "SUNKEN.Ability.Cha.Label",
		abbreviation: "SUNKEN.Ability.Cha.Abbr",
		features: "SUNKEN.Ability.Cha.Features"
	}
};

preLocalize("abilities", { keys: ["label", "abbreviation", "features"] });

SUNKEN.alignments = {
	law: {
		label: "SUNKEN.Alignments.Law.Label"
	},
	chaos: {
		label: "SUNKEN.Alignments.Chaos.Label"
	},
	neutral: {
		label: "SUNKEN.Alignments.Neutral.Label"
	},
	any: {
		label: "SUNKEN.Alignments.Any.Label"
	}
};

preLocalize("alignments", { keys: ["label"] });

SUNKEN.armorTypes = {
	light: "SUNKEN.Equipment.Light",
	medium: "SUNKEN.Equipment.Medium",
	heavy: "SUNKEN.Equipment.Heavy",
	natural: "SUNKEN.Equipment.Natural",
	shield: "SUNKEN.Equipment.Shield"
};
preLocalize("armorTypes");

SUNKEN.itemTypes = {
	equipment: "SUNKEN.Item.Equipment",
	loot: "SUNKEN.Item.Loot",
	spell: "SUNKEN.Item.Spell",
	trait: "SUNKEN.Item.Trait",
	weapon: "SUNKEN.Item.Weapon"
};
preLocalize("itemTypes");

SUNKEN.saves = {
	poison: {
		label: "SUNKEN.Save.Poison.Label"
	},
	spell: {
		label: "SUNKEN.Save.Spell.Label"
	},
	breath: {
		label: "SUNKEN.Save.Breath.Label"
	},
	magicItem: {
		label: "SUNKEN.Save.MagicItem.Label"
	},
	polymorph: {
		label: "SUNKEN.Save.Polymorph.Label"
	},
	fortitude: {
		label: "SUNKEN.Save.Fortitude.Label"
	},
	reflex: {
		label: "SUNKEN.Save.Reflex.Label"
	},
	will: {
		label: "SUNKEN.Save.Will.Label"
	}
};

preLocalize("saves", { keys: ["label"] });

SUNKEN.ranges = {
	self: "SUNKEN.Ranges.Self.Label",
	touch: "SUNKEN.Ranges.Touch.Label",
	near: "SUNKEN.Ranges.Near.Label",
	far: "SUNKEN.Ranges.Far.Label",
	cosmos: "SUNKEN.Ranges.Cosmos.Label"
};

preLocalize("ranges", { keys: ["label"] });

SUNKEN.timePeriods = {
	none: "SUNKEN.TimeNone",
	turn: "SUNKEN.TimeTurn",
	round: "SUNKEN.TimeRound",
	minute: "SUNKEN.TimeMinute",
	hour: "SUNKEN.TimeHour",
	day: "SUNKEN.TimeDay",
	week: "SUNKEN.TimeWeek",
	month: "SUNKEN.TimeMonth",
	year: "SUNKEN.TimeYear",
	conc: "SUNKEN.TimeConcentration",
	perm: "SUNKEN.TimePerm",
	inst: "SUNKEN.TimeInst"
};

preLocalize("timePeriods");

SUNKEN.scalarTimePeriods = {
	turn: "SUNKEN.TimeTurn",
	round: "SUNKEN.TimeRound",
	minute: "SUNKEN.TimeMinute",
	hour: "SUNKEN.TimeHour",
	day: "SUNKEN.TimeDay",
	week: "SUNKEN.TimeWeek",
	month: "SUNKEN.TimeMonth",
	year: "SUNKEN.TimeYear"
};

preLocalize("scalarTimePeriods");

SUNKEN.permanentTimePeriods = {
	conc: "SUNKEN.TimeConcentration",
	perm: "SUNKEN.TimePerm"
};

preLocalize("permanentTimePeriods");

SUNKEN.specialTimePeriods = {
	inst: "SUNKEN.TimeInst"
};

preLocalize("specialTimePeriods");

SUNKEN.spellTypes = {
	cantrip: "SUNKEN.Cantrip",
	spell: "SUNKEN.Spell",
	ritual: "SUNKEN.Ritual"
};

preLocalize("spellTypes");


SUNKEN.weaponTypes = {
	melee: "SUNKEN.Weapon.Melee",
	ranged: "SUNKEN.Weapon.Ranged"
};
preLocalize("weaponTypes");

export default SUNKEN;
