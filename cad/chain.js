export default class Chain
{
	constructor(items)
	{
		this.items = []
		this.empty = true
		this.last = null
		this.length = 0

		items.forEach(item => {
			this.add(item)
		})
	}

	add(item)
	{
		this.items.push(item)
		this.last = item
		this.empty = false
		this.length++
	}

	remove(item)
	{
		this.items = this.items.filter(remainingItem => remainingItem !== item)
		this.length--

		if (this.items.length === 0)
		{
			this.empty = true
			this.last = null
		}
		else
		{
			this.last = this.items[this.items.length - 1]
		}
	}

	forEach(lambda)
	{
		this.items.forEach((item, index) => lambda(item, index))
	}

	forEachPair(pairLambda)
	{

		this.items.forEach((item, index) => {

			if (index > (this.items.length - 2))
			{
				return
			}

			//const nextIndex = index < (this.items.length - 1) ? index + 1 : 0
			const nextIndex = index + 1

			const last = item
			const next = this.items[nextIndex]

			pairLambda(last, next, index)

		})
	}
}

