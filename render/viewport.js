import { Vector3 } from "../../../api/spacial/vector.js"
import { Bounds2 } from "../../../api/spacial/bounds.js"

import { HexColour } from "../../api/render/colour.js"

import { OrbitControls } from "../../lib/three/OrbitControls.js"

const CAMERA_SOURCE_POINT = [0, 200, 1000]

const CLIPPING_NEAR = 1
const CLIPPING_FAR = 10000

const AMBIENT_LIGHT_INTENSITY = 0.4
const AMBIENT_LIGHT_COLOUR = [255, 255, 255]

const POINT_LIGHT_POSITION = new THREE.Vector3(500, 400, -500)
const POINT_LIGHT_COLOUR = [255, 255, 255]
const POINT_LIGHT_INTENSITY = 0.8

const LOCAL_CLIPPING_ENABLED = true
const USE_CONTROLS = false

export default class Viewport
{

	constructor(parent, bounds=null)
	{
		this.parent = parent

		this.bounds = new Bounds2(0, 0, 1, 1)
		if (bounds !== null)
		{
			this.bounds = bounds
		}

		this.scene = null
		this.camera = null
		this.renderer = null
		this.dom = null

		this.grid = null

		this.controls = null

		this.objects = []
		
	}

	build()
	{

		this.scene = new THREE.Scene()

		const width = Math.round(window.innerWidth * this.bounds.w)
		const height = Math.round(window.innerHeight * this.bounds.h)

		this.camera = new THREE.PerspectiveCamera( 45, width/height, CLIPPING_NEAR, CLIPPING_FAR)

		this.renderer = new THREE.WebGLRenderer({antialias: true})

		this.renderer.localClippingEnabled = LOCAL_CLIPPING_ENABLED

		this.dom = this.renderer.domElement
		this.dom.id = "viewport-canvas"
		
		this.parent.appendChild( this.dom )


		if (USE_CONTROLS)
		{
			this.controls = new OrbitControls(this.camera, this.dom)
			this.controls.enableDamping=true	

			this.controls.update()

		}

		this.camera.position.set(...CAMERA_SOURCE_POINT)


		const ambientLight = new THREE.AmbientLight(HexColour(AMBIENT_LIGHT_COLOUR), AMBIENT_LIGHT_INTENSITY);
		this.scene.add(ambientLight)

		const pointLight = new THREE.PointLight(HexColour(POINT_LIGHT_COLOUR), POINT_LIGHT_INTENSITY, 0, 2)
		pointLight.position.copy(POINT_LIGHT_POSITION)
		this.scene.add(pointLight)

		window.addEventListener("resize", this.resize.bind(this))
		this.resize()

	}

	resize()
	{

		const width = Math.round(window.innerWidth * this.bounds.w)
		const height = Math.round(window.innerHeight * this.bounds.h)

		this.renderer.setSize(width, height)

		this.dom.style.left = Math.round(window.innerWidth*this.bounds.x) + "px"
		this.dom.style.top = Math.round(window.innerHeight*this.bounds.y) + "px"

		this.camera.aspect = width/height
		this.camera.updateProjectionMatrix()

	}

	update()
	{

		if (USE_CONTROLS)
		{
			this.controls.update()
		}

		this.renderer.render( this.scene, this.camera )

	}

	addObject(object)
	{
		this.objects.push(object)
		object.render(this.scene)
	}

}
