import { round, uniqBy } from 'loadsh';
const nerdamer = require('nerdamer/all');
var algebrite = require('algebrite');

// devuelve el nombre de la trayectoria dependiendo en p y q.
export const getNodeNameByPoint = (point) => {
    const { p, q } = point;
    if (q < 0){
        return {text:'Silla', id:1};
    }

    if(q === 0 && p === 0){
        return {text: 'Subte', id:2};
    }

    if(q === 0 && p > 0){
        return {text: 'Infinitos puntos de equilibrio atractores', id:3};
    }

    if(q === 0 && p < 0){
        return {text: 'Infinitos puntos de equilibrio repulsores', id:4};
    }

    if(q > 0 && p === 0){
        return {text: 'Centro', id:5};
    }

    if(p > 0 && Math.abs(q - Math.pow(p,2)/4) < 0.00001){
        return {text: 'Nodo atractor degenerado', id:6};
    }

    if(p < 0 && Math.abs(q - Math.pow(p,2)/4) < 0.00001){
        return {text: 'Nodo repulsor degenerado', id:7};
    }

    if(p < 0 && q > round(Math.pow(p,2)/4,10)){
        return {text: 'Foco repulsor', id:8};
    }

    if(p > 0 && q > round(Math.pow(p,2)/4,10)){
        return {text: 'Foco atractor', id:9};
    }

    if(p > 0){
        return {text: 'Nodos atractores', id:10};
    }

    if(p < 0){
        return {text: 'Nodos repulsores', id:11};
    }
};

export const evaluate = (expression,resolveFor) => {
    return parseFloat(nerdamer(expression).evaluate(resolveFor).toDecimal());
} 

// devuelve los puntos en el mapa que realments nos importa
export const findPoints = (func, p, q) => {
    if(!func || !p || !q) return [];
    const points = [];
    tryToSolve(func.toString()).map(x => points.push(x));
    tryToSolve(q.toString())
        .map(x => points.push(x));
    tryToSolve(p.toString())
        .filter(x => evaluate(q,{a:x}) >= 0)
        .map(x => points.push(x));
    return points;
}

// devuelve solo raizes reales
const tryToSolve = (equation) => {
    try{
        return uniqBy(algebrite.nroots(equation.replace(/a/g,'x')).tensor.elem.map(x => x.d));;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

// Generamos 200 puntos para dibujar la curva
export const getPoints = (pValue, qValue) => {
    const points = [];
    for(let i=-10;i<10;i=i+0.05){
        let p = evaluate(pValue,{a:i});
        let q = evaluate(qValue,{a:i});
        points.push([p,q]);
    }
    return points;
}