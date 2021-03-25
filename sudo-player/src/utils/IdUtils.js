export function getAFromXy(x,y){
    return x-x%3+(y-y%3)/3
}

export function getBFromXy(x,y){
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

export function getPairNumsId(nums){
    if(nums[0]>nums[1]){
        return String(nums[1]).concat(String(nums[0]))
    }else{
        return String(nums[0]).concat(String(nums[1]))
    }
}
