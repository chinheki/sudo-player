export function getGroupNumFromXy(x,y){
    return x-x%3+(y-y%3)/3
}

export function getIdInGroupFromXy(x,y){
    return x%3*3+y%3
}

export function getXFromGroupNum(a,b){
    return a-a%3+(b-b%3)/3
}

export function getYFromGroupNum(a,b){
    return a%3*3+b%3
}
  
export function getUniqId(x,y){
    return x*10+y
}
