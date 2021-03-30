import {getAFromXy,getBFromXy,getXFromGroupNum,getUniqId,getYFromGroupNum,getPairNumsId} from './IdUtils';
import {possibleNumsFromMultiLists} from './ListUtils';

var pNumsXy={} // Key1为竖向位移x，Key2为横向位移y，value为{x,y,可填入数列}
var pNumsGroup={}
var numsToUpdate={}
var possibleNumsInGroup={}
var possibleNumsInX={}
var possibleNumsInY={}
var numsXy={}
var numsGroup={}
var isUpdated=false
var round=0

export function calcSudoNums(initNumsXy,initNumsGroups){
    numsXy=initNumsXy
    numsGroup=initNumsGroups
    numsToUpdate={}
    findPossibleNumsForAll()
    return {numsToUpdate,numsXy,numsGroup,pNumsXy,possibleNumsInX}
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
    for(var a=0;a<9;a++){
        possibleNumsInGroup[a]=[1,2,3,4,5,6,7,8,9]
        for(var b=0;b<9;b++){
            if(numsGroup[a][b]!==0){
                possibleNumsInGroup[a].splice(possibleNumsInGroup[a].indexOf(numsGroup[a][b]),1)
            }
        }
    }
}

//   列出每列内缺少的数字
function findPossibleNumsForY(){
    for(var y=0;y<9;y++){
        possibleNumsInY[y]=[1,2,3,4,5,6,7,8,9]
        for(var x=0;x<9;x++){
            if(numsXy[x][y]!==0){
                possibleNumsInY[y].splice(possibleNumsInY[y].indexOf(numsXy[x][y]),1)
            }
        }
    }
}

//   列出每行内缺少的数字
function findPossibleNumsForX(){
    for(var x=0;x<9;x++){
        possibleNumsInX[x]=[1,2,3,4,5,6,7,8,9]
        for(var y=0;y<9;y++){
            if(numsXy[x][y]!==0){
                possibleNumsInX[x].splice(possibleNumsInX[x].indexOf(numsXy[x][y]),1)
            }
        }
    }
}
// 填入一个数时的处理
function updateSpace(x,y,v,log){
    var value=Number(v)
    // 更新格子里的数
    numsXy[x][y]=value
    numsGroup[getAFromXy(x,y)][getBFromXy(x,y)]=value
    // 记录要更新的数
    numsToUpdate[getUniqId(x,y)]={x,y,value}
    // 删除这个格子在可填入数组的Map里的数据
    if(pNumsXy[x] && pNumsXy[x][y]){
            pNumsXy[x][y]=[]
        }
    if(pNumsXy[x]){
        pNumsXy[x].forEach(e=>{
            if(e && e.includes(value)){
                e.splice(e.indexOf(value),1)
            }
        })
    }
    var a=getAFromXy(x,y)
    var b=getBFromXy(x,y)
    if(pNumsGroup[a] && pNumsGroup[a][b]){
            pNumsGroup[a][b]=[]
        }
    if(pNumsGroup[a]){
        Object.values(pNumsGroup[a]).forEach(e=>{
            if(e && e.includes(value)){
                e.splice(e.indexOf(value),1)
            }
        })
    }
    // 删除这个格子所在九宫格可填入数组里的数
    possibleNumsInGroup[a].splice(possibleNumsInGroup[a].indexOf(value),1)
    if(possibleNumsInX[x] && possibleNumsInX[x].includes(value)){
        possibleNumsInX[x].splice(possibleNumsInX[x].indexOf(value),1)
    }
    if(possibleNumsInY[y] && possibleNumsInY[y].includes(value)){
        possibleNumsInY[y].splice(possibleNumsInY[y].indexOf(value),1)
    }
    console.log("ROUND "+round+":UPDATE ["+x+","+y+"]="+v+log)
    // 这一轮有更新的flag
    isUpdated=true
}
// 遍历所有格子，更新每个格子能填的数组
function findPossibleNumsForAll(){
    
    findPossibleNumsForGroup()
    findPossibleNumsForX()
    findPossibleNumsForY()

    // 第一步：根据行，列，所在九宫格得到每个格子可能的数组
    for(var x=0;x<9;x++){
      for(var y=0;y<9;y++){
        var a=getAFromXy(x,y)
        var b=getBFromXy(x,y)
        if(numsXy[x][y]===0){
            var possibleNums=findPossibleNums(x,y)
            if(possibleNums.length===0){
                // no answer for whole sudo
                // throw ("no answer")
            }else if(possibleNums.length===1){
                updateSpace(x,y,possibleNums[0]," 可能性唯一")
            }else{
                if(!pNumsXy[x]){
                    pNumsXy[x]=[]
                }
                if(!pNumsGroup[a]){
                    pNumsGroup[a]=[]
                }
                pNumsXy[x][y]=Array.from(possibleNums)
                pNumsGroup[a][b]=Array.from(possibleNums)
            }
        }
      }
    }
    // 第二步:排查每个格子里九个格子可填的数组,找出可能的唯一解
    findUniqPossibleNumsInGroups()
    findUniqPossibleNumsInX()
    findUniqPossibleNumsInY()
    // 如果有更新，说明现有逻辑还有解法，进行递归
    if(isUpdated){
        // if(isUpdated && Object.keys(possibleNumsXy).length>0){
        isUpdated=false
        console.log("ROUND "+round+":ACTION FINISH")
        round+=1
        findPossibleNumsForAll()
    }else{
        return
    }
}

    // 排除横，竖，所处九宫格内存在的数字
function findPossibleNums(x,y){
        var a=getAFromXy(x,y)
        var listList=[possibleNumsInGroup[a],
        possibleNumsInX[x],
        possibleNumsInY[y]];
        if(pNumsXy[x] && pNumsXy[x][y]){
            listList.push(pNumsXy[x][y])
        }
        var nums=possibleNumsFromMultiLists(
            listList
            )
        return nums
}

    // 所处九宫格内是否存在只有自身能填入的数
function findUniqPossibleNumsInGroups(){
    var possibleNumsPairs={}
    for(var a=0;a<9;a++){
        var uniqPossibleNums={}
        // 处理某个九宫格
        for(var b=0;b<9;b++){
            // 遍历该九宫格内每个空格可填数组，如果有一个数只出现过一次，则说明只有一种可能
            if(numsGroup[a][b]===0 && pNumsGroup[a] && pNumsGroup[a][b] && pNumsGroup[a][b].length>0){
                pNumsGroup[a][b].forEach(num => {
                if(possibleNumsInGroup[a] && possibleNumsInGroup[a].includes(num)){
                    if(uniqPossibleNums[num]){
                            uniqPossibleNums[num].push(b)
                        }else{
                            uniqPossibleNums[num]=[b]
                 } }
                    });
                }
            }
        
        var doublePossibleNums=[]
        if(Object.keys(uniqPossibleNums).length>0){
            Object.keys(uniqPossibleNums).forEach(num=>{
                var number=Number(num)
                if(uniqPossibleNums[num].length===1){
                    // 数只出现过一次，则填入出现的格子
                    var b=uniqPossibleNums[num][0]
                    var value=number
                    var x=getXFromGroupNum(a,b)
                    var y=getYFromGroupNum(a,b)
                    updateSpace(x,y,value," 九宫格唯一")
                }else if(uniqPossibleNums[num].length==2){
                    // 数只出现过两次，则寻找是否有同样的格子也只能填入同样的两个数
                    var twoBId=getPairNumsId(uniqPossibleNums[num])
                    if(doublePossibleNums.includes(twoBId)){
                        if(!possibleNumsPairs[num]){
                            possibleNumsPairs[num]=[]
                        }
                        possibleNumsPairs[num].push(uniqPossibleNums[num][0])
                        possibleNumsPairs[num].push(uniqPossibleNums[num][1])
                    }else{
                        doublePossibleNums[number]=twoBId
                    }
                
            }
        })
            if(Object.keys(possibleNumsPairs).length>0){
                deleteNumsInPossibleNumsGroup(possibleNumsPairs,a)
            }
        }
    }
}

    // 所处行是否存在只有自身能填入的数
function findUniqPossibleNumsInX(){
    var possibleNumsPairs={}
    for(var x=0;x<9;x++){
        var uniqPossibleNums={}
        // 处理某个九宫格
        for(var y=0;y<9;y++){
            if(numsXy[x][y]===0 && pNumsXy[x] && pNumsXy[x][y] && pNumsXy[x][y].length>0){
                // 遍历该行内每个空格可填数组，如果有一个数只出现过一次，则说明只有一种可能
                pNumsXy[x][y].forEach(num => {
                    if(possibleNumsInX[x] && possibleNumsInX[x].includes(num)){
                        if(uniqPossibleNums[num]){
                            uniqPossibleNums[num].push(y)
                        }else{
                            uniqPossibleNums[num]=[y]
                        }}
                    });
                }
            }
        
            var doublePossibleNums=[]
            if(Object.keys(uniqPossibleNums).length>0){
                Object.keys(uniqPossibleNums).forEach(num=>{
                    var number=Number(num)
                    if(uniqPossibleNums[num].length==1){
                        // 数只出现过一次，则填入出现的格子
                        var y=uniqPossibleNums[num][0]
                        var value=number
                        updateSpace(x,y,value," 行唯一")
                    }else if(uniqPossibleNums[num].length==2){
                        // 数只出现过两次，则寻找是否有同样的格子也只能填入同样的两个数
                        var pairNumsId=getPairNumsId(uniqPossibleNums[num])
                        if(doublePossibleNums.includes(pairNumsId)){
                            if(!possibleNumsPairs[num]){
                                possibleNumsPairs[num]=[]
                            }
                            possibleNumsPairs[num].push(uniqPossibleNums[num][0])
                            possibleNumsPairs[num].push(uniqPossibleNums[num][1])
                        }else{
                            doublePossibleNums[number]=pairNumsId
                        }
                    
                }
            })
                if(Object.keys(possibleNumsPairs).length>0){
                    deleteNumsInPossibleNumsX(possibleNumsPairs,x)
                }
            }
    }
}

  // 所处列是否存在只有自身能填入的数
  function findUniqPossibleNumsInY(){
    var possibleNumsPairs={}
    for(var y=0;y<9;y++){
        var uniqPossibleNums={}
        // 处理某个九宫格
        for(var x=0;x<9;x++){
            // 遍历该行内每个空格可填数组，如果有一个数只出现过一次，则说明只有一种可能
            if(numsXy[x][y]===0 && pNumsXy[x] && pNumsXy[x][y] && pNumsXy[x][y].length>0){
                pNumsXy[x][y].forEach(num => {
                if(possibleNumsInY[y] && possibleNumsInY[y].includes(num)){
                    if(uniqPossibleNums[num]){
                            uniqPossibleNums[num].push(x)
                        }else{
                            uniqPossibleNums[num]=[x]
                        }
                    }
                    });
                }
            }
        
        var doublePossibleNums=[]
        if(Object.keys(uniqPossibleNums).length>0){
            Object.keys(uniqPossibleNums).forEach(num=>{
                var number=Number(num)
                if(uniqPossibleNums[num].length==1){
                    // 数只出现过一次，则填入出现的格子
                    var x=uniqPossibleNums[num][0]
                    var value=number
                    updateSpace(x,y,value," 列唯一")
                }else if(uniqPossibleNums[num].length==2){
                    // 数只出现过两次，则寻找是否有同样的格子也只能填入同样的两个数
                    var pairNumsId=getPairNumsId(uniqPossibleNums[num])
                    if(doublePossibleNums.includes(pairNumsId)){
                        if(!possibleNumsPairs[num]){
                            possibleNumsPairs[num]=[]
                        }
                        possibleNumsPairs[num].push(uniqPossibleNums[num][0])
                        possibleNumsPairs[num].push(uniqPossibleNums[num][1])
                    }else{
                        doublePossibleNums[number]=pairNumsId
                    }
                }
            })
            if(Object.keys(possibleNumsPairs).length>0){
                deleteNumsInPossibleNumsY(possibleNumsPairs,y)
            }
        }
    }
}
// possibleNumsPairs={数字:[该九宫格内唯二可出现该数字的地方]}
function deleteNumsInPossibleNumsGroup(possibleNumsPairs,a){
    for(var b=0;b<9;b++){
        if(pNumsGroup[a] && pNumsGroup[a][b] && pNumsGroup[a][b].length>0){
            Object.keys(possibleNumsPairs).forEach((value)=>{
                if(!possibleNumsPairs[value].includes(b)  && pNumsGroup[a][b].includes(value)){
                    pNumsGroup[a][b].splice(pNumsGroup[a][b].indexOf(value),1)
                    isUpdated=true
                }
            })
        }
    }
}
// possibleNumsPairs={数字:[该行内唯二可出现该数字的地方]}
function deleteNumsInPossibleNumsX(possibleNumsPairs,x){
    for(var y=0;y<9;y++){
        if(pNumsXy[x] && pNumsXy[x][y] && pNumsXy[x][y].length>0){
            Object.keys(possibleNumsPairs).forEach((value)=>{
                if(!possibleNumsPairs[value].includes(y)  &&  pNumsXy[x][y].includes(value)){
                    pNumsXy[x][y].splice(pNumsXy[x][y].indexOf(value),1)
                   isUpdated=true
                }
            })
        }
    }
}
// possibleNumsPairs={数字:[该列内唯二可出现该数字的地方]}
function deleteNumsInPossibleNumsY(possibleNumsPairs,y){
    for(var x=0;x<9;x++){
        if(pNumsXy[x] && pNumsXy[x][y] && pNumsXy[x][y].length>0){
            Object.keys(possibleNumsPairs).forEach((value)=>{
                if(!possibleNumsPairs[value].includes(x)  &&  pNumsXy[x][y].includes(value)){
                    pNumsXy[x][y].splice(pNumsXy[x][y].indexOf(value),1)
                   isUpdated=true
                }
            })
        }
    }
}