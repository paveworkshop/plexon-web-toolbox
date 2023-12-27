import Geometry from "./geometry.js"

import { Vector2 } from "../spacial/vector.js"
import { Bounds2 } from "../spacial/bounds.js"

import Chain from "./chain.js"

const FADE_IN_TIME = 600

export class Circle extends Geometry
{
	constructor(centre, diameter)
	{

	}
}

export class Rect extends Geometry
{

	constructor(bounds)
	{
		super("rect")

		this.initialBounds = bounds.clone()

		this.bounds = null
		this.centre = null

		this.set(bounds)

		this.created = performance.now()
	}

	set(bounds)
	{
		this.bounds = bounds
		this.centre = this.bounds.centre

		this.chain = new Chain(this.bounds.toRect())
		this.chain.add(this.chain.items[0].clone())
	}

	draw(target)
	{
		const elapsed = performance.now() - this.created
		
		const parameter = Math.min(elapsed / FADE_IN_TIME, 1)


		const size = this.initialBounds.scale(parameter).size

		const bounds = new Bounds2(this.centre.x - size.x / 2, this.centre.y - size.y / 2, size.x, size.y)

		this.set(bounds)


		const crosshairColour = this.selected ? [255, 200, 40] : [255, 255, 255]
		const pointColour = [255, 255, 255]
		const lineColour = [Math.round(parameter*255), 0, 100]

		const crosshairRadius = this.crosshairRadius * parameter
		target.addCrosshair(this.centre, crosshairRadius, this.lineThickness, crosshairColour)

		this.chain.forEachPair((start, end) => {

			target.addLine(start, end, this.lineThickness, lineColour)

		})

		this.chain.forEach((point, index) => {
			
			target.addPoint(point, this.pointRadius, pointColour)

		})


	}

}