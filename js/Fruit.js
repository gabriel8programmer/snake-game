
class Fruit {
  constructor(x, y, w, h, c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }
  
  //change position x and y
  change(x, y){
    this.x = x;
    this.y = y;
  }
  
  render(ctx){
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

export default Fruit;