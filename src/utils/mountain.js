import random from 'lodash/random';

export default class Mountain {
    constructor(color, y) {
        this.c = color
        this.y = y
        this.offset = random(100, 200)
        this.t = 0
        this.yScale = 200
    }

    display = (p) => {
        let xoff = 0

        p.noStroke()
        p.fill(this.c)

        p.noiseDetail(1.7, 1.3)

        p.beginShape()
        for (let x = 0; x <= p.width + 25; x += 25) {
            let yoff = p.map(p.noise(xoff + this.offset, this.t + this.offset), 0, 1, 0, this.yScale)
            let y = this.y - yoff
            p.vertex(x, y)

            xoff += .08
        }
        p.vertex(p.width + 100, p.height)
        p.vertex(0, p.height)
        p.endShape(p.CLOSE)

        this.t += 0.003
    }

}