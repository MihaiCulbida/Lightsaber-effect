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
        console.log("marked locations:", locs);
        requestAnimationFrame(this.animate.bind(this));
    }
}