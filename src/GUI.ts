import Renderer from "./Renderer"
import { bindAll } from "./Utils"

interface IOption {
    // 初始化数值
    init:  number,
    // 最大
    max: number,
    // 最小
    min: number,
    // 配置项名称
    title: string,
    // 字段名
    name: string,
}

function createCounter() {
    let count = 0; 

    return () => {
        count++;
        return count;
    };
}

export default class GUI {
    private dom: HTMLElement
    private renderer: Renderer
    private counter = createCounter()

    constructor(dom: HTMLElement, renderer: Renderer) {
        this.dom = dom
        this.renderer = renderer
    }

    addNumber(option: IOption) {
        let count = this.counter()
        let className = `slider-${count}`
        let html = `<label class="slider-wapper ${className}">
            <div>${option.title}</div>
            <input class="slider" type="range" min="0" max="100" data-min=${option.min} data-max=${option.max} data-value=${option.name}>
            <div class="slider-value">${option.init}</div>
        </label>`
        this.dom.insertAdjacentHTML("beforeend", html)

        this.bind(`.${className}`)
    }

    bind(className: string) {
        document.querySelector(className).addEventListener('input', (event: any) => {
            let target = event.target
            let value = parseInt(target.value)
            let min = parseFloat(target.dataset.min) 
            let max = parseFloat(target.dataset.max)
            let v = min +  (value / 100) * (max - min)
            let bindVar = 'this.renderer.'+ target.dataset.value
            eval(bindVar +  "=" + Number(v))
            let label = target.closest("label").querySelector(".slider-value")
            label.innerText = v
        })
    }
}
