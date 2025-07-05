import { interpolate } from "./Utils"
import Vector3 from "./Vector3"


export default class Vertex {
    public position: Vector3    
    public normal: Vector3
    public u: number
    public v: number

    constructor(position: Vector3, normal: Vector3, u: number, v: number) {
        this.position = position
        this.normal = normal
        this.u = u
        this.v = v
    }

    static new = function(position: Vector3, normal: Vector3, u: number, v: number) {
        return new this(position, normal, u, v)
    }

    static interpolate(v1: Vertex, v2: Vertex, factor: number) {
       
        let position = Vector3.interpolate(v1.position, v2.position, factor)
        let normal = Vector3.interpolate(v1.normal, v2.normal, factor)

        let u = interpolate(v1.u, v2.u, factor)
        let v = interpolate(v1.v, v2.v, factor)
        return Vertex.new(position, normal, u, v)
    }
}
