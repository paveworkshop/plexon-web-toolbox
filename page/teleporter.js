import ModelManager from "../../../api/plex/manager.js"


export default class Teleporter
{
	constructor(dir, source)
	{
		this.dir = dir

		ModelManager.subscribeRead(source)
		ModelManager.on("frame", model => {

			if (model.target === source && model.state !== null)
			{
				this.teleport(model.state.selection)
			}

		})

	}

	teleport(location)
	{
		const dest = this.dir + "/" + location + "/"
		if (window.location.href !== dest) window.location.href = dest
	}


}

