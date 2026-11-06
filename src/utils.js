function getMarkedLocations(ctx, color = [51, 78, 164], threshold=60) {
    const locs = [];
    const imgData = ctx.getImageData(0,0,
        ctx.canvas.width, ctx.canvas.height);
    const data=imgData.data;
    
    for(let i = 0; i<data.length;i+=4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];

        if(colorMatch([r,g,b],color,threshold)) {
            const pIndex=i/4;
            const y = Math.floor(pIndex / ctx.canvas.width);
            const x = pIndex % ctx.canvas.width;
            locs.push([x,y]);
        }
    }
    return locs;
}

function colorMatch(c1,c2,threshold) {
    return distance(c1,c2) < threshold;
}

function distance (p1,p2) {
    let dist = 0;
    for(let i = 0; i<p1.length;i++) {
        dist+=(p1[i]-p2[i])*(p1[i]-p2[i]) 
    }
    return Math.sqrt(dist);
}

function average(locs){
    const center=[0,0];
    for(let i = 0;i<locs.length;i++){
        center[0]+=locs[i][0];
        center[1]+=locs[i][1];
    }
    center[0]/=locs.length;
    center[1]/=locs.length;
    return center;
}

function getFarthestFrom(locs, point) {
    let maxDist = distance(point,locs[0]);
    let farthest=locs[0];

    for(let i = 1; i < locs.length;i++) {
        let d = distance(locs[i], point);
        if(d>maxDist){
            maxDist = d;
            farthest=locs[i];
        }
    }
    return farthest;
}
