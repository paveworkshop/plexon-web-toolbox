import Mesh from "./mesh.js"


export default class Plane extends Mesh
{
	constructor(normal)
	{
		super()

		this.object = new THREE.Plane(this.convertToScreenSpace(normal), 1)

	}

	build()
	{

	}
	
}
