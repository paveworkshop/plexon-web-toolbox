import EventEmitter from "../event/event.js"

export default class ViewManager extends EventEmitter
{
	constructor(drawing)
	{
		super()

		this.drawing = drawing

		this.layers = {}

		this.idle = true
		this.changed = false

		this.lastPolled = Date.now()

	}


	update()
	{

		const now = Date.now()
		const delta = now - this.lastPolled

		this.lastPolled = now
		

		let changed = false
		let saveable = false

		// === UPDATE LOGIC ===

		changed = this.drawing.changed || this.changed

		Object.values(this.layers).forEach(puppets => {
			puppets.forEach(puppet => {
				puppet.update(delta)
				changed = changed || puppet.changed
			})	
		})

		if (!changed)
		{
			if (!this.idle)
			{
				this.idle = true
				saveable = true
			}

			return saveable
		}
		else
		{
			if (this.idle)
			{
				this.idle = false
			}
		}

		this.drawing.clear()

		Object.keys(this.layers).sort().forEach(layerIndex => {

			const puppets = this.layers[layerIndex]
			puppets.forEach(puppet => {
				puppet.render(this.drawing)
			})	
		})


		this.changed = false

		return saveable

	}

	getHovered(worldPoint, layer)
	{
		const puppets = this.layers[layer]

		if (!puppets)
		{
			return null
		}

		for (let i = 0; i < puppets.length; i++)
		{
			const puppet = puppets[i]
			const hovered = puppet.checkHovered(worldPoint)

			if (hovered)
			{
				return puppet.host
			}

		}

		return null
	}

	addPuppet(puppet)
	{
		if (!(puppet.layer in this.layers))
		{
			this.layers[puppet.layer] = []
		}

		this.layers[puppet.layer].push(puppet)
		this.changed = true

		this.emit("add-puppet", puppet)
	}

	removePuppet(puppet)
	{
		this.layers[puppet.layer] = this.layers[puppet.layer].filter(other => other !== puppet)
		this.changed = true

		this.emit("remove-puppet", puppet)
	}


}