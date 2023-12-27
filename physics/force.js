import { Vector2 } from "../spacial/vector.js"

export default class Force
{
	constructor(direction, magnitude, duration)
	{
		this.direction = direction.unitise()
		this.magnitude = magnitude
		this.duration = duration

		this.acting = false

		this.resultant = null

		this.elapsed = 0
	}

	start()
	{
		this.resultant = this.direction.scale(this.magnitude)
		this.acting = true
	}

	stop()
	{
		this.resultant = null
		this.acting = false
	}

	update(delta)
	{
		if (!this.acting)
		{
			return
		}

		this.elapsed += delta

		if (this.elapsed > this.duration)
		{
			this.stop()
		}

	}


}
