import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
    public width: number
    public height: number
    public pixelRatio: number = 1

    constructor()
    {
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight

        // Resize event
        window.addEventListener('resize', () =>
        {
            this.width = window.innerWidth
            this.height = window.innerHeight

            this.trigger('size:resize')
        })
    }
}