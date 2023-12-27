import { Vector2 } from "../spacial/vector.js"

import Force from "./force.js"

export class RepulsiveSystem
{
	constructor(repulsiveForce, actionDistanceSq, dampingFactor, velocityToleranceSq)
	{
		this.repulsiveForce = repulsiveForce
		this.actionDistanceSq = actionDistanceSq
		this.dampingFactor = dampingFactor
		this.velocityToleranceSq = velocityToleranceSq
	}
}

 
export class RepulsiveUnit
{
	constructor(location, mass, radius, system)
	{

		this.location = location.clone()

		this.mass = mass
		this.radius = radius

		this.system = system

		this.velocity = new Vector2(0, 0)

		this.forces = []
	}

	applyForce(force)
	{
		this.forces.push(force)

		force.start()
	}

	reset()
	{
		this.forces = []
	}

	update(timeDelta)
	{
		let changed = false


		let resultant = new Vector2(0, 0)

		let forceIndex = 0
		while (forceIndex < this.forces.length)
		{

			const force = this.forces[forceIndex]
			force.update(timeDelta)

			if (force.resultant === null)
			{
				this.forces = this.forces.filter(other => force !== other)
			}
			else
			{
				resultant = resultant.add(force.resultant)
				forceIndex ++

			}

		}

		const acceleration = resultant.scale(1/this.mass)

		this.velocity = this.velocity.add(acceleration.scale(timeDelta))

		if (this.velocity.sizeSQ() < this.system.velocityToleranceSq)
		{
			this.velocity = new Vector2(0,0)
		}
		else
		{
			this.velocity = this.velocity.add(this.velocity.scale(-this.system.dampingFactor))


			const translation = this.velocity.scale(1/timeDelta)

			this.location = this.location.add(translation)
			changed = true

		}

		return changed

	}


	collide(other)
	{
		let colliding = false


		const distanceVector = other.location.sub(this.location)
		const distanceSQ = distanceVector.sizeSQ()

		if (distanceSQ < this.system.actionDistanceSq)
		{
			this.applyForce(new Force(distanceVector, -1/distanceSQ * this.system.repulsiveForce, 100))

			if (distanceSQ < Math.pow(this.radius + other.radius, 2))
			{
				colliding = true
			}
		}

		return colliding
	}
}