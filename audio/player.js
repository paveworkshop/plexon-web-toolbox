export default class Player {

    constructor(path) {

        this.path = path

        this.started = null

        this.audio = null

        this.load()

    }

    load() {

        this.audio = new Audio(this.path)
    }


    start() {

        if (this.started == null)
        {
            this.started = Date.now()

            this.audio.play()

        }

    }

    setVolume(volume)
    {
        this.audio.volume = volume
    }

    draw() {

        if (!this.frames)
        {
            return
        }

        const elapsed = Date.now() - this.started

    }

}