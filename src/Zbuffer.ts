import Sizes from "./Sizes"
import Vertex  from "./Vertex"

export default class Zbuffer {
    private sizes: Sizes
    private pixels: Vertex[][] = []

    constructor(sizes: Sizes) {
        this.sizes = sizes
        this.init()
    }

    public init() {
        this.pixels = []
        for (let i = 0; i < this.sizes.width ; i += 1) {
            let line: Vertex[] = []
            for (let j = 0; j < this.sizes.height ; j += 1) {
                line.push(null)
            }
            this.pixels.push(line)
        }
    }


    getPixel(point: Vertex): Vertex {
        let x = point.position.x
        let y = point.position.y
        x = Math.round(x)
        y = Math.round(y)
        let current = this.pixels[x][y]
        if (current == null) {
            this.pixels[x][y] = point
        } else if (current.position.z > point.position.z) {
            this.pixels[x][y] = point
        } else {
            point = current
        }  
        return point
    }
}

