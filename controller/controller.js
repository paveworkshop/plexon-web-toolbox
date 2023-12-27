import ModelManager from "../../../api/database/model-manager.js"

export default class Controller
{
	constructor(viewManager)
	{
		this.modelManagers = {}
		this.viewManager = viewManager

	}

	async build()
	{
		const managers = Object.values(this.modelManagers)
		for (let i = 0; i < managers.length; i++)
		{
			await managers[i].manager.populate()
		}
	}

	createEntity(model, puppets)
	{
		model.bind(puppets)

		model.puppets.forEach(puppet => {
			this.viewManager.addPuppet(puppet)
		})

	}

	destroyEntity(model)
	{
		model.puppets.forEach(puppet => {
			this.viewManager.removePuppet(puppet)
		})

		model.unbind()
	}

	addModelManager(endpoint, modelSchema, puppetSchemas)
	{
		const manager = new ModelManager(endpoint, modelSchema)

		manager.on("create", (model) => {

			const puppets = puppetSchemas.map(schema => new schema())

			this.createEntity(model, puppets)
		})

		manager.on("destroy", (model) => {

			this.destroyEntity(model)

		})

		this.modelManagers[endpoint] = { manager, modelSchema, puppetSchemas }
	}

	getModelManager(endpoint)
	{
		return this.modelManagers[endpoint].manager
	}

	update()
	{
		const managers = Object.values(this.modelManagers)
		for (let i = 0; i < managers.length; i++)
		{
			managers[i].manager.poll()
		}

		this.viewManager.update()

	}

	async save()
	{
		const managers = Object.values(this.modelManagers)
		for (let i = 0; i < managers.length; i++)
		{
			managers[i].manager.save()
		}
	}
}