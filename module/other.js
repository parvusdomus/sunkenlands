export async function restingMessage (actor) {
    console.log ("FUNCION DESCANSO 2")
	let header=actor.name+" Descansa esta noche..."
	let restingContents = await renderTemplate("systems/sunkenlands/templates/chat/resting.html", { 
		rollType: "resting",
		canReroll: false,
		header: header,
		pjImage: actor.prototypeToken.texture.src
	});
	const restMessage = {
		speaker: ChatMessage.getSpeaker(),
		content: restingContents,
		rollMode: game.settings.get("core", "rollMode")
	};
	ChatMessage.create(restMessage);
    return;
}

export async function castingMessage (actor, item) {
	let header=actor.name+" lanza "+item.name
	let castingContents = await renderTemplate("systems/sunkenlands/templates/chat/casting.html", { 
		rollType: "casting",
		canReroll: false,
		header: header,
		pjImage: actor.prototypeToken.texture.src,
        spellImage: item.img,
        spellName: item.name,
        description: item.system.description
	});
	const castMessage = {
		speaker: ChatMessage.getSpeaker(),
		content: castingContents,
		rollMode: game.settings.get("core", "rollMode")
	};
	ChatMessage.create(castMessage);
    return;
}