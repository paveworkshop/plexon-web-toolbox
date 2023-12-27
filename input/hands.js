import {
	HandLandmarker,
	FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"


import { Vector2 } from "../../../../api/spacial/vector.js"

const createHandLandmarker = async () => {

	const vision = await FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
	)

	const landmarker = await HandLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
			delegate: "GPU"
		},
		runningMode: "VIDEO",
		numHands: 2
	})

	return landmarker

}


const createFeed = () => {

	const video = document.createElement("video")

	video.id = "feed"
	video.style.position = "absolute"
	video.autoplay = true

	document.body.appendChild(video)

	navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
		video.srcObject = stream
	})

	return video

}





const PINCH_THRESHOLD = 0.04
const GRAB_THRESHOLD = 0.5

const ACTIVE_THRESHOLD = 3

class Hand
{

	constructor(target)
	{
		this.points = null

		this.centre = null

		this.active = false
		this.pinching = false
		this.grabbing = false

		this.activeCount = 0
	}

	update(points)
	{

		this.centre = null
		this.pinching = false
		this.grabbing = false

		if (points === null)
		{
			this.activeCount -= 1
			this.active = this.activeCount > 0

			this.points = null
			return
		}

		this.points = points.map(point => new Vector2(point.x, point.y))

		this.activeCount = ACTIVE_THRESHOLD
		this.active = this.activeCount > 0

		const baseline = this.points[0].sub(this.points[5]).sizeSQ()


		if (this.points[4] !== null && this.points[8] !== null)
		{
			const pinchParam = this.points[8].sub(this.points[4]).sizeSQ()/baseline
			
			this.pinching = pinchParam < PINCH_THRESHOLD
		}

		if (this.points[2] !== null && this.points[12] !== null && this.points[16] !== null)
		{
			const grabParam = this.points[12].add(this.points[16]).scale(0.5).sub(this.points[2]).sizeSQ()/baseline

			this.grabbing = grabParam < GRAB_THRESHOLD

		}

		if (this.points[0] !== null && this.points[5] !== null)
		{
			this.centre = this.points[0].add(this.points[5]).scale(0.5)
		}

	}

	draw(target, remap, lineThickness=4)
	{
		if (this.points === null)
		{
			return
		}

		const mapped = remap(this.points)

		const lineColour = this.grabbing ? [255, 50, 20] : this.pinching ?  [100, 255, 120] : [255, 255, 255]

		this.drawChain(target, mapped, [0, 1, 2, 3, 4], lineColour, lineThickness)
		this.drawChain(target, mapped, [5, 6, 7, 8], lineColour, lineThickness)
		this.drawChain(target, mapped, [5, 9, 10, 11, 12], lineColour, lineThickness)
		this.drawChain(target, mapped, [9, 13, 14, 15, 16], lineColour, lineThickness)
		this.drawChain(target, mapped, [13, 17, 18, 19, 20], lineColour, lineThickness)

		/**
		const tips = [this.points[4], this.points[8]]

		const cursorSize = 22
		const cursorThickness = 3

		const cursorColour = [255, 255, 255]

		tips.forEach(point => {
			if (point !== null)
			{
				if (!this.pinching && !this.grabbing)
				{
					
					this.target.addPoint(point, cursorSize, cursorColour)
					this.target.addPoint(point, cursorSize - cursorThickness, null)
				
				}
			}							
		})
		**/

	}

	drawChain(target, points, indices, colour, thickness) {
		
		const path = []

		for (let i = 0; i < indices.length; i++)
		{
			if (points[indices[i]] === null)
			{
				return
			}
			path.push(points[indices[i]])
			
		}

		target.addPath(path, thickness, colour)

	}
}

class HandManager
{
	constructor()
	{
		this.tracker = null
		this.feed = null

		this.ready = false

		this.lastCaptured = -1

		this.hands = [new Hand(), new Hand()]
	}

	async build()
	{
		this.tracker = await createHandLandmarker()

		this.feed = null
		if (!!navigator.mediaDevices?.getUserMedia) {
			this.feed = createFeed()
		} else {
			console.warn("getUserMedia() is not supported by your browser");
		}

		if (this.feed)
		{
			this.feed.addEventListener("loadeddata", () => {
				this.ready = true
			})			
		}



	}

	async update()
	{

		if (this.ready)
		{

			let startTime = performance.now()
			if (this.lastCaptured !== this.feed.currentTime) {
				this.lastCaptured = this.feed.currentTime

				const results = this.tracker.detectForVideo(this.feed, startTime)

				if (results.landmarks)
				{
					const landmarks = results.landmarks
					this.hands.forEach((hand, index) => hand.update(landmarks[index] ? landmarks[index] : null))
				}
				else
				{
					this.hands.forEach(hand => hand.update(null))
				}
			}
			

		}




	}
}



const instance = new HandManager()
export default instance