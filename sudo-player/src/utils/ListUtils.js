export function possibleNumsFromMultiLists(listList){
    var numMap={}
    var listNum=0
    var newList=[]
    for(var i=0;i<listList.length;i++){
        if(listList[i] && listList[i].length>0){
            listNum+=1
            listList[i].forEach(e=>{
                if(numMap[e]){
                    numMap[e]+=1
                }else{
                    numMap[e]=1
                }
            })
        }
    }
    if(Object.keys(numMap).length>0){
        Object.keys(numMap).forEach((num)=>{
            if(numMap[num]===listNum){
                newList.push(Number(num))
            }
        })
    }
    // if(newList.length===0){
    //     throw ("0 ps")
    // }
    return newList
}

