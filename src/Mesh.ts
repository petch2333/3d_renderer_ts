import Texture from "./Texture"
import BaseDraw from "./BaseDraw"
import Matrix from "./Matrix"
import Model from "./Model"
import Vector3 from "./Vector3"
import Vertex  from "./Vertex"
import Renderer from "Renderer"

export default class Mesh extends BaseDraw  {
    public position: Vector3 = Vector3.new(0, 0, 0);
    public rotation: Vector3 = Vector3.new(Math.PI * 1.5, 0, 0);
    public scale: Vector3 = Vector3.new(10, 10, 10);
    public texture: Texture;
    public model: Model;
    private renderer: Renderer;
    
    constructor(model: Model, texture: Texture, renderer: Renderer) {
        super(renderer.context, renderer.sizes.pixelRatio)
        this.renderer = renderer
        this.texture = texture
        this.model = model
    }

    public update() {
        let delta = this.renderer.time.delta
        let speed = delta * 0.5
        this.rotation.y += speed
    }

    public draw() {

        let w = this.renderer.sizes.width
        let h = this.renderer.sizes.height
        let camera = this.renderer.camera
        let position = camera.position
        let target = camera.target
        let up = camera.up
        let view = Matrix.lookAtLH(position, target, up)
        let projection = Matrix.perspectiveFovLH(0.8, w / h, 0.2, 0.1)
        let rotation = Matrix.rotation(this.rotation)
        let translation = Matrix.translation(this.position)
        let scale = Matrix.scale(this.scale)
        let world = scale.multiply(rotation).multiply(translation)
        let transform = world.multiply(view).multiply(projection)

        // for(let face of this.model.faces) {
        for(let i = 0; i < this.model.faces.length; i++) {
        // for(let i = 0; i < 1; i++) {
            let face = this.model.faces[i]
            // console.log('face', face)
            let p0 = face[0]
            let p1 = face[1]
            let p2 = face[2]
            let v0 = Matrix.project(p0, transform, w, h)
            let v1 = Matrix.project(p1, transform, w, h)
            let v2 = Matrix.project(p2, transform, w, h)
            this.drawTriangle( v0, v1, v2)
        }

    }
     
    public drawPixel(vertex: Vertex) {
        let zbuffer = this.renderer.zbuffer
        vertex = zbuffer.getPixel(vertex)
        let image = this.texture
        let u = vertex.u
        let v = vertex.v
        u = Math.abs(u)
        v = Math.abs(v)

        let indexOfX = Math.round(u * image.width) 
        let indexOfY = Math.round(v * image.height)
        let c = image.positionPixel(indexOfX, indexOfY)
        let pixelSize = this.renderer.sizes.pixelRatio
        let x = Math.round(vertex.position.x * pixelSize)
        let y = Math.round(vertex.position.y * pixelSize)
        let w = pixelSize
        let h = pixelSize
        let light = this.renderer.light
        let lightV = light.subtract(vertex.position)
        let lightDiffuse = Math.abs(lightV.cosΘ(vertex.normal)) 
        let camera = this.renderer.camera
        let vec = light.subtract(vertex.position)
        let normal = vertex.normal
        let vertexReflection = refelect(vec, normal)

        var vertex光照向量 = vertex.position.subtract(camera.position)
        let lightReflection = Math.abs(vertexReflection.cosΘ(vertex光照向量))
        lightReflection = Math.pow(lightReflection, 2)
        let lightAmbient = 0.1
        let lightIntensity =  lightDiffuse + lightReflection + lightAmbient
        if (lightIntensity > 1) {
            lightIntensity = 1
        }
        let r = Math.round(c.r * lightIntensity) 
        let g = Math.round(c.g * lightIntensity) 
        let b = Math.round(c.b * lightIntensity) 
        let a = Math.round(c.a) 
        this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${255 / 255})`
        this.context.fillRect(x, y, w, h)
        this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
        this.context.fillRect(x, y, w, h,)
        this.context.restore()
        function refelect(vec: Vector3, normal: Vector3) {
            let n = normal.multiply(2).multiply(vec.dot(normal))
            return vec.subtract(n)
        }
    }
}