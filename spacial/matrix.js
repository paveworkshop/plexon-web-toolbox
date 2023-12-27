class Matrix2
{
	constructor(a1=1, a2=0, a3=0, b1=0, b2=1, b3=0, c1=0, c2=0, c3=1)
	{
		this.data = [[a1, a2, a3], [b1, b2, b3], [c1, c2, c3]]
	}

	apply(point)
	{
		const x =  this.data[0][0] * point.x + this.data[0][1] * point.y + this.data[0][2]
		const y =  this.data[1][0] * point.x + this.data[1][1] * point.y + this.data[1][2]
		const w =  this.data[2][0] * point.x + this.data[2][1] * point.y + this.data[2][2]
		
		return new Vector2(x/w, y/w)
	}

	setRotation(theta)
	{
		this.data[0][0] = Math.cos(theta)
		this.data[0][1] = -Math.sin(theta)
		this.data[1][0] = this.data[0][1]
		this.data[1][1] = this.data[0][0]
	}

	addRotation(theta)
	{
		const s1 = this.data[1][0]
		const c1 = this.data[0][0]
		const s2 = Math.sin(theta)
		const c2 = Math.cos(theta)

		this.data[0][0] = c1 * c2 - s1 * s2
		this.data[0][1] = -c1 * s2 - s1 * c2
		this.data[1][0] = s1 * c2 + c1 * s2
		this.data[1][1] = -s1 * s2 + c1 * c2
	}

	setTranslation(offset)
	{
		this.data[0][2] = offset.x
		this.data[1][2] = offset.y
	}

	setScale(scale)
	{
		this.data[0][0] = scale
		this.data[1][1] = scale
	}

	clone()
	{
		return new Matrix2(this.data[0][0], this.data[0][1], this.data[0][2], this.data[1][0], this.data[1][1], this.data[1][2], this.data[2][0], this.data[2][1], this.data[2][2])
	}

}