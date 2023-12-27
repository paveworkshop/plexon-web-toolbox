import EventEmitter from "../event/event.js"

const getServerAddress = () => {
	return document.URL.split("/"[2])
}

const DELAY=100
const SOCKET_PORT=4001

class ModelManager extends EventEmitter {

	constructor()
	{

		super()

		this.clientInfo = { id: `${Date.now()}-${Math.round(Math.random()*100)}` }

		this.readTargets = []
		this.writeTargets = []

		this.socket = io(getServerAddress())

		this.socket.on("connect", () => {
			console.log("Client connected.")

			this.send("client-info", this.clientInfo)

			this.send("subscribe-read", { targets: this.readTargets })
			this.send("subscribe-write", { targets: this.writeTargets })

		})

		this.socket.on("/io/message", (message) => {

			if (message.label === "frame")
			{
				const frame = message.payload

				Object.keys(frame).forEach(index => {

					const target = this.readTargets[index]
					const state = frame[index]

					this.emit("frame", { target, state })

				})

			}
			else if (message.label === "pulse")
			{
				const pulse = message.payload

				this.emit("pulse", pulse)

			}

			
		})

		this.socket.emit("/io/join")
	}

	setId(id)
	{
		this.clientInfo.id = id
		this.send("client-info", this.clientInfo)
	}


	send(label, payload)
	{
		this.socket.emit("message", { label, payload })
	}

	write(target, payload)
	{
		const index = this.writeTargets.indexOf(target)

		if (index == -1)
		{
			return
		}

		this.sendFrame(index, payload)
	}

	sendFrame(index, payload)
	{
		const frame = {}
		frame[index] = payload

		this.send("frame", frame)
	}

	sendPulse(target, data)
	{
		this.send("pulse", { target, data })
	}

	subscribeRead(target)
	{
		this.readTargets.push(target)
		this.send("subscribe-read", { targets: this.readTargets })
	}

	subscribeWrite(target)
	{
		this.writeTargets.push(target)
		this.send("subscribe-write", { targets: this.writeTargets })
	}

	unsubscribeRead(target)
	{
		if (this.readTargets.includes(target))
		{
			this.readTargets = this.readTargets.filter(other => other !== target)
			this.send("unsubscribe-read", { targets: [target] })
		}
	}


}



const instance = new ModelManager()
export default instance