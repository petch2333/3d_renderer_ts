import Color from "./Color"
import Vector3 from "./Vector3"


export default class Texture {
    public width: number
    public height: number
    private pixels: Color[][] = []

    constructor(width: number, height: number, pixels: Color[][]) {
        this.width = width
        this.height = height
        this.pixels = pixels
    }

    static parseWithImage(path: string) {
        return new Promise((resolve, reject) => {
            const img = new Image();
        
            img.onload = function () {
              const canvas = document.createElement('canvas');
              let width = img.width
              let height = img.height

              canvas.width = width;
              canvas.height = height;
              const context = canvas.getContext('2d');
              context.drawImage(img, 0, 0);

              const imageData = context.getImageData(0, 0, width, height);
              const pixels = imageData.data; 
              let pixelArray: Color[][] = []
              for (let y = 0; y < height; y++) {
                const row: Color[] = [];
                for (let x = 0; x < width; x++) {
                  const index = (y * width + x) * 4;
                  let c = new Color(
                    pixels[index],
                    pixels[index + 1],
                    pixels[index + 2],
                    pixels[index + 3]
                  )
                  
                  row.push(c);
                }
                pixelArray.push(row);
              }
              let texture = new Texture(width, height, pixelArray)
              canvas.remove()
              resolve(texture);
            };
        
            img.onerror = function (err) {
              reject(new Error('图片加载失败: ' + path));
            };
        
            img.src = path;
          });
    }

    positionPixel(x: number, y: number) {
   
        if (x > this.width) {
            x = this.width
        } 
        if (y > this.height) {
            y = this.height
        }
    
        x = x - 1
        y = y - 1

        if (x < 0) {
            x = 1
        }
        if (y < 0) {
            y = 1
        }
        return this.pixels[y][x]   
    }

    draw(context: CanvasRenderingContext2D) {

        /*
            
            图片数组是 height = 3 * width = 4
            然后绘制的时候 希望绘制的
            (0, 0) (0, 1) (0, 2) (0, 3)
            (1, 0) (1, 1) (1, 2) (1, 3)
            (2, 0) (2, 1) (2, 2) (2, 3)


            for (let i = 0; i < 3 ; i+1) {
                for (let j = 0; j < 4 ; j+1) {
                
                }
            }

            得到是的
            (0, 0) (0, 1) (0, 2)
            (1, 0) (1, 1) (1, 2)
            (2, 0) (2, 1) (2, 2) 
            (3, 0) (3, 1) (3, 2) 



            所以我从外边传入 x y 的时候要颠倒下
        */
        for (let i = 0; i < this.height; i += 1) {
            let line =  this.pixels[i]
            for (let j = 0; j < this.width; j += 1) {
                let c = line[j]
                drawPixel(context, Vector3.new(i, j, 0, c))
            }
        }

        
        function drawPixel(context: CanvasRenderingContext2D, point: Vector3) {
            let c = point.color
            
            // 因为像素放大了，所以 x y 坐标也要放大
            // 如果不懂这里，可以代入具体数值计算一下
            // 我们这里是用 500x500 像素来模拟 100x100 的屏幕
            // 这样每个像素大小就是 5x5
            let pixelSize = 10
            let x = point.x * pixelSize
            let y = point.y* pixelSize
            let w = pixelSize
            let h = pixelSize
        
            let r = c.r
            let g = c.g
            let b = c.b
            let a = c.a
        
            
            // Pixels.push(point)
            // 用一个矩形模拟一个像素点
            context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
            context.fillRect(x, y, w, h,)
            context.restore()
        }
    }
}
