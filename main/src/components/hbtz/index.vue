<template>
  <div class="test" style="background-color: burlywood;display:flex;">
    <canvas
        id="myCanvas"
        ref="myCanvas"
        @click="findRect"
        width="460"
        height="240"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mousemove="mousemove"
    >
    </canvas>

    <div class="dislog" v-show="dialogVisible">
      <h2>是否删除矩形框</h2>
      <el-button @click="del">删除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "hello-world",
  data() {
    return {
      flag: false,
      rectWidth: 0,  //矩形框的宽
      rectHeight: 0, //矩形框的高
      totalRect: [],  //画的所有的矩形坐标长度数据存储在数组中
      downX: 0,  //鼠标点击图片落下时的位置（X）
      downY: 0,   //鼠标点击图片落下时的位置（Y）
      ctx: "",   //dom节点
      canvas: null,
      rectTag: false,
      delIndex: null,  //删除时选中的矩形框的index
      atime: null,
      dialogVisible: false,  //删除的弹出框
    };
  },

  mounted() {
    this.canvas = this.$refs.myCanvas;
    this.ctx = this.canvas.getContext("2d");
  },

  methods: {
    // 放下鼠标
    mousedown(e) {
      console.log("鼠标落下");
      this.atime = new Date().getTime();
      this.flag = true;
      this.downX = e.offsetX; // 鼠标落下时的X
      this.downY = e.offsetY; // 鼠标落下时的Y
      this.mousemove(e);
    },
    // 移动鼠标
    mousemove(e) {
      if (this.flag) {
        //判断如果重右下往左上画，这种画法直接return
        if(this.downX - e.offsetX > 0 || this.downY - e.offsetY > 0){
          console.log("重右下往左上画");
          return
        }else{
          console.log("重左上往右下画");
          //如果重左上往右下画，计算出鼠标移动的距离，也就是矩形框的宽和高
          this.rectWidth = Math.abs(this.downX - e.offsetX)
          this.rectHeight = Math.abs(this.downY - e.offsetY)
          console.log("this.rectWidth", this.rectWidth);
          console.log("this.rectHeight", this.rectHeight);
          //判断这个宽高的长度，如果小于10，直接return，因为鼠标移动距离过于短
          //防止点击页面时,会画成一个点，没有意义
          if (this.rectWidth < 10 || this.rectHeight < 10) {
            console.log("只是点击");
            this.rectWidth = 0;
            this.rectHeight = 0;
            return;
          }
          this.clear();   //清空画布
          this.redrawAll();
          this.drawRect(
              this.downX,
              this.downY,
              this.rectWidth,
              this.rectHeight
          );
        }
      }
    },
    // 抬起鼠标
    mouseup(e) {
      // console.log("鼠标抬起");
      this.flag = false;
      let a = new Date().getTime();
      if (a - this.atime > 150) {
        this.rectTag = false;
      } else {
        this.rectTag = true;
      }
      if (this.rectWidth || this.rectHeight) {
        //将画出的数据保存在totalRect中
        this.totalRect.push({
          beforex: this.downX,
          beforey: this.downY,
          rectW: this.rectWidth,
          rectH: this.rectHeight,
        });
      }
    },
    redrawAll() {
      //    console.log("先画之前画过的图，保证画多个的时候看起来像前一个不消失");
      if (this.totalRect.length > 0) {
        this.totalRect.forEach((e) => {
          //    console.log("eeeeeeeeeeeeeeeee",e);
          this.drawRect(e.beforex, e.beforey, e.rectW, e.rectH);
        });
      }
    },
    //清除画布
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawRect(x, y, lineW, lineY) {
      //   开始绘制;
      this.ctx.beginPath();
      //   //设置线条颜色，必须放在绘制之前
      this.ctx.strokeStyle = "#850a1e";
      //   console.log("44444444");
      //   // 线宽设置，必须放在绘制之前
      this.ctx.lineWidth = 2;
      //   console.log("5555555555");
      // strokeRect参数：（左上角x坐标，y:左上角y坐标，绘画矩形的宽度，绘画矩形的高度）
      this.ctx.strokeRect(x, y, lineW, lineY);
      //   console.log("66666666666666");
    },
    //点击画布
    findRect(e) {
      if (this.rectTag) {
        console.log("eeeeeeeeeee", e);
        console.log("this.totalRect", this.totalRect);
        //当点击画布的时候，计算有没有点再矩形框内、哪个矩形框内
        this.totalRect.map((item, index) => {
          if (
              e.offsetX - item.beforex > item.rectW ||
              e.offsetX < item.beforex ||
              e.offsetY - item.beforey > item.rectH ||
              e.offsetY < item.beforey
          ) {
            return;
          } else {
            //找到之后，设置下标
            this.delIndex = index;
            //打开删除弹框
            this.dialogVisible = true;
            console.log("this.delIndex", this.delIndex);
          }
        });
      }
    },
    //点击删除按钮
    del() {
      this.dialogVisible = false;
      //删除
      this.ctx.clearRect(
          this.totalRect[this.delIndex].beforex - 2,
          this.totalRect[this.delIndex].beforey - 2,
          this.totalRect[this.delIndex].rectW + 4,
          this.totalRect[this.delIndex].rectH + 4
      );
      //删掉totalRect的数据，真正的项目中需要调用后台接口，删掉数据库中存储的数据
      this.totalRect.splice(this.delIndex, 1);
      //删掉之后，再画一次，刷新页面
      this.redrawAll();
      console.log(this.totalRect, "删除了没");
    },
  },
};
</script>

<style scoped>
#myCanvas {
  background-color: #3d0609;
  /*background-image: url("../assets/img/map1.jpg");*/
}
.dislog {
  width: 200px;
  height: 200px;
  background-color: pink;
}
</style>
