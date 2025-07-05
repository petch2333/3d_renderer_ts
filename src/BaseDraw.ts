import Color from "./Color"
import Vertex  from "./Vertex"
import Vector3 from "./Vector3"


export default class BaseDraw {
    public context: CanvasRenderingContext2D;
    public pixelRatio: number;

    constructor(context: CanvasRenderingContext2D, pixelRatio: number) {
        this.context = context
        this.pixelRatio = pixelRatio
    }

    public pixelColor( p: Vector3) {
        let pixelSize = this.pixelRatio
        let x = p.x * pixelSize
        let y = p.y * pixelSize
        let w = pixelSize
        let h = pixelSize
     
        let imageData = this.context.getImageData(x, y, w, h)
    
        let pixel = imageData.data
        let pixelNum = w * h
        let r = 0
        let g = 0
        let b = 0
        let a = 0
        for (let i = 0; i < pixelNum; i += 1) {
            r += pixel[i * 4 + 0]
            g += pixel[i * 4 + 1]
            b += pixel[i * 4 + 2]
            a += pixel[i * 4 + 3]
        }
    
        if (r == 0 && g == 0 && b == 0 && a == 0) {
            return Color.white()
        }
        return Color.new(r / pixelNum, g / pixelNum, b / pixelNum, a / pixelNum)
    }


    public drawPixel( vertex: Vertex) {
        let c = vertex.position.color
        let pixelSize = this.pixelRatio
        let x = Math.round(vertex.position.x * pixelSize)
        let y = Math.round(vertex.position.y * pixelSize)
        let w = pixelSize
        let h = pixelSize
        let r = Math.round(c.r)
        let g = Math.round(c.g)
        let b = Math.round(c.b)
        let a = Math.round(c.a)
        this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${255 / 255})`
        this.context.fillRect(x, y, w, h)
        this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
        this.context.fillRect(x, y, w, h,)
        this.context.restore()
    }


    public drawRect( begin: Vertex, width: number, height: number) {
        let c = begin.position.color
        let pixelSize = this.pixelRatio
        let x = Math.round(begin.position.x * pixelSize)
        let y = Math.round(begin.position.y * pixelSize)
        let w = pixelSize
        let h = pixelSize
        let r = Math.round(c.r)
        let g = Math.round(c.g)
        let b = Math.round(c.b)
        let a = Math.round(c.a)
        this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${255 / 255})`
        this.context.fillRect(x, y, w, h)
        this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
        this.context.fillRect(x, y, w, h,)
        this.context.restore()
    }


    public drawPixelFxaa(p: Vector3) {
        let center = this.pixelColor( p) 
        let leftTop = this.pixelColor( Vector3.new(p.x - 1, p.y - 1, p.z)) 
        let rightTop =  this.pixelColor( Vector3.new(p.x + 1, p.y - 1, p.z))
        let leftBottom = this.pixelColor( Vector3.new(p.x - 1, p.y + 1, p.z))
        let rightBottom =  this.pixelColor( Vector3.new(p.x + 1, p.y + 1, p.z))
        let r = (leftTop.r + rightTop.r + leftBottom.r + rightBottom.r + center.r) / 5
        let g = (leftTop.g + rightTop.g + leftBottom.g + rightBottom.g + center.g) / 5
        let b = (leftTop.b + rightTop.b + leftBottom.b + rightBottom.b + center.b) / 5
        let a = (leftTop.a + rightTop.a + leftBottom.a + rightBottom.a + center.a) / 5
        let pixelSize = this.pixelRatio
        let x = p.x * pixelSize
        let y = p.y * pixelSize
        let w = pixelSize
        let h = pixelSize
        this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${255 / 255})`
        this.context.fillRect(x, y, w, h,)
        this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
        this.context.fillRect(x, y, w, h)
        this.context.restore()
    } 


    public drawLine( p1: Vertex, p2: Vertex)  {
        const drawLineWithX = ( p1: Vertex, p2: Vertex) => {
            let x1 = p1.position.x
            let x2 = p2.position.x
            let absX = Math.abs(x1 - x2)
    
    
            if (x1 < x2) {
                for(let x = x1; x < x2; x += 1) {
                    let factor = (x - x1) / absX
                    let p = Vertex.interpolate(p1, p2, factor)
                    this.drawPixel( p)          
                }
            } else {
                for(let x = x2; x < x1; x += 1) {
                    let factor = (x - x2) / absX
                    let p = Vertex.interpolate(p2, p1, factor)
                    this.drawPixel( p)
                }
            }
        }
    
    
        const drawLineWithY = ( p1: Vertex, p2: Vertex) => {
            let y1 = p1.position.y
            let y2 = p2.position.y
            let absY = Math.abs(y1 - y2)
            
            if (y1 < y2) {
                for(let y = y1; y < y2; y += 1) {
                    let factor = (y - y1) / absY
                    let p = Vertex.interpolate(p1, p2, factor)
                    this.drawPixel( p)
                }
            } else {
                for(let y = y2; y < y1; y += 1) {
                    let factor = (y - y2) / absY
                    let p = Vertex.interpolate(p2, p1, factor)
                    this.drawPixel( p)
                }
            }
        }

        let x1 = p1.position.x
        let x2 = p2.position.x
        // 因为是横线，所以 y 是不会变的
        let y1 = p1.position.y
        let y2 = p2.position.y
    
        let absX = Math.abs(x1 - x2)
        let absY = Math.abs(y1 - y2)
        if (absX >= absY) {
            drawLineWithX( p1, p2)
        } else {
            drawLineWithY( p1, p2)
        }

    }

    public drawTriangle( v1: Vertex, v2: Vertex, v3: Vertex) {
        const drawFlatTriangle = ( top: Vertex, bottom1: Vertex, bottom2: Vertex) => {
            const drawBottom = ( t: Vertex, b1: Vertex, b2: Vertex) => {
                let absY = Math.abs(t.position.y - b1.position.y)
                for(let y = b1.position.y; y < t.position.y; y += 1) {
                    let factor = 1 - (y - b1.position.y) / absY
                    let p1 = Vertex.interpolate(t, b1, factor)
                    let p2 = Vertex.interpolate(t, b2, factor)
                    this.drawLine( p1, p2)
                }
            }
        
    
            const drawTop = ( t: Vertex, b1: Vertex, b2: Vertex) => {
                let absY = Math.abs(t.position.y - b1.position.y)
                for(let y = t.position.y; y < b1.position.y; y += 1) {
                    let factor = (y - t.position.y) / absY
                   
                    let p1 = Vertex.interpolate(t, b1, factor)
                    let p2 = Vertex.interpolate(t, b2, factor)
                    this.drawLine( p1, p2)
                }
            }
            
            
            if (top.position.y < bottom1.position.y) {
                drawTop(top, bottom1, bottom2)
            } else {
                drawBottom(top, bottom1, bottom2)
            }
        }
    
        let p1 = v1.position
        let p2 = v2.position
        let p3 = v3.position
        if (p1.y == p2.y) {
            drawFlatTriangle(v3, v2, v1)
        } else if (p2.y == p3.y) {
            drawFlatTriangle(v1, v3, v2)
        }  else if (p1.y == p3.y) {
            drawFlatTriangle(v2, v3, v1)
        } else {
            let vs = [v1, v2, v3]
            vs = vs.sort(function (a, b) {
                return a.position.y - b.position.y;
            });
            let top = vs[0]
            let center = vs[1]
            let bottom = vs[2]
            let factor = (center.position.y - top.position.y) / (bottom.position.y - top.position.y)
            let centerV = Vertex.interpolate(top, bottom, factor)
         
            drawFlatTriangle( top, centerV, center)
            drawFlatTriangle( bottom, centerV, center)
        }
    }
}


