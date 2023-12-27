import EventEmitter from "../../api/event/event.js"

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const RESET_TIMEOUT = 100

class Stream
{
	constructor(items)
	{
		this.items = items
	}

	peek()
	{
		return this.items[0]
	}

	consume(count)
	{

		const consumed = this.items.slice(0, count)
		this.items = this.items.slice(count)

		return consumed

	}
}

export default class SpeechListener extends EventEmitter
{
	constructor()
	{
		super()

		this.running = false


		this.analyser = new SpeechRecognition()

		this.analyser.continuous = true
		this.analyser.lang = "en-UK"
		this.analyser.interimResults = false
		this.analyser.maxAlternatives = 1

		this.latestResults = null

		this.analyser.onresult = (event) => {

			this.latestResults = event.results
			
		}

		this.analyser.onspeechend = () => {
			//this.stop()
		}

		this.analyser.onnomatch = (event) => {
			
		}

		this.analyser.onerror = (event) => {

			if (event.error == "no-speech")
			{

			}
			else
			{
		  		console.log(`Error occurred in recognition: ${event.error}`)
			}
		}

		this.analyser.onend = (event) => {
			this.onResult()
		}
	}

	start() 
	{
		if (!this.running)
		{
			this.latestResults = null

			this.running = true
			this.analyser.start()

		}

	}

	stop()
	{

		if (this.running)
		{
			this.analyser.stop()

			setTimeout(() => {
				this.running = false
			}, RESET_TIMEOUT)

		}
	}

	onResult()
	{

		if (this.latestResults === null)
		{
			return
		}

		let text = ""
		for (let i = 0; i < this.latestResults.length; i++)
		{
			const result = this.latestResults[i]

			text += result[0].transcript.toLowerCase()
		}

		this.emit("line", text)

	}


}






