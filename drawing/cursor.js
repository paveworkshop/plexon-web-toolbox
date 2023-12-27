import { Vector2 } from "../spacial/vector.js"
import EventEmitter from "../event/event.js"

export default class Cursor extends EventEmitter
{
	constructor(dom)
	{
		super()

		this.dom = dom

		this.bindDOMevents()

		this.offset = new Vector2(0, 0)

		this.lastPosition = null
		this.position = null
		
		this.pressed = false

		this.mouseDown = false
	}

	getEventPoint(event)
	{
		return new Vector2(event.clientX, event.clientY)
	}

	bindDOMevents()
	{

		this.dom.addEventListener("wheel", (event) => {
			event.preventDefault()

			const scrollDelta = event.deltaY
			const scrollCentre = this.getEventPoint(event)

			this.emit("scroll", scrollCentre, scrollDelta)

		}, {passive:false})

		this.dom.addEventListener("dblclick", (event) => {
			this.emit("double-tap", this.getEventPoint(event))
		})

		this.dom.addEventListener("mousedown", (event) => {
			this.mouseDown = true
			this.setPosition(this.getEventPoint(event))
		})

		this.dom.addEventListener("mouseup", (event) => {
			this.setPosition(null)
			this.mouseDown = false
		})

		this.dom.addEventListener("mousemove", (event) => {
			
			if (this.mouseDown)
			{
				this.setPosition(this.getEventPoint(event))
			}
		})

		this.dom.addEventListener("mouseleave", (event) => {
			this.setPressed(null)
		})
	}

	setPosition(position)
	{

		if (position !== null)
		{
			this.position = position.clone()
			if (this.lastPosition === null)
			{
				this.setPressed(true)
			}
		}
		else
		{
			this.position = null
			this.setPressed(false)
		}

		if (this.pressed)
		{
			if (this.lastPosition !== null)
			{

				this.emit("tap-frame", this.position, this.position.sub(this.lastPosition))
			}
		}

		this.lastPosition = this.position


	}

	setPressed(pressed)
	{
		if (!pressed && this.pressed)
		{
			this.pressed = false
			this.emit("tap-end", this.lastPosition.clone())

			this.lastPosition = null
			this.position = null
		}

		else if (pressed && !this.pressed)
		{
			this.pressed = true
			this.offset = this.position.clone()
			this.emit("tap-start", this.position)
		}
	}
}
