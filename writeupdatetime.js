#!/usr/bin/env node
/*
批量添加修改时间
用于bolg初始化修改时间
*/

console.log('脚本开始运行..');
var fs = require("fs"); //请求文件系统

var file = "./txt"; //设置读取和写入的文件，当前目录下的test文件
var RegExp=/(updated:\s*)((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))/g;

let toppath="./_posts/";//当前文件夹的名字
function fn(path){
    fs.readdir(path,(err,files)=>{
        files.forEach(function(item){
            fs.stat(path+item+'/',(err,data)=>{
                if(data.isFile()){
                    if(item.indexOf(".md")>-1){
                        writeFileTime(path+item,fs);
                    }
                }else{
                    fn(path+item+'/')
                }
            })
        })
    })
}
fn(toppath)

/*
file:读取时间的文件以及写入内容的文件
fs: 文件系统
*/
function writeFileTime(file,fs){
    fs.readFile(file, 'utf8',function(err, data) { //读取文件内容
        if (err) return console.log("读取文件内容错误：",err);
        //console.log("文件"+file+"的内容：",data);
        fs.stat(file,function(err, stats) { //读取文件信息，创建时间等
           if (err) return console.log("读取文件信息错误：",err);
            //console.log("文件"+file+"的信息：",stats);  //打印文件的信息
            //console.log("创建时间是：",stats.mtime);
            //console.log("文件的创建时间是：",getFormatDate(stats.mtime));
            var result= data.replace(RegExp,""); //替换更新时间
            result = result.replace(/categories:/g, "updated: "+getFormatDate(stats.mtime)+"\r"+"categories:");//data:替换为标准化日期
            //console.log("修改后文件内容为：",result);
            fs.writeFile(file, result, 'utf8',function(err) { //写入新的文件内容
                if (err) return console.log("写文件错误：",err);
            });
        });
    });
}

/*
 timeStr:时间，格式可为："September 16,2016 14:15:05、
 "September 16,2016"、"2016/09/16 14:15:05"、"2016/09/16"、
 '2014-04-23T18:55:49'和毫秒
 dateSeparator：年、月、日之间的分隔符，默认为"-"，
 timeSeparator：时、分、秒之间的分隔符，默认为":"
 */
function getFormatDate(timeStr, dateSeparator, timeSeparator) {
    dateSeparator = dateSeparator ? dateSeparator : "-";
    timeSeparator = timeSeparator ? timeSeparator : ":";
    var date = new Date(timeStr),
            year = date.getFullYear(),// 获取完整的年份(4位,1970)
            month = date.getMonth(),// 获取月份(0-11,0代表1月,用的时候记得加上1)
            day = date.getDate(),// 获取日(1-31)
            hour = date.getHours(),// 获取小时数(0-23)
            minute = date.getMinutes(),// 获取分钟数(0-59)
            seconds = date.getSeconds(),// 获取秒数(0-59)
            Y = year + dateSeparator,
            M = ((month + 1) > 9 ? (month + 1) : ('0' + (month + 1))) + dateSeparator,
            D = (day > 9 ? day : ('0' + day)) + ' ',
            h = (hour > 9 ? hour : ('0' + hour)) + timeSeparator,
            m = (minute > 9 ? minute : ('0' + minute)) + timeSeparator,
            s = (seconds > 9 ? seconds : ('0' + seconds)),
            formatDate = Y + M + D + h + m + s;
    return formatDate;
}