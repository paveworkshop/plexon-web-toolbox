export default class Video
{

	constructor(parent, filePath, playOnLoad=false, loop=false)
	{
		this.filePath = filePath
		this.parent = parent

		this.playOnLoad = playOnLoad
		this.playing = false
		this.ready = false

		this.dom = document.createElement("video")
		this.dom.loop = loop

		this.build()
	}

	build()
	{
		this.dom.addEventListener("canplaythrough", () => {
			this.ready = true

			if (this.playOnLoad)
			{
				this.play()
			}
		})

		this.dom.src = this.filePath
		this.parent.appendChild(this.dom)

	}

	isPlaying()
	{
		return (this.dom.currentTime > 0 && !this.dom.paused && !this.dom.ended && this.dom.readyState > 2)
	}

	play()
	{
	
		if (this.ready)
		{
			this.dom.play()
		}

	}

	pause()
	{
		if (this.ready)
		{
			this.dom.pause()
		}
	}

	reset()
	{
		this.pause()
		this.dom.currentTime = 0
	}

	mute()
	{
		this.dom.muted = true
	}

	unmute()
	{
		this.dom.muted = false
	}

	setOpacity(opacity)
	{
		this.dom.style.opacity = opacity
	}

	setResolution(width, height)
	{
		this.dom.width = width
		this.dom.height = height
	}
}