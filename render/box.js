import Mesh from "./mesh.js"


export default class Box extends Mesh
{
	constructor(dimensions, colour)
	{
		super()

		const dimensionVector = this.convertToScreenSpace(dimensions)

		this.width = dimensionVector.x
		this.depth = dimensionVector.y
		this.height = dimensionVector.z

		this.colour = colour

	}

	build()
	{
		this.material = new THREE.MeshLambertMaterial( { color: this.colour } )

		const geometry = new THREE.BoxGeometry(this.width, this.depth, -this.height)
		const box = new THREE.Mesh(geometry, this.material)

		this.geometries.push(geometry)
		this.object = box
	}
	
}
