import { HexColour } from "./colour.js"
import Mesh from "./mesh.js"

const RIBBON_WIDTH = 3
const RIBBON_LENGTH = 1000
const RIBBON_COUNT = 20

const GRID_Z_OFFSET = -RIBBON_LENGTH/2
const GRID_Y_OFFSET = 0
const GRID_COLOUR = [255, 255, 255]


export default class GridPlane extends Mesh
{
	constructor()
	{
		super()

		this.size = RIBBON_LENGTH
		this.divisions = RIBBON_COUNT

	}

	build()
	{
		const ribbonSpacing = this.size / this.divisions

		let depthRibbons = []
		let lengthRibbons = []

		const halfLength = this.size/2

		for (let i=0; (i < this.divisions+1); i++){

			const location = - this.size/2 + i * ribbonSpacing
		 
			const widthStart = location - RIBBON_WIDTH/2
			const widthEnd = location + RIBBON_WIDTH/2

			const depthRibbon = new THREE.Shape([
				new THREE.Vector2(widthStart, -halfLength),
				new THREE.Vector2(widthEnd, -halfLength),
				new THREE.Vector2(widthEnd, halfLength),
				new THREE.Vector2(widthStart, halfLength)])

			const lengthRibbon = new THREE.Shape([
				new THREE.Vector2(-halfLength, widthStart),
				new THREE.Vector2(-halfLength, widthEnd),
				new THREE.Vector2(halfLength, widthEnd),
				new THREE.Vector2(halfLength, widthStart)])

			depthRibbons.push(depthRibbon)
			lengthRibbons.push(lengthRibbon)

		}

		const ribbonGrid = new THREE.ShapeBufferGeometry([...depthRibbons, ...lengthRibbons])

		const gridXY = ribbonGrid
		const gridXZ = ribbonGrid.clone().rotateX(-0.5 * Math.PI)


		this.material = new THREE.MeshLambertMaterial({
			color: HexColour(GRID_COLOUR)})

		this.material.emissive = new THREE.Color(HexColour([255, 255, 255]))
		this.material.emissiveIntensity = 1

		const gridPlaneXY = new THREE.Mesh(gridXY, this.material)
		const gridPlaneXZ = new THREE.Mesh(gridXZ, this.material)

		this.geometries.push(gridXY)
		this.geometries.push(gridXZ)

		gridPlaneXZ.position.y = GRID_Y_OFFSET

		gridPlaneXY.position.y = this.size/2
		gridPlaneXY.position.z = GRID_Z_OFFSET

		const group = new THREE.Group()

		group.add( gridPlaneXY )
		group.add( gridPlaneXZ )

		this.object = group
	}
}


