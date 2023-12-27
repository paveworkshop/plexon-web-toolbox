import Database from "./database.js"
import EventEmitter from "../event/event.js"

const MIN_SAVE_INTERVAL = 2000

export default class ModelManager extends EventEmitter
{

	constructor(endpoint, schema)
	{
		super()

		this.endpoint = endpoint
		
		this.database = new Database(this.endpoint)
		this.schema = schema
		this.models = {}

		this.lastPolled = Date.now()
		this.lastSaved = Date.now()
	}

	async populate()
	{

		const results = await this.database.getItems()

		if (results === null)
		{
			return
		}

		results.forEach(result => {

			const model = new this.schema(result)
			
			this.addModel(model)
			
		})

	}

	async createModel(parameters)
	{

		const result = await this.database.addItem(parameters)

		if (result !== null)
		{
			this.addModel(new this.schema(result))
		}
		else
		{
			console.log("create waypoint error")
		}

	}

	async updateModel(model)
	{

		const saved = model.save()
		const [success, result] = await this.database.updateItem(model.parameters.uid, saved)

		if (result !== null)
		{

			model.populate(result, !success)

		}
		else
		{
			console.log("update waypoint error")
		}

	}

	async destroyModel(model)
	{

		const success = await this.database.removeItem(model.parameters.uid)

		if (success)
		{
			this.removeModel(model)
		}
		else
		{
			console.log("destroy waypoint error")
		}


	}

	addModel(model)
	{

		this.models[model.parameters.uid] = model

		this.emit("create", model)

	}

	removeModel(model)
	{
		delete this.models[model.parameters.uid]

		this.emit("destroy", model)
	}

	poll()
	{

		const now = Date.now()
		const delta = now - this.lastPolled

		this.lastPolled = now
		
		const models = Object.values(this.models)
		models.forEach(model => {

			model.update(delta, models, this.models)

		})

		this.save()
	}

	save()
	{
		if (Date.now() - this.lastSaved < MIN_SAVE_INTERVAL)
		{
			return
		}

		let saved = false

		Object.values(this.models).forEach(model => {

			if (model.edited)
			{
				this.updateModel(model)
				saved = true
			}
		})

		if (saved)
		{

			this.lastSaved = Date.now()		
			console.log("Saving... "+this.lastSaved)
		}


	}
}

/**

export default class Model {

	constructor() {

		this.waypoints = []
		this.pathways = []

	}

	async populate() {

		const waypoints = await access("/waypoint", "GET")

		if (waypoints !== null) {

			this.waypoints = waypoints

		}

		const pathways = await access("/pathway", "GET")

		if (pathways !== null) {

			this.pathways = pathways

		}

	}

	// Waypoint actions

	async createWaypoint(puppet) {

		const waypoint = await access("/waypoint", "POST", puppet.toJSON())

		puppet.populate(waypoint)

	}

	async updateWaypoint(puppet, parameters) {	

		let rollback = false

		const response = await access("/waypoint/" + puppet.uid, "PATCH", parameters)

		const waypoint = response.waypoint

		if (response.error) {

			console.log(response.error, response.waypoint)
			rollback = true

		}

		return {waypoint, rollback}


	}

	async deleteWaypoint(puppet) {

		if (puppet.uid !== null) {

			const response = await access("/waypoint/" + puppet.uid, "DELETE")

			if (response.status === "SUCCESS") {

				this.pathways = this.pathways.filter(pathway => {

					const match = (puppet.uid === pathway.start || puppet.uid === pathway.end)

					if (match) {

						pathway.puppet.destroy()

					}

					return !match

				})

				this.waypoints = this.waypoints.filter(waypoint => waypoint._id !== puppet.uid)
				puppet.destroy()

			}

		}
		else {

			puppet.destroy()

		}

	}

	// Pathway actions

	async createPathway(puppet) {

		const response = await access("/pathway", "POST", puppet.toJSON())

		if (response.status === "SUCCESS") {

			response.pathway.puppet = puppet
			this.pathways.push(response.pathway)

			puppet.populate(response.pathway)

		}
		else {

			puppet.destroy()

		}
		

	}


	async updatePathway(puppet) {


	}

	async deletePathway(puppet) {

		if (puppet.uid !== null) {

			const response = await access("/pathway/" + puppet.uid, "DELETE")

			if (response.status === "SUCCESS") {

				this.pathways = this.pathways.filter(pathway => pathway._id !== puppet.uid)
				puppet.destroy()

			}

		}
		else {

			puppet.destroy()

		}


	}

	retrievePathwayPuppets(pathway) {

		const start = this.waypoints.find(waypoint => waypoint._id === pathway.start).puppet
		const end = this.waypoints.find(waypoint => waypoint._id === pathway.end).puppet

		return [start, end]

	}

}
**/