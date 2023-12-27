const ABSOLUTE_TOLERANCE = 0.001

export const Vector2ListFromBuffer = (buffer, discardNulls=false) => {

	const points = []

	for (let i = 0; i < buffer.length/2; i++)
	{
		const x = buffer[i*2]
		const y = buffer[i*2+1]
		let point = null

		if (x !== null && y !== null)
		{
			point = new Vector2(x, y)

			points.push(point)		
		}
		else
		{

			if (!discardNulls)
			{
				points.push(point)
			}

		}
	}

	return points

}

export const RadialUnitVectors = (radialCount) => {

	const angleStep = 2 * Math.PI / radialCount
	const vectors = []

	for (let i = 0; i < radialCount; i++)
	{
		const angle = i * angleStep
		vectors.push(new Vector2(-Math.cos(angle), Math.sin(angle)))
	}

	return vectors
}

export const RandomVector2 = (bounds) => {

	return new Vector2(bounds.x + Math.random() * bounds.w, bounds.y + Math.random() * bounds.h)

}


export class Vector2
{
	constructor(x=0, y=0)
	{
		this.x = x
		this.y = y
	}

	equals(other)
	{

		const xEquals = Math.abs(this.x - other.x) < ABSOLUTE_TOLERANCE
		const yEquals = Math.abs(this.y - other.y) < ABSOLUTE_TOLERANCE

		return xEquals && yEquals
	}

	add(other)
	{
		return new Vector2(this.x + other.x, this.y + other.y)
	}

	sub(other)
	{
		return new Vector2(this.x - other.x, this.y - other.y)
	}

	dot(other)
	{
		return (this.x*other.x + this.y*other.y)
	}

	cross(other)
	{
		return (this.x*other.y - this.y*other.x)
	}

	multiply(other)
	{
		return new Vector2(this.x*other.x, this.y*other.y)
	}

	divide(other)
	{
		return new Vector2(this.x/other.x, this.y/other.y)
	}

	scale(factor)
	{
		return new Vector2(this.x*factor, this.y*factor)
	}

	unitise()
	{
		const size = this.size()

		return size === 0 ? new Vector2(0, 0) : this.scale(1/size)
	}

	size()
	{
		return Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5)
	}

	sizeSQ()
	{
		return (Math.pow(this.x, 2) + Math.pow(this.y, 2))
	}

	perp()
	{
		return new Vector2(-this.y, this.x)
	}

	round()
	{
		return new Vector2(Math.round(this.x), Math.round(this.y))
	}

	floor()
	{
		return new Vector2(Math.floor(this.x), Math.floor(this.y))
	}

	abs()
	{
		return new Vector2(Math.abs(this.x), Math.abs(this.y))
	}

	clone()
	{
		return new Vector2(this.x, this.y)
	}

	copy(other)
	{
		this.x = other.x
		this.y = other.y
	}

	toArray()
	{
		return [this.x, this.y]
	}

	toObject()
	{
		return { x:this.x, y:this.y }
	}

	toString()
	{
		return `X:${this.x} Y:${this.y}`
	}
}

export class Vector3
{
	constructor(x=0, y=0, z=0)
	{
		this.x = x
		this.y = y
		this.z = z
	}

	equals(other)
	{

		const xEquals = Math.abs(this.x - other.x) < ABSOLUTE_TOLERANCE
		const yEquals = Math.abs(this.y - other.y) < ABSOLUTE_TOLERANCE
		const zEquals = Math.abs(this.z - other.z) < ABSOLUTE_TOLERANCE

		return xEquals && yEquals && zEquals
	}

	translate(x, y, z)
	{
		return new Vector3(this.x + x, this.y + y, this.z + z)
	}

	add(other)
	{
		return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
	}

	sub(other)
	{
		return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z)
	}

	divide(other)
	{
		return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z)
	}	

	size()
	{
		return Math.pow((Math.pow(this.x, 2)+Math.pow(this.y, 2)+Math.pow(this.z, 2)), 0.5)
	}

	scale(factor)
	{
		return new Vector3(this.x*factor, this.y*factor, this.z*factor)
	}

	round()
	{
		return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z))
	}


	abs()
	{
		return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
	}

	clone()
	{
		return new Vector3(this.x, this.y, this.z)
	}

	toArray()
	{
		return [this.x, this.y, this.z]
	}

	toString()
	{
		return `X:${this.x} Y:${this.y} Z:${this.z}`
	}


}
