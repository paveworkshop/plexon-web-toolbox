import EventEmitter from "../event/event.js"

const LETTER_REGEX = /^[a-z]$/i
const NUMBER_REGEX = /^[0-9]$/i
const SYMBOL_REGEX = /^[-/()]$/i

export default class Keyboard extends EventEmitter
{
	constructor(dom)
	{
		super()

		this.dom = dom

		this.bindDOMevents()


		this.text = ""
	}

	bindDOMevents()
	{
		this.dom.addEventListener("keydown", (event) => {

			const key = event.key

			if (key === "Backspace")
			{
				this.text = this.text.slice(0,-1)
				this.emit("text", this.text)
			}
			else if (key === "Enter")
			{

			}
			else if (key === " " || LETTER_REGEX.test(key) || NUMBER_REGEX.test(key) || SYMBOL_REGEX.test(key))
			{
				if (event.ctrlKey)
				{
					this.emit("command", key)
				}
				else
				{
					this.text += key

					this.emit("text", this.text)
				}
			}
				

		})
	}

	grab()
	{
		const text = this.text
		this.text = ""

		return text
	}
}