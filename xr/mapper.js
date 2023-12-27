import { Vector2 } from "../spacial/vector.js"

export default class Mapper
{


	constructor(config)
	{
		this.load(config)

		this.lookup = null
		this.cameraResolution = null
	}

	load(config)
	{
		console.log(config.lookup)
	}

	map(cameraPoint)
	{
		let mapped = null

		if (cameraPoint !== null && this.lookup !== null)
		{
			if ((0 <= cameraPoint.x < this.cameraResolution[0]) && (0 <= cameraPoint.y < this.cameraResolution[1]))
			{
				const mX, mY = this.lookup[Math.floor(cameraPoint.y, cameraPoint.x)]

				if (mX !== -1 && mY !== -1)
				{
					mapped = new Vector2(mX, mY)
				}
			}
		}

		return mapped
	}

}
