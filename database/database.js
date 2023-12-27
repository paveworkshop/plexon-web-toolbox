const access = async function(endpoint, method, parameters)  {

	let contents = null

	const request = new Request(endpoint, {

		headers: {"Content-Type": "application/json", "Plex-Internal" : true},
		method,
		body: JSON.stringify(parameters)

	})

	const response = await fetch(request)

	let payload = {}
	try 
	{
		payload = await response.json()
	}
	catch (error)
	{

	}


	if (payload.error === "NOT_AUTHENTICATED") {

		window.location.replace("/login")

	}
	
	return [[200, 201].includes(response.status), payload]

}


export default class Database
{
	constructor(endpoint)
	{
		this.base = "http://localhost:4001/"
		this.endpoint = endpoint

		this.target = this.base + this.endpoint
	}

	async getItem(uid)
	{
		const [success, response] = await access(this.target+"/"+uid, "GET")

		const model = success ? response.model : null

		return model
	}

	async getItems()
	{
		const [success, response] = await access(this.target, "GET")

		const models = success ? response.models : null

		return models
	}

	async addItem(parameters)
	{
		const [success, response] = await access(this.target, "POST", parameters)
		
		const model = success ? response.model : null

		return model	
	}

	async updateItem(uid, parameters)
	{
		const [success, response] = await access(this.target+"/"+uid, "PATCH", parameters)
		
		return [success, response.model]
	}

	async removeItem(uid)
	{
		const [success, response] = await access(this.target+"/"+uid, "DELETE")

		return success
	}

}