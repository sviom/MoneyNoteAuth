/**
 * 랜덤코드 생성
 * @param digit 생성시 원하는 자리 수
 * @returns 랜덤숫자
 */
function generateRandomCode(digit: number) {
    let returnValue = '';

    for (let i = 0; i < digit; i++) {
        returnValue += Math.floor(Math.random() * 10);
    }

    return returnValue;
}

export { generateRandomCode };
