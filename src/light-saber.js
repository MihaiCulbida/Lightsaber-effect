class LightSaberEffect{
    constructor(canvas,video){
        this.canvas=canvas;
        this.video=video;  

        this.lastA=null;
        this.lastB=null;
        this.ctx=canvas.getContext("2d");
        this.audioEffect=new AudioEffect();
        this.animate();
    }

    animate(){
        this.ctx.drawImage(this.video,0,0,
            this.canvas.width,this.canvas.height);
    
        const locs=getMarkedLocations(this.ctx);
        
        if(locs.length>1){
            const C=average(locs);

            
            let A=getFarthestFrom(locs,C);
            let B=getFarthestFrom(locs,A);


            let setA=[];
            let setB=[];
            for(let i=0;i<locs.length;i++){
                if(distance(A,locs[i])<distance(B,locs[i])){
                    setA.push(locs[i]);
                }else{
                    setB.push(locs[i]);
                }
            }

            for(let i=0;i<setA.length;i++){
                this.ctx.beginPath();
                this.ctx.fillStyle='lightgreen';
                this.ctx.rect(setA[i][0],setA[i][1],1,1);
                this.ctx.fill();
            }
            for(let i=0;i<setB.length;i++){
                this.ctx.beginPath();
                this.ctx.fillStyle='yellow';
                this.ctx.rect(setB[i][0],setB[i][1],1,1);
                this.ctx.fill();
            }
            
            A=average(setA)
            B=average(setB)

            this.ctx.beginPath();
            this.ctx.fillStyle="red";
            this.ctx.arc(...C,10,0,Math.PI*2);
            this.ctx.fill();

            this.ctx.fillStyle="lime";
            this.ctx.beginPath();
            this.ctx.arc(...A,10,0,Math.PI*2);
            this.ctx.fill();

            this.ctx.fillStyle="orange";
            this.ctx.beginPath();
            this.ctx.arc(...B,10,0,Math.PI*2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.strokeStyle="white";
            this.ctx.shadowColor='white';
            this.ctx.lineCap='round';
            this.ctx.shadowBlur=distance(A,B)*0.1;
            this.ctx.lineWidth=distance(A,B)*0.1;

            const length=3;
            const tip=[
                A[0]+(B[0]-A[0])*length,
                A[1]+(B[1]-A[1])*length
            ]
            this.ctx.moveTo(...B);
            this.ctx.lineTo(...tip);

            if(this.lastA!=null){
                const d=(distance(this.lastA,A)+distance(this.lastB,B))/(Math.max(this.canvas.width,this.canvas.height));
                this.audioEffect.masterGain.gain.linearRampToValueAtTime(d*2, this.audioEffect.audioContext.currentTime+0.1);
            }
            this.lastA=A;
            this.lastB=B;
            this.ctx.stroke();
        }
    
        requestAnimationFrame(this.animate.bind(this));
    }
}

class AudioEffect{
    constructor(){
        
        this.audioContext = new (window.webkitAudioContext || window.AudioContext)();

        this.oscillator = this.audioContext.createOscillator();

        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime); // value in hertz
        this.oscillator.start();

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.oscillator.connect(this.gainNode);
        
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        this.gainNode.connect(this.masterGain);

        this.masterGain.connect(this.audioContext.destination)

        setInterval(()=>{
            this.gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime+0.1);
            this.gainNode.gain.exponentialRampToValueAtTime(1, this.audioContext.currentTime+0.4);
        },400)
    }
}

