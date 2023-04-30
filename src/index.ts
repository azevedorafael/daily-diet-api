interface Input {
    num: number
}

function calculateNumber({ num }: Input) {
    return num * 2
}

console.log(calculateNumber({ num: 3 }))