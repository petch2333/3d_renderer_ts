import { interpolate } from "./Utils";
import Color from "./Color"


export default class Vector3 {
    public x: number;
    public y: number;
    public z: number;
    public color: Color;

    constructor(x: number, y: number, z: number, color: Color = Color.red()) {
        this.x = x
        this.y = y
        this.z = z
        this.color = color
    }

    static new = function(x: number, y: number, z: number, color: Color = Color.red()) {
        return new this(x, y, z, color)
    }

    public length(): number {
        let x = this.x
        let y = this.y
        let z = this.z
        return Math.sqrt(x * x + y * y + z * z)
    }


    public normalize(): Vector3 {
        let x = this.x
        let y = this.y
        let z = this.z
        let len = this.length()
        return Vector3.new(x / len, y / len, z / len)
    }


    public dot(v: Vector3): number {
        let x = this.x * v.x
        let y = this.y * v.y
        let z = this.z * v.z
        return x + y + z
    }


    public add(v: Vector3): Vector3 {
        let x = this.x + v.x
        let y = this.y + v.y
        let z = this.z + v.z
        return Vector3.new(x, y, z)
    }


    public subtract(v: Vector3): Vector3 {
        let x = this.x - v.x
        let y = this.y - v.y
        let z = this.z - v.z
        return Vector3.new(x, y, z)
    }


    public multiply(num: number): Vector3 {
        let x = this.x * num
        let y = this.y * num
        let z = this.z * num
        return Vector3.new(x, y, z)
    }

    public equal(v: Vector3): boolean {
        return this.x == v.x && this.y == v.y && this.z == v.z
    }

    public cosΘ(v: Vector3) {
        let dot = this.dot(v)
        let mode = this.length() * v.length()
        return dot / mode
    }

    public cross = function(v2: Vector3): Vector3 {
        let x1 = this.x
        let y1 = this.y
        let z1 = this.z

        let x2 = v2.x
        let y2 = v2.y
        let z2 = v2.z
       
        var newX = y1*z2 - y2*z1
        var newY = z1*x2 - z2*x1
        var newZ = x1*y2 - x2*y1
        return Vector3.new(newX, newY, newZ)
    }


    static interpolate(p1: Vector3, p2: Vector3, factor: number) {
        let x = interpolate(p1.x, p2.x, factor)
        let y = interpolate(p1.y, p2.y, factor)
        let z = interpolate(p1.z, p2.z, factor)
        let color = Color.interpolate(p1.color, p2.color, factor)
        return Vector3.new(x, y, z, color)
    } 
}
