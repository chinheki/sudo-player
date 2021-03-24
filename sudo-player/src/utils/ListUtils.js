export function possibleNumsFromTwoList(list1,list2){
    var newList=Array.from(list2)
    list1.forEach(e=>{
        if(newList.includes(e)){
            newList.splice(e,1)
        }
    })
    return newList
}

