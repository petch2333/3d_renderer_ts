import { interpolate } from "./Utils";

export default class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number, g: number, b: number, a: number = 255) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    static new = function(r: number, g: number, b: number, a: number = 255) {
        return new this(r, g, b, a)
    }

    static white = function() {
        return new this(255, 255, 255)
    }

    static black = function() {
        return new this(0, 0, 0)
    }

    static red = function() {
        return new this(255, 0, 0)
    }

    static green = function() {
        return new this(0, 255, 0)
    }

    static blue = function() {
        return new this(0, 0, 255)
    }


    static interpolate(c1: Color, c2: Color, factor: number) {
        let r = interpolate(c1.r, c2.r, factor)
        let g = interpolate(c1.g, c2.g, factor)
        let b = interpolate(c1.b, c2.b, factor)
        let a = interpolate(c1.a, c2.a, factor)
        return Color.new(r, g, b, a)
    }    
}
