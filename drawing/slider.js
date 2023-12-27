import { Zone } from "./layout.js"
import { Vector } from "./mapping.js"

export default class Slider extends Zone {

	constructor(bounds, fillColour, strokeColour)
	{
		super(bounds)

		this.parameter = 0

		this.barCount = 18
		this.barThickness = 0.5
		this.barWidth = 0.30

		this.fillColour = fillColour
		this.strokeColour = strokeColour


	}

	onSetDrawing()
	{
		this.draw()
	}

	onInteract(cursor)
	{
		
		const parameter = 1 - cursor.y

		if (parameter != this.parameter)
		{
			this.parameter = parameter
			this.emit("parameter-update", this.parameter)
		}
	
	}

	draw()
	{
		const count = Math.round(this.parameter * this.barCount)

		const bounds = this.bounds.scaled(this.drawing.getSize())

		this.drawing.addRect(bounds.rect(), null)


		//this.bounds.h * this.barCount

		const cellSize = bounds.h / this.barCount

		const rectThickness = cellSize * this.barThickness
		const gapSize = cellSize * (1 - this.barThickness)

		const offsetY = bounds.y + bounds.h - gapSize / 2

		const rectWidth = bounds.w * this.barWidth
		const startX = bounds.x + (bounds.w - rectWidth) / 2

		for (let i = 0; i < count; i++)
		{

			const startY = offsetY - cellSize * i


			const rectBounds = [startX, startY, rectWidth, rectThickness]
			this.drawing.addRect(rectBounds, this.fillColour)
			
		}

		const textOrigin = new Vector(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2)

		this.drawing.addText(Math.round(this.parameter*100).toString(), textOrigin, rectWidth * 0.8, this.strokeColour)

		
	}

}