import { Bounds2 } from "../spacial/bounds.js"
import { Vector2 } from "../spacial/vector.js"

import EventEmitter from "../event/event.js"

export class WorldWindowMapping extends EventEmitter {

	constructor(worldBounds) {

		super()

		this.scaling = 1

		this.constant = 1

		this.worldBounds = worldBounds
		this.windowBounds = null

		this.worldRect = null

		this.userScale = 1

	}

	// Map a given point from world to pixel coordinates.
	getWorldToWindow(worldPoint) {

		const subbed = worldPoint.sub(this.worldRect.origin)
		subbed.x *= this.scaling
		subbed.y *= this.scaling

		return subbed

	}

	// Map a given point from pixel to world coodinates
	getWindowToWorld(windowPoint) {

		const scaled = windowPoint.scale(1/this.scaling)

		scaled.x += this.worldRect.origin.x
		scaled.y += this.worldRect.origin.y

		return scaled

	}

	setScalingConstant() {

		const dimensions = this.windowBounds.size.toArray()

		let limitIndex = 1
		if (dimensions[1] > dimensions[0]) {
			limitIndex = 0
		}

		this.constant = this.windowBounds.size.toArray()[limitIndex] / this.worldBounds.size.toArray()[limitIndex]

		this.updateScaling()
	}

	updateScaling()
	{
		this.scaling = this.constant * this.userScale
	}

	// Perform a zoom, maintaining the world position under the cursor
	setWindowScale(userScale, cursorPosition) {

		if (userScale != this.userScale) {

			const scalingCentre = this.getWindowToWorld(cursorPosition)

			const lastScale = this.userScale
			this.userScale = userScale

			const scaleDelta = lastScale/this.userScale

			// Find new visible area

			const size = this.worldRect.size.scale(scaleDelta)

			const originOffset = cursorPosition.divide(this.windowBounds.size).multiply(size)

			const newOrigin = scalingCentre.sub(originOffset)

			// Set new origin

			const origin = newOrigin.clone()

			// Set new scale
			this.worldRect = new Bounds2(origin.x, origin.y, size.x, size.y)

			this.updateScaling()

			this.broadcastUpdate()
		}


	}


	setWindowBounds(bounds) {

		this.windowBounds = bounds



		if (this.worldRect === null)
		{
			this.setScalingConstant()
		}



		const size = this.windowBounds.size.scale(1/this.scaling)
		const origin = this.worldBounds.origin.add(this.worldBounds.size.sub(size).scale(0.5))

		this.worldRect = new Bounds2(origin.x, origin.y, size.x, size.y)

		this.broadcastUpdate()

	}


	translateWorldRect(translation) {

		const newOrigin = this.worldRect.origin.add(translation)

		this.worldRect = new Bounds2(newOrigin.x, newOrigin.y, this.worldRect.size.x, this.worldRect.size.y)

		this.broadcastUpdate()

	}

	broadcastUpdate()
	{
		this.emit("change")
	}

}