export class Parameter
{

	constructor(name, min, max, initialFraction=0)
	{
		this.name = name

		this.min = min
		this.max = max

		this.range = this.max - this.min

		this.setFractional(initialFraction)

		this.last = this.value

		this.target = null

		this.fadeStart = null
		this.fadeEnd = null

	}

	get()
	{
		this.update()
		
		return this.value
	}

	setFractional(fraction)
	{
		this.set(this.min + this.range * fraction)
	}

	set(value)
	{
		this.value = Math.max(this.min, Math.min(this.max, value))
	}

	update()
	{
	
		if (this.target !== null)
		{
			let t = (Date.now() - this.fadeStart) / (this.fadeEnd - this.fadeStart)

			if (t > 1)
			{
				t = 1
				this.fadeStart = null
				this.fadeEnd = null

				this.set(this.target)

				this.target = null
			}
			else
			{
				const value = this.last + (this.target - this.last) * t

				this.set(value)
			}

		}
	}

	fadeTo(value, millis)
	{

		this.fadeStart = Date.now()
		this.fadeEnd = Date.now() + millis

		this.last = this.value
		this.target = value

	}
}

export class ColourParameter
{
	constructor(initial)
	{
		this.r = new Parameter("r", 0, 255, initial[0])
		this.g = new Parameter("g", 0, 255, initial[1])
		this.b = new Parameter("b", 0, 255, initial[2])
	}

	get()
	{
		return [this.r.get(), this.g.get(), this.b.get()]
	}

	set(value)
	{
		this.r.set(value[0])
		this.g.set(value[1])
		this.b.set(value[2])
	}

	fadeTo(value, millis)
	{

		this.r.fadeTo(value[0], millis)
		this.g.fadeTo(value[1], millis)
		this.b.fadeTo(value[2], millis)

	}
}