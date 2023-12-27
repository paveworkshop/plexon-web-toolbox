import Mesh from "./mesh.js"

const SEGMENTS_PER_MM = 0.5

export default class Cylinder extends Mesh
{
	constructor(diameter, height, colour)
	{
		super()

		this.radius = diameter / 2
		this.height = height

		this.colour = colour

	}

	build()
	{
		if (this.radius == 0)
		{
			return
		}
		
		this.material = new THREE.MeshBasicMaterial( { color: this.colour } )
		
		const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, Math.round(this.height * SEGMENTS_PER_MM))
		const cylinder = new THREE.Mesh(geometry, this.material)

		this.geometries.push(geometry)
		this.object = cylinder
	}
	
}
