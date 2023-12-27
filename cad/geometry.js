import { Vector2 } from "../spacial/vector.js"
import { Bounds2 } from "../spacial/bounds.js"

import EventEmitter from "../event/event.js"

const POINT_RADIUS = 12
const LINE_THICKNESS = 6

export default class Geometry extends EventEmitter
{
	constructor(type)
	{
		super()
		this.guid = null
		this.type = type

		this.bounds = null

		this.selected = false
		this.offset = new Vector2(0, 0)

		this.pointRadius = POINT_RADIUS
		this.lineThickness = LINE_THICKNESS
		this.crosshairRadius = this.pointRadius * 4

	}

	draw(target)
	{

	}

	interact(cursor)
	{
		return false
	}

	setPosition(position)
	{

	}

	onChange()
	{
		this.emit("change", () => {})
	}
}
