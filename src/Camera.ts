
import Vector3 from "./Vector3"

export default class Camera  {
    public position: Vector3;
    public target: Vector3;
    public up: Vector3;
    private static i: Camera | null = null

    constructor() {
        this.position = Vector3.new(0, 0, -10)
        this.target = Vector3.new(0, 0, 0)
        this.up = Vector3.new(0, 1, 0)
    }

    
    static new = function() {
        return new this()
    }
}
