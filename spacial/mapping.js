import {Vector2} from "../spacial/vector.js"
import {Bounds2} from "../spacial/bounds.js"


// Maps a screen quad (top-left origin) to an arbitrary quad (bottom-left origin)

export class Quad 
{
	constructor(corners)
	{
		this.corners = corners
		this.domain = new Bounds2(0, 0, 1, 1)
	}

	getCoordinate(parameter)
	{

		let mapped = null;

		const A = this.corners[3]
		const B = this.corners[2]
		const C = this.corners[0]
		const D = this.corners[1]

		const inverted = (new Vector2(1, 1)).sub(parameter)
		mapped = A.scale(inverted.y).add(C.scale(parameter.y)).scale(inverted.x).add(B.scale(inverted.y).add(D.scale(parameter.y)).scale(parameter.x))

		return mapped

	}

	getParameter(coordinate)
	{

		let mapped = null

		const A = this.corners[3]
		const B = this.corners[2]
		const C = this.corners[0]
		const D = this.corners[1]

		// Calculate coefficients
		const cofA = A.sub(coordinate).cross(A.sub(C))
		const cofB = (A.sub(coordinate).cross(B.sub(D)) + B.sub(coordinate).cross(A.sub(C))) / 2
		const cofC = B.sub(coordinate).cross(B.sub(D))

		const cofD = cofA-cofB
		const cofE = Math.pow((Math.pow(cofB, 2) - cofA*cofC), 0.5)
		const cofF = cofA - 2*cofB + cofC

		let s = null
		let t = null

		if (Math.abs(cofF) > 0.00001)
		{

			const s1 = (cofD + cofE) / cofF
			const s2 = (cofD - cofE) / cofF

			if (s1 >= 0 && s1 <= 1)
			{
				s = s1
			}
			else if (s2 >= 0 && s2 <= 1)
			{
				s = s2
			}

		}
		else
		{
			s = cofA / (cofA-cofC)

			const topPoint = C.add(D.sub(C).scale(s))
			const botPoint = A.add(B.sub(A).scale(s))

			t = 1-coordinate.sub(topPoint).scale(1/topPoint.sub(botPoint).size()).y

		}


		if (s != null && t == null)
		{

			t = A.sub(coordinate).scale(1-s).add(B.sub(coordinate).scale(s)).divide(A.sub(C).scale(1-s).add(B.sub(D).scale(s))).x

		}

		// Allow parameters slightly below or above the mapping bounds, accuracy beyond this is very limited.
		if (s !== null && t !== null && t >= -1 && t <= 2)
		{
			mapped = new Vector2(s, t)
		}	


		return mapped

	}

}


