import {getAFromXy,getBFromXy,getUniqId} from './IdUtils';

var numsToUpdate2={}
var numsXy={}
var numsGroup={}
var round=0
var possibleNums=[]

var numsInputX={}
var numsInputY={}
var numsInputGroup={}

export function loopToCalcSudoNums(initNumsXy,initNumsGroups,pNumsXy,possibleNumsInX){
    numsXy=initNumsXy
    numsGroup=initNumsGroups
    createPossibleNumsList(pNumsXy,possibleNumsInX)

    findPossibleNumsForAll()
    return {numsToUpdate2,numsXy,numsGroup}
}

function createPossibleNumsList(pNumsXy,possibleNumsInX){
    for(var x=0;x<9;x++){
        for(var y=0;y<9;y++){
            if(pNumsXy[x] && pNumsXy[x][y] && pNumsXy[x][y].length>0){
                possibleNums.push({x,y,nums:pNumsXy[x][y],mark:0})
            }
        }
    }
}

function isResultCorrect(){
    for(var b=0;b<9;b++){
        var sum=0
        for(var a=0;a<9;a++){
            sum+=numsXy[b][a]
            }
        if(sum !==45){
            return false
        }
    }
    for(var a=0;a<9;a++){
        var sum=0
        for(var b=0;b<9;b++){
            sum+=numsXy[b][a]
            }
        if(sum !==45){
            return false
        }
    }
    for(var a=0;a<9;a++){
        var sum=0
        for(var b=0;b<9;b++){
            sum+=numsGroup[a][b]
            }
        if(sum !==45){
            return false
        }
    }
    return true
}

// 填入一个数时的处理
function updateSpace(x,y,v){
    round+=1
    var value=Number(v)
    // 更新格子里的数
    numsXy[x][y]=value
    numsGroup[getAFromXy(x,y)][getBFromXy(x,y)]=value
    // 记录要更新的数
    numsToUpdate2[getUniqId(x,y)]={x,y,value}

    if(numsInputX[x]){
        numsInputX[x].push(value)
    }else{
        numsInputX[x]=[value]
    }

    if(numsInputY[y]){
        numsInputY[y].push(value)
    }else{
        numsInputY[y]=[value]
    }
    var a=getAFromXy(x,y)
    if(numsInputGroup[a]){
        numsInputGroup[a].push(value)
    }else{
        numsInputGroup[a]=[value]
    }
}


// 删除填入的数时的处理
function recoverySpace(x,y){
    var value=numsXy[x][y]
    // 更新格子里的数
    numsXy[x][y]=0
    numsGroup[getAFromXy(x,y)][getBFromXy(x,y)]=0
    // 删除要更新的记录
    delete numsToUpdate2[getUniqId(x,y)]

    numsInputX[x].splice(numsInputX[x].indexOf(value),1)
    numsInputY[y].splice(numsInputY[y].indexOf(value),1)
    var a=getAFromXy(x,y)
    numsInputGroup[a].splice(numsInputGroup[a].indexOf(value),1)
}

function goBackAndTryNext(i){
    console.log("后"+i)

    var {x,y,nums,mark}=possibleNums[i]
    recoverySpace(x,y)
    if(mark===nums.length){
        possibleNums[i].mark=0
        // 可能性遍历完，往前回溯一个格子
        goBackAndTryNext(i-1)
    }else{
        if(checkIfNumsOk(i)){
            updateSpace(x,y,nums[possibleNums[i].mark])
            possibleNums[i].mark+=1
            if(i<possibleNums.length-1){
                goForawardAndTryNext(i+1)
            }
        }else{
            possibleNums[i].mark=0
            goBackAndTryNext(i-1)
        }
    }
}

function checkIfNumsOk(i){
    var isOk=false
    while(!isOk && possibleNums[i].mark<possibleNums[i].nums.length){
        isOk=checkIfNumOk(i)
        if(!isOk){
            possibleNums[i].mark+=1
        }
    }
    return isOk
}

function checkIfNumOk(i){
    var {x,y,nums,mark}=possibleNums[i]
    var input=nums[mark]
    if(numsInputX[x] && numsInputX[x].includes(input)){
        return false
    }
    if(numsInputY[y] && numsInputY[y].includes(input)){
        return false
    }
    var a=getAFromXy(x,y)
    if(numsInputGroup[a] && numsInputGroup[a].includes(input)){
        return false
    }
    return true
}

function goForawardAndTryNext(i){
    if(i===possibleNums.length){
        return
    }
    var {x,y,nums}=possibleNums[i]
    if(checkIfNumsOk(i)){
        updateSpace(x,y,nums[possibleNums[i].mark])
        console.log("前"+i)

        if(possibleNums[i].mark>0){
            console.log("EEERROR")
        }
        possibleNums[i].mark+=1
        if(i<possibleNums.length-1){
            goForawardAndTryNext(i+1)
        }
    }else{
        possibleNums[i].mark=0
        goBackAndTryNext(i-1)
    }
}

// 遍历所有格子，更新每个格子能填的数组
function findPossibleNumsForAll(){
    
    // // 第一步：在每个里填入第一个可能的数字
    // for(var i=0;i<possibleNums.length;i++){
    //     var {x,y,nums,mark}=possibleNums[i]
    //     if(checkIfNumsOk(i)){
    //         updateSpace(x,y,nums[mark])
    //         possibleNums[i].mark+=1
    //         if(i<possibleNums.length-1){
    //             goForawardAndTryNext(i+1)
    //         }
    //     }else{
    //         possibleNums[i].mark=0
    //         goBackAndTryNext(i-1)
    //     }
    // }
    // var res=isResultCorrect()
    // while(!res && round<5000){
        console.log("空格"+possibleNums.length)
        goForawardAndTryNext(0)
        // res=isResultCorrect()
    // }
}
