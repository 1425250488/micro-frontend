// 身份证号
export function reg_cert_code( id ){
  // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
  var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if(!format.test(id)){
    return false;
  }
  //区位码校验
  //出生年月日校验  前正则限制起始年份为1900;
  var year = id.substr(6,4),//身份证年
    month = id.substr(10,2),//身份证月
    date = id.substr(12,2),//身份证日
    time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
    now_time = Date.parse(new Date()),//当前时间戳
    dates = (new Date(year,month,0)).getDate();//身份证当月天数
  if(time>now_time||date>dates){
    return false
  }
  //校验码判断
  var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);  //系数
  var b = new Array('1','0','X','9','8','7','6','5','4','3','2'); //校验码对照表
  var id_array = id.split("");
  var sum = 0;
  for(var k=0;k<17;k++){
    sum+=parseInt(id_array[k])*parseInt(c[k]);
  }
  if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
    return false
  }
  return true
}
export function cert_code ( rule, value, callback ) {
  if (reg_cert_code( value ) || value == '' || value == null) {
    callback()
  } else {
    callback(new Error("请输入正确的身份证号"))
  }
}

// 手机号
export function reg_phone( value ){
  return /^1[356789]\d{9}$/.test(value)
}
export function phone (rule, value, callback) {
  if (reg_phone(value) || value == '' || value == null) {
    callback()
  } else {
    callback(new Error("请输入正确的手机号"))
  }
}

// 固定电话
export function reg_tel( value ){
  return /^((\+86)|(86))?(1)\d{10}$/.test(value)
}
export function reg_tel2( value ){
  return /^0[0-9]{2,3}-[1-8][0-9]{6,7}$/.test(value)
}
export function tel(rule, value, callback) {
  if (reg_tel(value) || reg_tel2(value) || value == '' || value == null) {
    callback()
  } else {
    callback(new Error("请输入正确的固定电话"))
  }
}

//邮箱
export function reg_email( value ){
  return /^[a-zA-Z0-9]{2,}@[a-z0-9]{2,}\.[a-z]{2,}$/.test(value)
}
export function email(rule, value, callback) {
  if (reg_email(value) || value == '' || value == null) {
    callback()
  } else {
    callback(new Error("请输入正确的邮箱"))
  }
}

//姓名
export function reg_name( value ){
  return /^[^x00-xff]+$/.test(value)
}
export function name(rule, value, callback) {
  if (reg_name(value) || value == '' || value == null) {
    callback()
  } else {
    callback(new Error("请输入正确的名称"))
  }
}
