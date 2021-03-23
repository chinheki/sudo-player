import {getGroupNumFromXy,getIdInGroupFromXy,getXFromGroupNum,getUniqId,getYFromGroupNum} from './IdUtils';

export function calcSudoNums(initNumsXy,initNumsGroups){
    var spaceList={}
    var spaceListGroup={}
    var result={}
    var possibleNumsForGroup=findPossibleNumsForGroup(initNumsGroups)
    result=findPossibleNumsForAll(initNumsXy,initNumsGroups,spaceList,spaceListGroup,result,possibleNumsForGroup)
    return result
}

function findNextNullSpace(x,y,initNumsXy){
    for(var i=x;i<9;i++){
        for(var i2=y+1;i2<9;i2++){
            if(initNumsXy[i][i2]===0){
                return {x:i,y:i2}
            }
        }
    }
}

//   列出每个单独九宫格内缺少的数字
function findPossibleNumsForGroup(initNumsGroups){
    var possibleNumsForGroup={}
    for(var x=0;x<9;x++){
        possibleNumsForGroup[x]=[1,2,3,4,5,6,7,8,9]
        for(var y=0;y<9;y++){
            if(initNumsGroups[x][y]!==0){
                possibleNumsForGroup[x].splice(possibleNumsForGroup[x].indexOf(initNumsGroups[x][y]),1)
            }
        }
    }
    return possibleNumsForGroup
}

// 遍历所有格子，更新每个格子能填的数组
function findPossibleNumsForAll(initNumsXy,initNumsGroups,spaceList,spaceListGroup,result,possibleNumsForGroup){
    var isUpdated=false
    // 第一步：根据行，列，所在九宫格得到每个格子可能的数组
    for(var x=0;x<9;x++){
      for(var y=0;y<9;y++){
        if(initNumsXy[x][y]===0){
            var possibleNums=findPossibleNums(x,y,initNumsXy,possibleNumsForGroup)
            if(possibleNums.length===0){
                // no answer for whole sudo
                return false
            }else if(possibleNums.length===1){
                initNumsXy[x][y]=possibleNums[0];
                initNumsGroups[x-x%3+(y-y%3)/3][x%3*3+y%3]=possibleNums[0];
                result[getUniqId(x,y)]={x,y,value:possibleNums[0]}
                delete spaceList[getUniqId(x,y)]
                possibleNumsForGroup[getGroupNumFromXy(x,y)].splice(possibleNumsForGroup[getGroupNumFromXy(x,y)].indexOf(possibleNums[0]),1)
                if(spaceListGroup[getGroupNumFromXy(x,y)] && spaceListGroup[getGroupNumFromXy(x,y)][getIdInGroupFromXy(x,y)]){
                    delete spaceListGroup[getGroupNumFromXy(x,y)][getIdInGroupFromXy(x,y)]
                }
                isUpdated=true
            }else{
                spaceList[getUniqId(x,y)]={x,y,possibleNums}
                if(!spaceListGroup[getGroupNumFromXy(x,y)]){
                    spaceListGroup[getGroupNumFromXy(x,y)]=[]
                }
                spaceListGroup[getGroupNumFromXy(x,y)][getIdInGroupFromXy(x,y)]={x,y,possibleNums}
            }
        }
      }
    }
    // 第二步:排查每个格子里九个格子可填的数组,找出可能的唯一解
    var res=findUniqPossibleNums(spaceListGroup,result,spaceList,possibleNumsForGroup,isUpdated)
    result=res.result
    spaceList=res.spaceList
    isUpdated=res.isUpdated
    // 如果有更新，说明现有逻辑还有解法，进行递归
    if(isUpdated && spaceList.length>0){
        findPossibleNumsForAll(initNumsXy,initNumsGroups,spaceList,spaceListGroup,result)
    }else{
        // 没有任何更新，则进入新的逻辑
        return result
    }
    console.log(spaceList)
}

    // 排除横，竖，所处九宫格内存在的数字
function findPossibleNums(x,y,initNumsXy,possibleNumsForGroup){
        var a=getGroupNumFromXy(x,y)
        var nums=Array.from(possibleNumsForGroup[a])
        
        for(var i=0;i<9;i++){
            if(initNumsXy[x][i]!=="" && nums.includes(initNumsXy[x][i])){
                nums.splice(nums.indexOf(initNumsXy[x][i]),1)
            }
            if(initNumsXy[i][y]!=="" && nums.includes(initNumsXy[i][y])){
                nums.splice(nums.indexOf(initNumsXy[i][y]),1)
            }
        }
        
        return nums
}

    // 所处九宫格内是否存在只有自身能填入的数
function findUniqPossibleNums(spaceListGroup,result,spaceList,possibleNumsForGroup,isUpdated){
    for(var a=0;a<9;a++){
        var uniqPossibleNums={}
        for(var b=0;b<9;b++){
            var possibleNumList=spaceListGroup[a][b]
            if(possibleNumList){
                possibleNumList.possibleNums.forEach(element => {
                    if(uniqPossibleNums[element]){
                        uniqPossibleNums[element]="checked"
                    }else{
                        uniqPossibleNums[element]={a,b,value:element}
                    }
                });
            }
        }
        if(Object.keys(uniqPossibleNums).length>0){
            Object.keys(uniqPossibleNums).forEach(key=>{
                if(uniqPossibleNums[key]!=="checked"){
                    var {a,b,value}=uniqPossibleNums[key]
                    var x=getXFromGroupNum(a,b)
                    var y=getYFromGroupNum(a,b)
                    result[getUniqId(x,y)]={x,y,value}
                    delete spaceList[getUniqId(x,y)]
                    possibleNumsForGroup[a].splice(possibleNumsForGroup[a].indexOf(value),1)
                    if(spaceListGroup[getGroupNumFromXy(x,y)] && spaceListGroup[getGroupNumFromXy(x,y)][getIdInGroupFromXy(x,y)]){
                        delete spaceListGroup[getGroupNumFromXy(x,y)][getIdInGroupFromXy(x,y)]
                    }
                    isUpdated=true
                }
            })
        }
    }
    return {result,spaceList,isUpdated}
}
