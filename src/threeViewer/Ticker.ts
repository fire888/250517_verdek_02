import { rtt } from "three/tsl"

type IFuncToUpdate = (v: number) => void 

export class Ticker {
    
    private functionsToUpdate: IFuncToUpdate[] = []  
    private oldTime: number = Date.now()
    public isRunning: boolean = false

    constructor() {


    }

    public on(f: IFuncToUpdate) {
        this.functionsToUpdate.push(f)
    }

    private update() {
        if (!this.isRunning) {
            return
        }
        requestAnimationFrame(this.update.bind(this))
      
        const time = Date.now()
        const delta = (time - this.oldTime)
        const n = Math.round(delta / 16)    
        this.oldTime = time
        for (let i = 0; i < this.functionsToUpdate.length; ++i) {
            this.functionsToUpdate[i](n)
        }
    }

    start () {
        this.isRunning = true
        this.update()
    }

    stop () {
        this.isRunning = false
    }

}



