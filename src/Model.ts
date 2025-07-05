import { readFileAsync } from "./Utils"
import Vector3 from "./Vector3"
import Vertex  from "./Vertex"


export default class Model {
    public faces: Vertex[][] = []

    constructor(faces: Vertex[][]) {
        this.faces = faces
    }


    static async parseWithObj(path: string) {
        let file = await readFileAsync(path) 
        let lines = file.trim().split('\n')
        let ps: Vector3[] = []
        let normals: Vector3[] = []
        let uvs: Vector3[] = []
        let faces = []
        for (let line of lines) {
            if (line.startsWith('v ')) {
                let l =  line.trim().slice(1).trim().split(' ')
                let x = parseFloat(l[0])
                let y = parseFloat(l[1])
                let z = parseFloat(l[2])
                ps.push(new Vector3(x, y, z))
            } else if (line.startsWith('vt ')) {
                let l =  line.trim().slice(2).trim().split(' ')
                let x = parseFloat(l[0])
                let y = parseFloat(l[1])
                let z = parseFloat(l[2])
                uvs.push(new Vector3(x, y, z))
            } else if (line.startsWith('vn ')) {
                let l =  line.trim().slice(2).trim().split(' ')
                let x = parseFloat(l[0])
                let y = parseFloat(l[1])
                let z = parseFloat(l[2])
                normals.push(new Vector3(x, y, z))
            } else if (line.startsWith('f ')) {
                const f = line.trim().slice(1).trim().split(' ')
                const face = []
                for (let i = 0; i < 3; i++ ) {
                    let is = f[i].split('/').map(e => parseInt(e))
                    let p = ps[is[0] - 1] 
                    let uv = uvs[is[1] - 1] 
                    let normal = normals[is[2] - 1]
                    let v = Vertex.new(p, normal, uv.x, uv.y)
                    face.push(v)
                }
              
                faces.push(face)
            }  
                   
        }
        return new Model(faces)
    }
}