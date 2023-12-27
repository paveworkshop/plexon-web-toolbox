export default class EventEmitter
{

	constructor()
	{
		this.events = {}
	}

	on(event, callback)
	{
		if (!(event in this.events))
		{
			this.events[event] = []
		}

		this.events[event].push(callback)
	}

	emit(event, args)
	{
		if (event in this.events)
		{
			Object.values(this.events[event]).forEach(callback => {
				callback(...Array.from(arguments).slice(1))
			})
		}
	}

}
