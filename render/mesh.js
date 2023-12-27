export default class Mesh
{

	constructor()
	{
		this.scene = null
		
		this.geometries = []
		this.object = null
		this.material = null

		this.offset = new THREE.Vector3(0, 0, 0)
	}

	render(scene)
	{
		this.scene = scene

		this.build()


		if (this.object != null)
		{
			this.scene.add(this.object)
		}
		
	}


	build()
	{

	}

	destroy()
	{


		if (this.object != null)
		{
			this.scene.remove(this.object)
			this.object = null
		}
		if (this.material != null)
		{
			this.material.dispose()
			this.material = null
		}


		this.geometries.forEach(geometry => geometry.dispose())
		this.geometries = []
		
	}

	show()
	{
		if (this.object === null)
		{
			return
		}	
		this.object.visible=true
	}

	hide()
	{
		if (this.object === null)
		{
			return
		}	
		this.object.visible=false
		
	}

	convertToScreenSpace(vector)
	{
		return new THREE.Vector3(vector.x, vector.z, -vector.y)
	}

	setOffset(vector)
	{
		if (this.object === null)
		{
			return
		}	
		this.offset.copy(this.convertToScreenSpace(vector))
		this.setPosition(this.object.position)
	}

	setPosition(vector)
	{
		if (this.object === null)
		{
			return
		}	
		this.object.position.copy(this.convertToScreenSpace(vector).add(this.offset))
	}
}

