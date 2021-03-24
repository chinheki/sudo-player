import {getAFromXy,getBFromXy,getXFromGroupNum,getUniqId,getYFromGroupNum,getPairNumsId} from './IdUtils';
import {possibleNumsFromTwoList} from './ListUtils';

var possibleNumsXy={} // Key1为竖向位移x，Key2为横向位移y，value为{x,y,可填入数列}
var possibleNumsGroup={}
var numsToUpdate={}
var possibleNumsInGroup={}
var numsXy={}
var numsGroup={}
var isUpdated=false

export function calcSudoNums(initNumsXy,initNumsGroups){
    numsXy=initNumsXy
    numsGroup=initNumsGroups
    findPossibleNumsForAll()
    return numsToUpdate
}

function findNextNullSpace(x,y){
    for(var i=x;i<9;i++){
        for(var i2=y+1;i2<9;i2++){
            if(numsXy[i][i2]===0){
                return {x:i,y:i2}
            }
        }
    }
}

//   列出每个单独九宫格内缺少的数字
function findPossibleNumsForGroup(){
    for(var x=0;x<9;x++){
        possibleNumsInGroup[x]=[1,2,3,4,5,6,7,8,9]
        for(var y=0;y<9;y++){
            if(numsGroup[x][y]!==0){
                possibleNumsInGroup[x].splice(possibleNumsInGroup[x].indexOf(numsGroup[x][y]),1)
            }
        }
    }
}
// 填入一个数时的处理
function updateSpace(x,y,v){
    var value=Number(v)
    // 更新格子里的数
    numsXy[x][y]=value
    numsGroup[x-x%3+(y-y%3)/3][x%3*3+y%3]=value
    // 记录要更新的数
    numsToUpdate[getUniqId(x,y)]={x,y,value}
    // 删除这个格子在可填入数组的Map里的数据
    if(possibleNumsXy[x] && possibleNumsXy[x][y]){
        delete possibleNumsXy[x][y]
        if(Object.keys(possibleNumsXy[x])===0){
            delete possibleNumsXy[x]
        }
    }
    if(possibleNumsGroup[getAFromXy(x,y)] && possibleNumsGroup[getAFromXy(x,y)][getBFromXy(x,y)]){
        delete possibleNumsGroup[getAFromXy(x,y)][getBFromXy(x,y)]
        if(Object.keys(possibleNumsGroup[getAFromXy(x,y)])===0){
            delete possibleNumsGroup[getAFromXy(x,y)]
        }
    }
    // 删除这个格子所在九宫格可填入数组里的数
    possibleNumsInGroup[getAFromXy(x,y)].splice(possibleNumsInGroup[getAFromXy(x,y)].indexOf(value),1)
    // 这一轮有更新的flag
    isUpdated=true
}
// 遍历所有格子，更新每个格子能填的数组
function findPossibleNumsForAll(){
    
    findPossibleNumsForGroup()
    // 第一步：根据行，列，所在九宫格得到每个格子可能的数组
    for(var x=0;x<9;x++){
      for(var y=0;y<9;y++){
        if(numsXy[x][y]===0){
            var possibleNums=findPossibleNums(x,y)
            if(possibleNums.length===0){
                // no answer for whole sudo
                return
            }else if(possibleNums.length===1){
                updateSpace(x,y,possibleNums[0])
            }else{
                if(!possibleNumsXy[x]){
                    possibleNumsXy[x]={}
                }
                if(!possibleNumsGroup[getAFromXy(x,y)]){
                    possibleNumsGroup[getAFromXy(x,y)]=[]
                }
                possibleNumsXy[x][y]={x,y,possibleNums}
                possibleNumsGroup[getAFromXy(x,y)][getBFromXy(x,y)]=possibleNumsXy[x][y]
            }
        }
      }
    }
    // 第二步:排查每个格子里九个格子可填的数组,找出可能的唯一解
    findUniqPossibleNumsInGroups()
    findUniqPossibleNumsInX()
    findUniqPossibleNumsInY()
    // 如果有更新，说明现有逻辑还有解法，进行递归
    if(isUpdated && Object.keys(possibleNumsXy).length>0){
        isUpdated=false
        findPossibleNumsForAll()
    }else{
        return
    }
}

    // 排除横，竖，所处九宫格内存在的数字
function findPossibleNums(x,y){
        var a=getAFromXy(x,y)
        var nums=Array.from(possibleNumsInGroup[a])
        if(possibleNumsXy[x] && possibleNumsXy[x][y]){
            nums=possibleNumsFromTwoList(possibleNumsInGroup[a],possibleNumsXy[x][y].possibleNums)
        }
        for(var i=0;i<9;i++){
            if(numsXy[x][i] !==0 && nums.includes(numsXy[x][i])){
                nums.splice(nums.indexOf(numsXy[x][i]),1)
            }
            if(numsXy[i][y]!==0 && nums.includes(numsXy[i][y])){
                nums.splice(nums.indexOf(numsXy[i][y]),1)
            }
        }
        
        return nums
}

    // 所处九宫格内是否存在只有自身能填入的数
function findUniqPossibleNumsInGroups(){
        var possibleNumsPairs={}
        for(var aa=0;aa<9;aa++){
        var uniqPossibleNums={}
        // 处理某个九宫格
        for(var bb=0;bb<9;bb++){
            // 遍历该九宫格内每个空格可填数组，如果有一个数只出现过一次，则说明只有一种可能
            var possibleNumList=possibleNumsGroup[aa][bb]
            if(possibleNumList && possibleNumList.possibleNums){
                possibleNumList.possibleNums.forEach(element => {
                    if(uniqPossibleNums[element]){
                        uniqPossibleNums[element].push({a: aa,b: bb})
                    }else{
                        uniqPossibleNums[element]=[{a: aa,b: bb}]
                    }
                });
            }
        }
        var doublePossibleNums=[]
        if(Object.keys(uniqPossibleNums).length>0){
            Object.keys(uniqPossibleNums).forEach(key=>{
                if(uniqPossibleNums[key].length==1){
                    // 数只出现过一次，则填入出现的格子
                    var {a,b}=uniqPossibleNums[key][0]
                    var value=key
                    var x=getXFromGroupNum(a,b)
                    var y=getYFromGroupNum(a,b)
                    updateSpace(x,y,value)
                }else if(uniqPossibleNums[key].length==2){
                    // 数只出现过两次，则寻找是否有同样的格子也只能填入同样的两个数
                    var pairNumsId=getPairNumsId(uniqPossibleNums[key])
                    if(doublePossibleNums.includes(pairNumsId)){
                        if(!possibleNumsPairs[uniqPossibleNums[key]]){
                            possibleNumsPairs[uniqPossibleNums[key]]=[]
                        }
                        possibleNumsPairs[uniqPossibleNums[key]].push(possibleNumsPairs[uniqPossibleNums[key][0].b])
                        possibleNumsPairs[uniqPossibleNums[key]].push(possibleNumsPairs[uniqPossibleNums[key][1].b])
                    }else{
                        doublePossibleNums[key]=pairNumsId
                    }
                }
            })
            if(Object.keys(possibleNumsPairs)>0){
                deleteNumsInPossibleNumsGroup(possibleNumsPairs,aa)
                isUpdated=true
            }
        }
    }
}

    // 所处行，列是否存在只有自身能填入的数
    function findUniqPossibleNumsInX(){
        var possibleNumsPairs={}
        var possibleNumsPairsY={}
        for(var xx=0;xx<9;xx++){
        var uniqPossibleNums={}
        // 处理某个九宫格
        for(var yy=0;yy<9;yy++){
            // 遍历该行内每个空格可填数组，如果有一个数只出现过一次，则说明只有一种可能
            var possibleNumList=possibleNumsXy[xx][yy]
            if(possibleNumList && possibleNumList.possibleNums){
                possibleNumList.possibleNums.forEach(element => {
                    if(uniqPossibleNums[element]){
                        uniqPossibleNums[element].push({x: xx,y: yy})
                    }else{
                        uniqPossibleNums[element]=[{x: xx,y: yy}]
                    }
                });
            }
        }
        var doublePossibleNums=[]
        if(Object.keys(uniqPossibleNums).length>0){
            Object.keys(uniqPossibleNums).forEach(key=>{
                if(uniqPossibleNums[key].length==1){
                    // 数只出现过一次，则填入出现的格子
                    var {x,y}=uniqPossibleNums[key][0]
                    var value=key
                    updateSpace(x,y,value)
                }else if(uniqPossibleNums[key].length==2){
                    // 数只出现过两次，则寻找是否有同样的格子也只能填入同样的两个数
                    var pairNumsId=getPairNumsId(uniqPossibleNums[key])
                    if(doublePossibleNums.includes(pairNumsId)){
                        if(!possibleNumsPairs[uniqPossibleNums[key]]){
                            possibleNumsPairs[uniqPossibleNums[key]]=[]
                        }
                        possibleNumsPairs[uniqPossibleNums[key]].push(possibleNumsPairs[uniqPossibleNums[key][0].b])
                        possibleNumsPairs[uniqPossibleNums[key]].push(possibleNumsPairs[uniqPossibleNums[key][1].b])
                    }else{
                        doublePossibleNums[key]=pairNumsId
                    }
                }
            })
            if(Object.keys(possibleNumsPairs)>0){
                deleteNumsInPossibleNumsXy(possibleNumsPairs,xx)
                isUpdated=true
            }
        }
    }
}

  // 所处行是否存在只有自身能填入的数
  function findUniqPossibleNumsInY(){
    var possibleNumsPairs={}
    for(var yy=0;yy<9;yy++){
    var uniqPossibleNums={}
    // 处理某个九宫格
    for(var xx=0;xx<9;xx++){
        // 遍历该行内每个空格可填数组，如果有一个数只出现过一次，则说明只有一种可能
        var possibleNumList=possibleNumsXy[xx][yy]
        if(possibleNumList && possibleNumList.possibleNums){
            possibleNumList.possibleNums.forEach(element => {
                if(uniqPossibleNums[element]){
                    uniqPossibleNums[element].push({x:xx,y:yy})
                }else{
                    uniqPossibleNums[element]=[{x:xx,y:yy}]
                }
            });
        }
    }
    var doublePossibleNums=[]
    if(Object.keys(uniqPossibleNums).length>0){
        Object.keys(uniqPossibleNums).forEach(key=>{
            if(uniqPossibleNums[key].length==1){
                // 数只出现过一次，则填入出现的格子
                var {x,y}=uniqPossibleNums[key][0]
                var value=key
                updateSpace(x,y,value)
            }else if(uniqPossibleNums[key].length==2){
                // 数只出现过两次，则寻找是否有同样的格子也只能填入同样的两个数
                var pairNumsId=getPairNumsId(uniqPossibleNums[key])
                if(doublePossibleNums.includes(pairNumsId)){
                    if(!possibleNumsPairs[uniqPossibleNums[key]]){
                        possibleNumsPairs[uniqPossibleNums[key]]=[]
                    }
                    possibleNumsPairs[uniqPossibleNums[key]].push(possibleNumsPairs[uniqPossibleNums[key][0].b])
                    possibleNumsPairs[uniqPossibleNums[key]].push(possibleNumsPairs[uniqPossibleNums[key][1].b])
                }else{
                    doublePossibleNums[key]=pairNumsId
                }
            }
        })
        if(Object.keys(possibleNumsPairs)>0){
            deleteNumsInPossibleNumsXy(possibleNumsPairs,xx)
            isUpdated=true
        }
    }
}
}

function deleteNumsInPossibleNumsGroup(possibleNumsPairs,a){
    var possibleNums=possibleNumsGroup[a]
    possibleNums.Array.forEach((b)=>{
        Object.keys(possibleNumsPairs).forEach((value)=>{
            if(!possibleNumsPairs[value].includes(b)  && possibleNums[b].possibleNums.includes(value)){
                possibleNums[b].possibleNums.splice(value,1)
            }
        })
    })
}
function deleteNumsInPossibleNumsXy(possibleNumsPairs,x){
    var possibleNums=possibleNumsXy[x]
    possibleNums.Array.forEach((b)=>{
        Object.keys(possibleNumsPairs).forEach((value)=>{
            if(!possibleNumsPairs[value].includes(b)  && possibleNums[b].possibleNums.includes(value)){
                possibleNums[b].possibleNums.splice(value,1)
            }
        })
    })
}