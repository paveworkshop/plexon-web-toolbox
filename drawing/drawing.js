import { Vector2 } from "../spacial/vector.js"
import { Bounds2 } from "../spacial/bounds.js"

import { WorldWindowMapping } from "./mapping.js"

class Drawing
{
	constructor(parent, worldBounds=null, readFrequently=false, speedy=false)
	{
		this.changed = false

		this.canvas = document.createElement("canvas")
		this.context = this.canvas.getContext("2d", { willReadFrequently: readFrequently })

		this.backgroundColour = [0,0,0,1]

		this.setColourMapping()

		this.mapping = null
		if (worldBounds !== null)
		{
			this.mapping = new WorldWindowMapping(worldBounds)

			this.mapping.on("change", () => {
				this.changed = true
			})

		}
		
		if (!speedy)
		{
			this.context.imageSmoothingEnabled = true
			this.context.imageSmoothingQuality = "high"
		}


		parent.appendChild(this.canvas)

		const handleResize = () => {
			this.setFullScreen()
		}

		handleResize()

		window.addEventListener("resize", handleResize)

		this.show()
	}

	clear()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.fillBackground()
		this.changed = false
	}

	mapWorldPoint(point)
	{
		if (this.mapping !== null)
		{
			return this.mapping.getWorldToWindow(point)
		}

		return point
	}

	mapDimension(dimension)
	{
		let mapped = dimension

		if (this.mapping !== null)
		{
			mapped = dimension*this.mapping.scaling
		}

		return mapped	
	}

	getRGBA(colour)
	{
		const drawColour = colour === null ? this.backgroundColour : colour
		return "rgba(" + drawColour[0] + ","  + drawColour[1] + "," + drawColour[2] + "," + (drawColour[3] === undefined ? 1 : drawColour[3]) + ")"
	}

	getHSLA(colour)
	{
		const drawColour = colour === null ? this.backgroundColour : colour
		return "hsla(" + drawColour[0] + ","  + drawColour[1] + "%," + drawColour[2] + "%," + (drawColour[3] === undefined ? 1 : drawColour[3]) + ")"
	}

	setColourMapping(colourFormat="rgba")
	{
		let colourFunc = this["get" + colourFormat.toUpperCase()]

		this.extractColour = colourFunc ? colourFunc : this.getRGBA
	}

	setId(id)
	{
		this.canvas.id = id
	}

	setFont(name, size, weight) 
	{
		this.context.font = `${weight} ${size}px ${name}`
	}

	setStrokeThickness(thickness) 
	{
		this.context.lineWidth  = `${thickness}`
	}

	setStrokeColour(colour) 
	{
		this.context.strokeStyle = this.extractColour(colour)
	}

	setFillColour(colour) 
	{
		this.context.fillStyle = this.extractColour(colour)
	}

	setBackground(colour) 
	{
		this.backgroundColour = colour
		this.fillBackground()
	}

	setFullScreen() 
	{
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight

		if (this.mapping === null)
		{
			return
		}
		this.mapping.setWindowBounds(this.getBounds())

	}

	getSize()
	{
		return new Vector2(this.canvas.width, this.canvas.height)
	}

	getCentre()
	{
		return new Vector2(this.canvas.width/2, this.canvas.height/2)
	}
	
	getCorners()
	{
		return [new Vector2(0, 0), new Vector2(this.canvas.width, 0), new Vector2(this.canvas.width, this.canvas.height), new Vector2(0, this.canvas.height)]
	}

	getBounds()
	{
		return new Bounds2(0, 0, this.canvas.width, this.canvas.height)
	}

	fillColour(colour)
	{
		this.setFillColour(colour)
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	fillBackground()
	{
		this.setFillColour(this.backgroundColour)
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	addText(text, origin, size, colour, centreWidth, centreHeight, font="Helvetica", weight="normal")
	{
		const mapped = this.mapWorldPoint(origin)

		this.setFont(font, this.mapDimension(size), weight)
		this.setFillColour(colour)

		this.context.textAlign = centreWidth ? "center" : "left"
		this.context.textBaseline = centreHeight ? "middle" : "alphabetic"
		
		this.context.fillText(text, mapped.x, mapped.y)
	}

	addPoint(centre, radius, colour)
	{
		const mapped = this.mapWorldPoint(centre)

		this.setFillColour(colour)
		this.context.beginPath()
		this.context.arc(mapped.x, mapped.y, this.mapDimension(radius), 0, 2*Math.PI)
		this.context.fill()
	}

	addLine(start, end, thickness, colour)
	{
		const mappedStart = this.mapWorldPoint(start)
		const mappedEnd = this.mapWorldPoint(end)

		this.setStrokeColour(colour)
		this.setStrokeThickness(this.mapDimension(thickness))
		this.context.beginPath()
		this.context.moveTo(mappedStart.x, mappedStart.y)
		this.context.lineTo(mappedEnd.x, mappedEnd.y)
		this.context.stroke()
	}

	addRect(bounds, colour)
	{

		this.setFillColour(colour)

		const mapped = this.mapWorldPoint(bounds.origin)
		this.context.fillRect(mapped.x, mapped.y, this.mapDimension(bounds.w), this.mapDimension(bounds.h))
		
	}


	addCrosshair(origin, size, thickness, colour)
	{

		const hVec = new Vector2(size, 0)
		const vVec = new Vector2(0, size)

		this.addLine(origin.sub(hVec), origin.add(hVec), thickness, colour)
		this.addLine(origin.sub(vVec), origin.add(vVec), thickness, colour)
		
	}

	setPolygonPath(points, closed=true)
	{		
		this.context.beginPath()

		points.forEach((point, index) => 
		{
			const mapped = this.mapWorldPoint(point)
			if (!index)
			{
				this.context.moveTo(mapped.x, mapped.y)
			}
			this.context.lineTo(mapped.x, mapped.y)
		})
			
		if (closed)
		{
			this.context.closePath()
		}
	}

	addPath(points, thickness, colour)
	{
		if (points.length < 2) return

		this.setStrokeColour(colour)
		this.setStrokeThickness(this.mapDimension(thickness))

		this.setPolygonPath(points, false)

		this.context.stroke()
	}

	addPolygon(points, thickness=-1, colour)
	{
		if (points.length < 2) return

		if (thickness<=0)
		{
			this.setFillColour(colour)

			this.setPolygonPath(points)

			this.context.fill()
		}
		else
		{
			this.setStrokeColour(colour)
			this.setStrokeThickness(this.mapDimension(thickness))

			this.setPolygonPath(points)

			this.context.stroke()
		}

	}

	addImage(image, location, scale=1, rotation=0, opacity=1)
	{
		// Quicker than using save / restore
		this.context.globalAlpha = opacity

		this.context.setTransform(scale, 0, 0, scale,location.x, location.y)
		
		this.context.rotate(rotation)

		this.context.drawImage(image, -image.width / 2, -image.height / 2)

		this.context.setTransform(1, 0, 0, 1, 0, 0) // Reset transform

		this.context.globalAlpha = 1

	}

	startOperation(operation)
	{
		this.context.globalCompositeOperation = operation
	}

	stopOperation()
	{
		this.context.globalCompositeOperation = "source-over"
	}

	export()
	{
		const buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
		return buffer.data
	}

	show()
	{
		this.canvas.style.display = "inherit"
	}

	hide()
	{
		this.canvas.style.display = "none"
	}

}



export default Drawing