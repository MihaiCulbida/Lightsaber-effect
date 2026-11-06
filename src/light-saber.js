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
            let B = getFarthestForm(locs, A);
            let setA = [];
            let setB = [];
            for(let i = 0; i<locs.length;i++){
                if(distance(A, locs[i])<distance(B, locs[i])){
                    setA.push(locs[i]);
                } else {
                    setB.push(locs[i]);
                }
            }
            
            for (let i = 0; i<setA.length;i++){
                this.ctx.beginPath();
                this.ctx.fillStyle="lightgreen";
                this.ctx.rect(setA[i][0], setA[i][1],1,1);
                this.ctx.fill();
            }

            for (let i = 0; i<setB.length;i++){
                this.ctx.beginPath();
                this.ctx.fillStyle="yellow";
                this.ctx.rect(setB[i][0], setB[i][1],1,1);
                this.ctx.fill();
            }
            A=average(setA);
            B=average(setB);

            
            this.ctx.beginPath();
            this.ctx.fillStyle="lime";
            this.ctx.arc(...A,10,0,Math.PI*2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.fillStyle="orange";
            this.ctx.arc(...B,10,0,Math.PI*2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.strokeStyle="white";
            this.ctx.lineWidth=distance(A,B)*0.1;
            this.ctx.lineCap='round';
            this.ctx.shadowColor='white';
            this.ctx.shadowBlur=distance(A,B)*0.1;
            this.ctx.moveTo(...B);
            const length = 3;
            const tip = [
                A[0]+(B[0]-A[0])*length, 
                A[1]+(B[1]-A[1])*length
            ];
            this.ctx.lineTo(...tip);
            this.ctx.stroke();
        }

        requestAnimationFrame(this.animate.bind(this));
    }
}