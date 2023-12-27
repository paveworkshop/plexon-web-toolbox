import { Vector, Quad } from "./mapping.js"
import Drawing from "./drawing.js"
import EventEmitter from "../event/event.js"

export class Element extends EventEmitter {

	constructor(drawing)
	{
		super()

		this.drawing = drawing
		this.children = []
	}

	addChild(child)
	{
		child.drawing = this.drawing
		this.children.push(child)

		child.build()
	}

	removeAllChildren()
	{
		this.children = []
	}

	build(cursor)
	{

		this.onBuild()

		this.children.forEach(child => {
			child.build()
		})

	}

	update(cursor)
	{
		this.draw(cursor)

		this.children.forEach(child => {
			child.update(cursor)
		})

	}

	resize()
	{
		this.onResize()

		this.children.forEach(child => {
			child.resize()
		})
	}

	interact(cursor)
	{
		const parameter = this.bounds.getParameter(cursor)

		this.onInteract(cursor)

		this.children.forEach(child => {
			child.interact(cursor)
		})
	}

	onInteract(parameter)
	{

	}

	onResize()
	{

	}

	onBuild()
	{
		
	}

	draw(cursor)
	{

	}

}

export class Zone extends Element {

	constructor(bounds) 
	{
		super()

		this.bounds = bounds
	}


}

export class Layout extends Element {

	constructor(domParent) 
	{
		super(new Drawing())

		this.domParent = domParent 

		this.quad = null
		this.cursor = null

		this.build()


	}

	setMappingBounds(vertices)
	{
		this.quad.corners = vertices
	}


	onBuild()
	{


		window.addEventListener("mousemove", (event) => {

			const scale = this.drawing.getSize()
			const cursor = (new Vector(event.clientX, event.clientY)).divide(scale)

			//this.setCursor(cursor)

		})

		this.drawing.setId("mapped-canvas")
		this.drawing.setFullScreen()	
		
		this.domParent.appendChild(this.drawing.canvas)

		this.quad = new Quad(this.drawing.getExtents())

	}

	draw(cursor)
	{
		this.drawing.clear()

		if (cursor !== null)
		{
			//this.drawing.addPoint(cursor, 12, [255, 240, 50])
		}
	
	}

	setCursor(cursor)
	{

		if (cursor === null)
		{
			return
		}


		this.children.forEach((zone) => {

			/**
			if (zone.bounds.contains(cursor))
			{
				zone.interact(cursor)
			}
			**/
		})

		this.cursor = cursor

		
	}

	addZone(zone)
	{
		this.addChild(zone)
	}

	onResize()
	{
		this.drawing.setFullScreen()
	}

}



