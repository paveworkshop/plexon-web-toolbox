const SAMPLE_DEPTH = 256
const SMOOTHING_CONSTANT = 0.6
const DIFFERENCE_THRESHOLD = 0.4

export default class Analyser
{

	constructor(input)
	{
		this.input = input

		this.context = new AudioContext()
		this.analyser = this.context.createAnalyser()

		this.sampleDepth = SAMPLE_DEPTH

		this.last = new Float32Array(this.sampleDepth)

		this.started = false

	}

	start()
	{
		if (this.started)
		{
			return
		}

		this.started = true

		const source = this.context.createMediaStreamSource(this.input.stream)
		source.connect(this.analyser)

		this.analyser.fftSize = this.sampleDepth * 4
		this.analyser.smoothingTimeConstant = SMOOTHING_CONSTANT


		this.context.resume()

	}

	update()
	{
		if (!this.analyser)
		{
			return
		}

		const bufferLength = this.analyser.frequencyBinCount

		const rawFreqData = new Uint8Array(bufferLength)

		this.analyser.getByteFrequencyData(rawFreqData)

		const combined = new Float32Array(this.sampleDepth)
		const diff = new Float32Array(this.sampleDepth)


		let maxIndices = []
		for (let i = 0; i < this.sampleDepth; i++)
		{
			const freqVal = rawFreqData[i] / 300

			combined[i] = freqVal
			diff[i] =  Math.abs(freqVal - this.last[i])

			this.last[i] = freqVal

		}

		return [ combined, diff ]
	}

}