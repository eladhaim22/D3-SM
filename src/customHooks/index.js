import { useState, useEffect } from 'react';

export const useTwoPointsPrecision = (graph, renderUpdate, forkPoints) => {
    const [shouldUpdate, setShouldUpdate] = useState(false); 
    const [xPoint, setXPoint] = useState(null);
    useEffect(() => {
        if(graph){
        graph.on(['mousemove'], ({x,y}) => {
            if(!shouldUpdate){
            const closePoint = forkPoints.filter(p => Math.abs(p-x) < 0.01);
            if(closePoint.length > 0){
                setXPoint(closePoint[0]);
                setShouldUpdate(true);  
            }
            }
        });  
        }}
    ,[graph]);

    useEffect(() => {
        if(shouldUpdate){
            graph.tip.move({x: xPoint, y: 0});
            renderUpdate(xPoint);
            setShouldUpdate(false);  
        }
    },[shouldUpdate]);
}