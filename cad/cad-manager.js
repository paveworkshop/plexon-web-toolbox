import { Vector2 } from "../spacial/vector.js"
import { Bounds2 } from "../spacial/bounds.js"


import EventEmitter from "../event/event.js"

import Drawing from "../drawing/drawing.js"

import { Part2D } from "../cad/part.js"


import Polyline from "./polyline.js"

import { Rect, Circle } from "./shape.js"

import { MappingQuad } from "./mapping-quad.js"

import Cursor from "../drawing/cursor.js"

const CURSOR_RADIUS = 10

export default class CADManager extends EventEmitter
{
	constructor(dom)
	{
		super()

		this.dom = dom
		
		this.drawing = new Drawing(this.dom, null)

		this.machineQuad = null
		this.machineBounds = null

		this.cursor = new Cursor(this.drawing.canvas)

		this.editing = null
		this.selection = null

		this.geometries = []

	}

	build()
	{
		// Setup canvas
		// Setup cursor and handle events

		/**

		this.cursor.on("tap-start", (location) => {

			if (this.editing === null)
			{

				this.geometries.forEach(geometry => {
						
					const selected = geometry.interact({ location, searchRadius: CURSOR_RADIUS})
					
					if (selected)
					{
						this.setSelection(geometry)

					}
				})

			}


		})


		this.cursor.on("tap-end", (location) => {

			if (this.editing !== null)
			{

				if (this.editing.type === "polyline")
				{
					this.editing.extend(location)
				}

			}
			else
			{
				if (this.selection === null)
				{
					this.setEditing(this.createPoly(location))
				}
				else
				{
					this.setSelection(null)
				}
			}
			


		})

		this.cursor.on("tap-frame", (location, vector) => {

			if (this.selection !== null)
			{
				this.selection.setPosition(location)
			}

			
		})

		**/


		// Load calibration

		this.calibrate()
		this.editing.extend(new Vector2(1069, 554))
		this.editing.extend(new Vector2(136, 572))
		this.editing.extend(new Vector2(131, 99))
		this.editing.extend(new Vector2(1068, 91))


	}

	calibrate()
	{
		console.log("Calibrating...")

		this.machineQuad = new MappingQuad()

		this.machineQuad.on("finish", () => {
			this.setEditing(null)
			console.log("Calibrated.")
		})

		this.setEditing(this.machineQuad)

	}

	export()
	{

		if (this.machineQuad === null || this.machineBounds === null)
		{
			console.log("Cannot export - mapping incomplete!")
			return null
		}

		const parts = []
		this.geometries.forEach(geometry => {

			const points = geometry.getPoints()

			if (points === null || points.length === 0)
			{
				return
			}

			const mapped = this.machineQuad.remap(points, this.machineBounds)
			
			const part = new Part2D(mapped, [], [])
			parts.push(part)

		})

		this.emit("export", parts)

	}

	addGeometry(geometry)
	{
		if (!this.geometries.includes(geometry))
		{

			geometry.on("change", () => {
				//this.draw()
			})

			geometry.on("finish", () => {
				this.setEditing(null)
			})

			this.geometries.push(geometry)

		}

	}

	removeGeometry(geometry)
	{
		if (this.geometries.includes(geometry))
		{
			this.geometries = this.geometries.filter(remainingGeometry => removeGeometry !== geometry)
		}
	}

	setEditing(geometry)
	{

		this.setSelection(null)

		this.editing = geometry
	}

	setSelection(geometry)
	{

		if (geometry === null)
		{
			if (this.selection !== null)
			{
				this.selection.selected = false
			}
		}
		else
		{
			geometry.selected = true
		}
		
		this.selection = geometry
		
	}

	createPoly(origin)
	{

		const polyline = new Polyline(origin)

		this.addGeometry(polyline)
		
		return polyline
	}

	draw()
	{
		this.drawing.clear()

		if (this.machineQuad !== null)
		{
			this.machineQuad.draw(this.drawing)
		}

		this.geometries.forEach(geometry => {
			geometry.draw(this.drawing)
		})

		if (this.cursor.position !== null)
		{
			const cursorSize = this.cursor.pressed ? CURSOR_RADIUS : CURSOR_RADIUS * 2
			const cursorColour =  this.cursor.pressed ? [120, 255, 220] : [255, 200, 150]
			this.drawing.addPoint(this.cursor.position, cursorSize, cursorColour)
		}
	}

	setCursors(cursors)
	{
		let cursor = null
		if (cursors.length === 1)
		{
			cursor = cursors[0]
		}

		this.cursor.setPosition(cursor)

		
	}

	setMachineBounds(bounds)
	{
		this.machineBounds = new Bounds2(bounds.x, bounds.y, bounds.w, bounds.h)
	}

	createRect(bounds)
	{
		const rect = new Rect(bounds)

		this.addGeometry(rect)
	}

	createCircle(centre, diameter)
	{
		const circle = new Cicle(centre, diameter)

		this.addGeometry(circle)
	}

}