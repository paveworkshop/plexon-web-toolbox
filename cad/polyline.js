import Geometry from "./geometry.js"

const ANGLE_SNAP_TOLERANCE=0.5
const ANGLE_SNAP_DIVISION=Math.PI/4

class PolygonSide
{
	constructor(start, end)
	{
		this.start = start
		this.end = end


		this.vector = this.end.sub(this.start)
		this.direction = this.vector.unitise()
		this.tangent = new Vector2(this.vector.y, -this.vector.x).unitise()
	
		this.middle = this.start.add(this.vector.scale(0.5))

	}
}

export default class Polyline extends Geometry
{
	constructor(origin)
	{
		super("polyline")

		this.points = new CircularList()

		this.origin = origin
		this.extend(this.origin)

		this.closed = false
		this.regular = false

		this.crosshairRadius = this.pointRadius * 4

		this.centroid = null
		this.sides = [] 
	}

	interact(cursor)
	{
		let interacting = false
		if (this.centroid !== null)
		{	

			const offset = cursor.location.sub(this.centroid)
			if (offset.size() < (this.crosshairRadius+cursor.searchRadius))
			{
				interacting = true

				if (interacting && !this.selected)
				{
					this.offset = offset
				}
				
			}
			else
			{
				this.offset = new Vector2(0,0)
			}
		}

		return interacting
	}

	draw(target)
	{

		const lineColour = this.closed ? (this.regular ? [255, 200, 0] : [255, 0, 255]) : [255, 0, 255]
		const pointColour = [255, 255, 255]
		const crosshairColour = this.selected ? [255, 200, 40] : [255, 255, 255]

		this.points.forEachPair((start, end) => {

			target.addLine(start, end, this.lineThickness, lineColour)

		})

		this.points.forEach((point, index) => {
			
			target.addPoint(point, this.pointRadius, pointColour)

		})


		if (this.closed)
		{
			const crosshairRadius = this.selected ? this.crosshairRadius * 0.6 : this.crosshairRadius
			target.addCrosshair(this.centroid, crosshairRadius, this.lineThickness, crosshairColour)
			target.addPoint(this.origin, this.pointRadius, [100, 100, 255])
		}

		if (this.regular)
		{
			const halfLength = this.crosshairRadius * 0.6
			this.sides.forEach(side => {

				const startPoint = side.middle.add(side.tangent.scale(halfLength))
				const endPoint = side.middle.add(side.tangent.scale(-halfLength))

				target.addLine(startPoint, endPoint, this.lineThickness, [255, 255, 255])
			})

		}
	}

	extend(point)
	{
		let changed = false

		if (!this.points.empty)
		{
			if (!point.equals(this.points.last))
			{
				if (!this.closed)
				{
					const distance = (point.sub(this.origin)).size()

					if (distance <= this.pointRadius * 3)
					{
						this.closed = true
						this.points.add(this.origin.clone())
						this.onClose()
					}
					else
					{
						this.points.add(point)
					}
					changed = true
				}
			}
		}
		else
		{
			this.points.add(point)
		}

		if (changed)
		{
			this.onChange()
		}
	}

	onClose()
	{
		const sideCount = this.points.length - 1

		// Calculate centroid

		let centroid = new Vector2(0,0)

		this.points.forEachPair((start, end) => {
			centroid = centroid.add(start)
			this.sides.push(new PolygonSide(start, end))
		})

		this.centroid = centroid.scale(1/sideCount)

		// Calculate radius and offset angle

		const angleStep = 2 * Math.PI / sideCount

		let minOffsets = [null, null]
		let maxOffsets = [null, null]

		let offsetTotals = [0, 0]
	
		let radiusTotal = 0

		const TWO_PI = Math.PI*2

		this.points.forEachPair((start, end, index) => {

			const offsetVector = start.sub(this.centroid)
			const offsetDistance = offsetVector.size()

			radiusTotal += offsetDistance


			const stepAngle = angleStep * index

			// Clockwise / anticlockwise winding
			const offsetAngleA = (Math.atan2(offsetVector.y, offsetVector.x) + Math.PI - (TWO_PI - stepAngle)) % TWO_PI
			const offsetAngleB = (Math.atan2(offsetVector.y, offsetVector.x) + Math.PI - stepAngle) % TWO_PI
			
			const offsetAngles = [offsetAngleA, offsetAngleB]


			for (let i = 0; i < 2; i++)
			{

				offsetTotals[i] += offsetAngles[i]

				let angle = offsetAngles[i]
				if (angle < 0)
				{
					angle += TWO_PI
				}
	

				if (minOffsets[i] === null)
				{
					minOffsets[i] = angle
				}
				else if (angle < minOffsets[i])
				{
					minOffsets[i] = angle
				}
			
				if (maxOffsets[i] === null)
				{
					maxOffsets[i] = angle
				}
				else if (angle > maxOffsets[i])
				{
					maxOffsets[i] = angle
				}
			}

		})

		const radius = radiusTotal/sideCount

		let startAngle = offsetTotals[0]/sideCount + Math.PI

		const snappedStartAngle = Math.round(startAngle / ANGLE_SNAP_DIVISION) * ANGLE_SNAP_DIVISION

	
		if (Math.abs(snappedStartAngle - startAngle) <= ANGLE_SNAP_TOLERANCE)
		{
			startAngle = snappedStartAngle
		}


		const offsetDeviation = Math.min(maxOffsets[0] - minOffsets[0], maxOffsets[1] - minOffsets[1])

		if (offsetDeviation <= ANGLE_SNAP_TOLERANCE)
		{	
			this.regular = true

			// Get polygon points

			this.points.forEach((point, index) => {

				const offsetAngle = startAngle + angleStep * index

				point.x = this.centroid.x + radius * Math.cos(offsetAngle)
				point.y = this.centroid.y + radius * Math.sin(offsetAngle)

			})
		

			this.points.forEachPair((start, end, index) => {
				this.sides[index] = new PolygonSide(start, end)
			})
		}


		this.emit("close")

	}

	setPosition(position)
	{
		if (!this.closed)
		{
			return
		}

		const offset = position.sub(this.centroid).sub(this.offset)

		this.centroid.copy(this.centroid.add(offset))

		this.points.forEach(point => {

			point.copy(point.add(offset))

		})

		this.points.forEachPair((start, end, index) => {
			this.sides[index] = new PolygonSide(start, end)
		})

	}

}