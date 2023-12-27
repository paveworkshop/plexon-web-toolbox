import Mesh from "./mesh.js"

export default class Polyline extends Mesh
{
	constructor(points)
	{
		super()

		this.colour = 0xffff00

		this.points = []

		points.forEach(point => {
			this.points.push(this.convertToScreenSpace(point))
		})

		this.valid = this.points.length > 2
	}

	build()
	{
		if (!this.valid)
		{
			return
		}

		this.material = new THREE.LineBasicMaterial( { color: this.colour } )
		
		const geometry = new THREE.BufferGeometry().setFromPoints(this.points)
		const line = new THREE.Line(geometry, this.material)

		this.geometries.push(geometry)
		this.object = line
	}
	
}
