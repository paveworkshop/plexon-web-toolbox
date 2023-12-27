import { Quad } from "../../../api/spacial/mapping.js"
import Geometry from "./geometry.js"


export class MappingQuad extends Geometry
{
	constructor(origin)
	{
		super("polyline")

		this.points = []

		this.pointRadius = 20

		this.quad = null


	}

	interact(cursor)
	{
		return false
	}


	draw(target)
	{

		if (this.quad !== null)
		{
			return
		}

		const pointColour = [255, 255, 255]

		this.points.forEach((point, index) => {
			
			target.addPoint(point, this.pointRadius, pointColour)

		})

	}

	extend(point)
	{
		if (this.points.length < 3)
		{
			this.points.push(point) 
		}
		else
		{
			this.points.push(point) 

			this.quad = new Quad(this.points)
			console.log(this.points)
			this.emit("finish")
		}
	}

	remap(points, bounds)
	{
		if (this.quad === null)
		{
			return null
		}

		let failed = false
		const mapped = []

		points.forEach((point) => {

			const parameter = this.quad.getParameter(point)

			if (parameter === null)
			{
				failed = true
				return
			}

			mapped.push(bounds.getCoordinate(parameter))
		})

		return failed ? null : mapped
	}

	setPosition(position)
	{
		
	}

}

