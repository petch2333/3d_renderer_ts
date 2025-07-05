import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    private start: number
    private current: number
    public elapsed: number
    public delta: number
    public fps: number
    public context: CanvasRenderingContext2D

    constructor(context: CanvasRenderingContext2D)
    {
        super()
        this.context = context
        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.fps = Math.round(1000 / this.delta)

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        this.fps = Math.round(1000 / this.delta)

        this.trigger('time:tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    draw() {
        this.context.font = '30px Arial';      
        this.context.fillStyle = 'black';       
        this.context.textAlign = 'center';     
        this.context.textBaseline = 'middle';  
        this.context.fillText(`FPS: ${this.fps}`, 100, 40);
    }
}