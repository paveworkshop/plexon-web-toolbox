import { Vector2 } from "./vector.js"

export class Bounds2 {

	constructor(x, y, w, h) 
	{
		this.x=x
		this.y=y
		this.w=w
		this.h=h

		this.origin = new Vector2(this.x, this.y)
		this.size = new Vector2(this.w, this.h)

		this.centre = this.origin.add(this.size.scale(0.5))

	}

	scale(factor)
	{
		return new Bounds2(this.x, this.y, this.w*factor, this.h*factor)
	}

	multiply(vector)
	{
		return new Bounds2(this.x*vector.x, this.y*vector.y, this.w*vector.x, this.h*vector.y)
	}

	contains(point)
	{
		return (point.x > this.x) && (point.y > this.y) && (point.x < this.x + this.w) && (point.y < this.y + this.h)
	}

	getParameter(point)
	{
		return new Vector2((point.x - this.x)/this.w, (point.y - this.y)/this.h)
	}

	getCoordinate(parameter)
	{
		return this.origin.add(parameter.multiply(this.size))
	}

	toArray()
	{
		return [this.x, this.y, this.w, this.h]
	}

	toRect()
	{
		return [new Vector2(this.x, this.y), new Vector2(this.x + this.w, this.y), new Vector2(this.x + this.w, this.y + this.h), new Vector2(this.x, this.y + this.h)]
	}

	clone()
	{
		return new Bounds2(this.x, this.y, this.w, this.h)
	}
}