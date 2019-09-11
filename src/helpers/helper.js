const Fraction = require('fraction.js');
const algebra = require("algebra.js");

export const getNodeNameByPoint = (point) => {
    debugger;
    const { p, q } = point;
    if (q < 0){
        return 'silla';
    }

    if(q === 0 && p === 0){
        return 'subte';
    }

    if(q === 0 && p > 0){
        return 'infinitos puntos de equilibrio atractores';
    }

    if(q === 0 && p < 0){
        return 'infinitos puntos de equilibrio repulsores';
    }

    if(q > 0 && p === 0){
        return 'centro';
    }

    if(p > 0 && q === Math.pow(p,2)/4){
        return 'nodo atractor degenerado';
    }

    if(p < 0 && q === Math.pow(p,2)/4){
        return 'nodo repulsor degenerado';
    }

    if(p < 0 && q > Math.pow(p,2)/4){
        return 'foco repulsor ';
    }

    if(p > 0 && q > Math.pow(p,2)/4){
        return 'foco atractor';
    }

    if(p > 0){
        return 'nodos atractores';
    }

    if(p < 0){
        return 'nodos repulsores';
    }
};

export const toFraction = (x) => (
    new algebra.Fraction(new Fraction(x).n * new Fraction(x).s, new Fraction(x).d)
);
  
export const toDecimal = (x) => (
    x.numer / x.denom
);

export const findBalancePoints = (func, p, q) => {
    const balancePoints = [];
    const funcPoints = algebra.parse(`${func.toString()} = 0`).solveFor('a');
    Array.isArray(funcPoints) ? 
        balancePoints.push(...funcPoints.map(x => [toDecimal(x),0])) :
        balancePoints.push([toDecimal(funcPoints),0]);

    if(p.toString().split('a').length > 1){
        const pPoints = algebra.parse(`${p.toString()} = 0`).solveFor('a');
        Array.isArray(pPoints) ? 
        balancePoints.push(...pPoints.map(x => [0, toDecimal(x)])) :
        balancePoints.push([0,toDecimal(pPoints)]);
    }
    
    if(q.toString().split('a').length > 1){
        const qPoints = algebra.parse(`${q.toString()} = 0`).solveFor('a');
        Array.isArray(qPoints) ? 
        balancePoints.push(...qPoints.map(x => [toDecimal(x), 0])) :
        balancePoints.push([toDecimal(qPoints), 0]);
    }

    return balancePoints;
}