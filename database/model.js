import EventEmitter from "../event/event.js"


export default class Model extends EventEmitter
{
	constructor(fields, data)
	{
		super()

		this.parameters = { "uid": null }
		this.puppets = []

		this.edited = false

		this.populate(data)

	}

	populate(data, notify)
	{
		this.import(data)

		if (notify)
		{
			Object.keys(this.parameters).forEach(parameter => {
				this.emit("update", parameter, this.parameters[parameter])
			})
		}
	}

	import(data)
	{

	}

	export()
	{
		return {}
	}

	save()
	{
		this.edited = false

		return this.export()
	}

	initialise(parameter, value)
	{
		this.parameters[parameter] = value	
	}

	set(parameter, value, silent)
	{
		this.initialise(parameter, value)

		this.emit("update", parameter, value)

		if (!silent)
		{
			this.edited = true
		}
	}

	bind(puppets)
	{
		this.puppets = puppets

		this.puppets.forEach(puppet => {

			puppet.host = this

			Object.keys(this.parameters).forEach(parameter => {
				puppet.set(parameter, this.parameters[parameter])
			})

		})

		this.on("update", (parameter, value) => {

			this.puppets.forEach(puppet => {

				puppet.set(parameter, value)

			})

		})

	}

	unbind()
	{
		this.puppets = []
	}

	update()
	{

	}

}
