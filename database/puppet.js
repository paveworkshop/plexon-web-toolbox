import { Vector2 } from "../spacial/vector.js"
import EventEmitter from "../event/event.js"

export default class Puppet extends EventEmitter
{
	constructor(parameters, layer)
	{
		super()

		this.parameters = parameters
		this.host = null

		this.layer = layer

		this.changed = true
	}

	update(frameDelta)
	{
		
	}

	draw(target)
	{

	}

	render(target)
	{

		this.draw(target)

		this.changed = false

	}

	set(parameter, value)
	{
		if (!(parameter in this.parameters))
		{
			return
		}
		
		let internalValue = value
		if (value instanceof Vector2)
		{
			internalValue = value.clone()
		}

		this.parameters[parameter] = internalValue

		this.emit("set", parameter, value)
		
		this.changed = true
	}

	checkHovered(cursorLocation)
	{
		return false
	}
}
