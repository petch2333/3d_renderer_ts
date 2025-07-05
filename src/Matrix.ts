import Vertex from "./Vertex"
import Vector3 from "./Vector3"


export default class Matrix {
    private m: number[]

    constructor(matrix_list: number[]) {
        this.m = matrix_list
        if (matrix_list == null) {
            this.m = [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
            ]
        }
    }


    static new = function(matrix_list: number[]) {
        return new this(matrix_list)
    }


    public multiply = function(other: Matrix): Matrix {
        let m1 = this.m
        let m2 = other.m
        let m = [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
        ]

        let index = 0
        while (index < 16) {
            // let i = index >> 2
            let i = Math.floor(index / 4)
            let j = index % 4
            m[i*4+j] = 
              m1[i*4+0] * m2[0*4+j] 
            + m1[i*4+1] * m2[1*4+j] 
            + m1[i*4+2] * m2[2*4+j]
            + m1[i*4+3] * m2[3*4+j]
            index += 1
        }
        return Matrix.new(m)
    }


    static zero = function(): Matrix {
        return this.new(null)
    }


    static identity = function(): Matrix {
        let m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
        return this.new(m)
    }


    static lookAtLH = function(eye: Vector3, target: Vector3, up: Vector3): Matrix {
        let zaxis = target.subtract(eye).normalize()
        let xaxis = up.cross(zaxis).normalize()
        let yaxis = zaxis.cross(xaxis).normalize()
    
        let ex = -xaxis.dot(eye)
        let ey = -yaxis.dot(eye)
        let ez = -zaxis.dot(eye)

        let m = [
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            ex, ey, ez, 1,
        ]
        return Matrix.new(m)
    }


    static perspectiveFovLH = function(field_of_view: number, aspect: number, znear: number, zfar: number): Matrix {
        let h = 1 / Math.tan(field_of_view / 2)
        let w = h / aspect
        let m = [
            w, 0, 0, 0,
            0, h, 0, 0,
            0, 0, zfar / (zfar - znear), 1,
            0, 0, (znear * zfar) / (znear - zfar), 0,
        ]
        return Matrix.new(m)
    }


    static rotationX = function(angle: number): Matrix  {
        let s = Math.sin(angle)
        let c = Math.cos(angle)
        let m = [
            1, 0,  0, 0,
            0, c,  s, 0,
            0, -s, c, 0,
            0, 0,  0, 1,
        ]
        return Matrix.new(m)
    }


    static rotationY = function(angle: number): Matrix  {
        let s = Math.sin(angle)
        let c = Math.cos(angle)
        let m = [
            c, 0, -s, 0,
            0, 1, 0,  0,
            s, 0, c,  0,
            0, 0, 0,  1,
        ]
        return Matrix.new(m)
    }


    static rotationZ = function(angle: number): Matrix  {
        let s = Math.sin(angle)
        let c = Math.cos(angle)
        let m = [
            c,  s, 0, 0,
            -s, c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1,
        ]
        return Matrix.new(m)
    }


    static rotation = function(angle: Vector3): Matrix {
        let x = Matrix.rotationZ(angle.z)
        let y = Matrix.rotationX(angle.x)
        let z = Matrix.rotationY(angle.y)
        return x.multiply(y).multiply(z)
    }


    static translation = function(v: Vector3): Matrix {
        let x = v.x
        let y = v.y
        let z = v.z

        let m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ]
        return Matrix.new(m)
    }


    static scale = function(v: Vector3): Matrix {
        let x = v.x
        let y = v.y
        let z = v.z

        let m = [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ]
        return Matrix.new(m)
    }


    public transform = function(v: Vector3): Vector3 {
        let m = this.m
        let x = v.x * m[0] + v.y * m[1*4+0] + v.z * m[2*4+0] + m[3*4+0]
        let y = v.x * m[1] + v.y * m[1*4+1] + v.z * m[2*4+1] + m[3*4+1]
        let z = v.x * m[2] + v.y * m[1*4+2] + v.z * m[2*4+2] + m[3*4+2]
        let w = v.x * m[3] + v.y * m[1*4+3] + v.z * m[2*4+3] + m[3*4+3]

        return Vector3.new(x / w, y / w, z / w)
    }

    static project = (coordVector: Vertex, transformMatrix: Matrix, w: number, h: number): Vertex => {
        var w2 = w / 2
        var h2 = h / 2

        let point = transformMatrix.transform(coordVector.position)
        var x = point.x * w2 + w2
        var y = - point.y * h2 + h2
        var z = point.z
        var v = Vector3.new(x, y, z, coordVector.position.color)
        // var normal = transformMatrix.transform(coordVector.normal)
        // var nx = normal.x * w2 + w2
        // var ny = - normal.y * h2 + h2
        // var nz = normal.z
        // var n = Vector3.new(nx, ny, nz)
        var normal = coordVector.normal
        var cu = coordVector.u
        var cv = coordVector.v
        if(!normal) {
            console.log(coordVector)
        }
        return Vertex.new(v, normal, cu, cv)
    }
}

