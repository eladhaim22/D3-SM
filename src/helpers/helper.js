const Fraction = require('fraction.js');
const algebra = require("algebra.js");

export const getNodeNameByPoint = (point) => {
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

export const findPoints = (func, p, q) => {
    console.log('findPoints');
    const points = [];
    if(!func || !p || !q) return [];
    const funcPoints = algebra.parse(`${func} = 0`).solveFor('x');
    Array.isArray(funcPoints) ? 
        points.push(...funcPoints.map(x => [toDecimal(x),0])) :
        points.push([toDecimal(funcPoints),0]);

    if(p.toString().split('a').length > 1){
        const pPoints = algebra.parse(`${p.toString()} = 0`).solveFor('a');
        Array.isArray(pPoints) ? 
        points.push(...pPoints.map(x => [toDecimal(x), 0])) :
        points.push([toDecimal(pPoints), 0]);
    }

    if(q.toString().split('a').length > 1){
        const qPoints = algebra.parse(`${q.toString()} = 0`).solveFor('a');
        Array.isArray(qPoints) ? 
        points.push(...qPoints.map(x => [toDecimal(x), 0])) :
        points.push([toDecimal(qPoints), 0]);
    }

    return points;
}