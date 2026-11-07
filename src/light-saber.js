class LightSaberEffect{
    constructor(canvas,video){
        this.canvas=canvas;
        this.video=video;

        this.lastA=null;
        this.lastB=null;
        this.color=[51,78,164];
        this.bladeColor="#1e90ff";
        this.ctx=canvas.getContext("2d",{willReadFrequently:true});
        this.audioEffect=new AudioEffect();

        window.addEventListener('keydown',e=>{
            if(e.key==='1') this.bladeColor="#1e90ff";
            if(e.key==='2') this.bladeColor="#ff1a1a";
            if(e.key==='3') this.bladeColor="#cfe8ff";
        });

        canvas.addEventListener('click',e=>{
            const r=canvas.getBoundingClientRect();
            const x=Math.floor((r.right-e.clientX)*canvas.width/r.width);
            const y=Math.floor((e.clientY-r.top)*canvas.height/r.height);
            const p=this.ctx.getImageData(x,y,1,1).data;
            this.color=[p[0],p[1],p[2]];
        });

        this.animate();
    }

    animate(){
        requestAnimationFrame(this.animate.bind(this));

        this.ctx.drawImage(this.video,0,0,
            this.canvas.width,this.canvas.height);

        const locs=getMarkedLocations(this.ctx,this.color,60);

        if(locs.length>1){
            const C=average(locs);

            let A=getFarthestFrom(locs,C);
            let B=getFarthestFrom(locs,A);

            const setA=[];
            const setB=[];
            for(let i=0;i<locs.length;i++){
                if(distance(A,locs[i])<distance(B,locs[i])){
                    setA.push(locs[i]);
                }else{
                    setB.push(locs[i]);
                }
            }

            if(setA.length===0||setB.length===0) return;

            A=average(setA);
            B=average(setB);

            if(this.lastA!=null){
                const same=distance(A,this.lastA)+distance(B,this.lastB);
                const swapped=distance(A,this.lastB)+distance(B,this.lastA);
                if(swapped<same){
                    [A,B]=[B,A];
                }
                A=[this.lastA[0]*0.6+A[0]*0.4,this.lastA[1]*0.6+A[1]*0.4];
                B=[this.lastB[0]*0.6+B[0]*0.4,this.lastB[1]*0.6+B[1]*0.4];
            }

            const length=4;
            const tip=[
                A[0]+(B[0]-A[0])*length,
                A[1]+(B[1]-A[1])*length
            ];

            if(this.lastA!=null){
                const d=(distance(this.lastA,A)+distance(this.lastB,B))/(Math.max(this.canvas.width,this.canvas.height));
                this.audioEffect.masterGain.gain.linearRampToValueAtTime(d*2,this.audioEffect.audioContext.currentTime+0.1);
            }
            this.lastA=A;
            this.lastB=B;

            this.ctx.save();
            this.ctx.lineCap='round';

            this.ctx.beginPath();
            this.ctx.shadowColor=this.bladeColor;
            this.ctx.shadowBlur=50;
            this.ctx.strokeStyle=this.bladeColor;
            this.ctx.lineWidth=28;
            this.ctx.moveTo(...B);
            this.ctx.lineTo(...tip);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.shadowBlur=25;
            this.ctx.lineWidth=16;
            this.ctx.moveTo(...B);
            this.ctx.lineTo(...tip);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.shadowColor='white';
            this.ctx.shadowBlur=10;
            this.ctx.strokeStyle='white';
            this.ctx.lineWidth=7;
            this.ctx.moveTo(...B);
            this.ctx.lineTo(...tip);
            this.ctx.stroke();

            this.ctx.restore();
        }
    }
}

class AudioEffect{
    constructor(){
        this.audioContext=new (window.webkitAudioContext||window.AudioContext)();

        this.oscillator=this.audioContext.createOscillator();
        this.oscillator.type='sine';
        this.oscillator.frequency.setValueAtTime(100,this.audioContext.currentTime);
        this.oscillator.start();

        this.gainNode=this.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(0,this.audioContext.currentTime);
        this.oscillator.connect(this.gainNode);

        this.masterGain=this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(0.4,this.audioContext.currentTime);
        this.gainNode.connect(this.masterGain);

        this.masterGain.connect(this.audioContext.destination);

        const resume=()=>this.audioContext.resume();
        document.addEventListener('click',resume,{once:true});
        document.addEventListener('keydown',resume,{once:true});

        setInterval(()=>{
            this.gainNode.gain.linearRampToValueAtTime(0.2,this.audioContext.currentTime+0.1);
            this.gainNode.gain.exponentialRampToValueAtTime(1,this.audioContext.currentTime+0.4);
        },400);
    }
}
