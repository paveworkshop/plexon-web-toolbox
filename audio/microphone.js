export default class Microphone
{

	constructor()
	{

		this.stream = null

		if (navigator.mediaDevices) {
			navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => 
			{
    			this.stream = stream

			}).catch((err) => {
				console.log("Microphone access failed.")
			})
		} 
		else {
			console.log("Microphone access not supported.")
		}
	}


}

