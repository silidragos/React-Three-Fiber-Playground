export default class MathUtils{
    static Clamp(num, min, max){
        return num <= min ? min : num >= max ? max : num;
    }
}