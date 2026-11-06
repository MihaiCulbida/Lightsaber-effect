class LightSaberEffect {
    constructor(canvas, video) {
        this.canvas = canvas;
        this.video = video;
        this.ctx = canvas.getContext("2d");
        this.animate();
    }

    animate() {
        this.ctx.drawImage(this.video,0,0,
            this.canvas.width, this.canvas.height);

        const locs = getMarkedLocations(this.ctx);
        if(locs.length>0) {
            for(let i = 0; i<locs.length;i++){
                this.ctx.beginPath();
                this.ctx.fillStyle='white';
                this.ctx.rect(locs[i][0], locs[i][1],1,1);
                this.ctx.fill();
            }

            const C = average(locs);

            let A = getFarthestForm(locs, C);

            this.ctx.beginPath();
            this.ctx.fillStyle="lime";
            this.ctx.arc(...A,10,0,Math.PI*2);
            this.ctx.fill();

            let B = getFarthestForm(locs, A);
            this.ctx.beginPath();
            this.ctx.fillStyle="orange";
            this.ctx.arc(...B,10,0,Math.PI*2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.strokeStyle="white";
            this.ctx.moveTo(...B);
            this.ctx.lineTo(...A);
            this.ctx.stroke();
        }

        requestAnimationFrame(this.animate.bind(this));
    }
}