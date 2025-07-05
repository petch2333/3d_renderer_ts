import Sizes from './Sizes'
import Time from './Time'
import Zbuffer from './Zbuffer'
import Texture from './Texture'
import Model from './Model'
import Mesh from './Mesh'
import Vector3 from './Vector3'
import Camera from './Camera'
import GUI from './GUI'

export default class Renderer {
    public sizes: Sizes
    public time: Time
    public canvas: HTMLCanvasElement
    public context: CanvasRenderingContext2D
    public zbuffer: Zbuffer
    public light: Vector3
    public mesh: Mesh
    public camera: Camera
    public gui: GUI

    constructor() {
        this.sizes = new Sizes()
        this.initCanvas()
        this.time = new Time(this.context)
        this.camera = new Camera()
        this.zbuffer = new Zbuffer(this.sizes)
        this.light = new Vector3(0, 0, 0)
        this.gui = new GUI(document.querySelector('.gui'), this)

        this.initMesh()
        this.initGui()
    }
    
    public run() {
        this.sizes.on('size:resize', () =>
        {
            this.resize()
        })

        this.time.on('time:tick', () =>
        {
            this.update()
        })
    }

    private initCanvas() {
        let canvas = document.querySelector('#id-canvas') as HTMLCanvasElement;
        canvas.width = this.sizes.width * this.sizes.pixelRatio
        canvas.height = this.sizes.height * this.sizes.pixelRatio
        let context = canvas.getContext('2d');
        this.canvas = canvas
        this.context = context
    }

    private initGui() {
        this.gui.addNumber({
            init: 0,
            max: 100,
            min: -100,
            title: 'camera.x',
            name: 'camera.position.x'
        })
        this.gui.addNumber({
            init: 0,
            max: 100,
            min: -100,
            title: 'camera.y',
            name: 'camera.position.y'
        })
        this.gui.addNumber({
            init: 0,
            max: 100,
            min: -100,
            title: 'camera.z',
            name: 'camera.position.z'
        })
    }

    private async initMesh() {
        let texture = await Texture.parseWithImage('/apple.png')
        let model = await Model.parseWithObj('/apple.obj')
        this.mesh = new Mesh(model, texture as Texture, this) 
    }

    private update() {
        this.zbuffer.init()
        this.clear()
        if (this.mesh) {
            this.mesh.draw()
            this.mesh.update()
        }
    }


    private clear() {
        this.context.clearRect(0, 0,  this.canvas.width,  this.canvas.height)
    }

    private resize() {
        this.canvas.width = this.sizes.width 
        this.canvas.height = this.sizes.height 
    }
}