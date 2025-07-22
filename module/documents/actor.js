
export default class ActorSUNKEN extends Actor {
	static getDefaultArtwork(actorData) {
		switch (actorData.type){
			case "character":
				return { img: "systems/sunkenlands/styles/icons/character.svg" };
			case "npc":
				return { img: "systems/sunkenlands/styles/icons/npc.svg" };
		}
	}
	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		const changes = {};
		const compendiumSource = this._stats.compendiumSource;
		if (!compendiumSource?.startsWith("Compendium.")) {
			if (this.baseType === "character") {
				changes.prototypeToken = {
					actorLink: true,
					disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY
				};
			}
		}
		this.updateSource(changes);
	}

	
}
