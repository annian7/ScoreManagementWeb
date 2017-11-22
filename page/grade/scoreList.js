layui.use(['laydate','form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;
    var laydate = layui.laydate;
    //年选择器
    laydate.render({
    elem: '#test2',
    type: 'year',
    format: 'yyyy'
    });
    var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
    var identity = sessionStorage.getItem("identity");
    function scores(){
        var userGrade = $(".userGrade").val() //获取classid newOption.value
        console.log(userGrade)
        var year = $("#test2").val();
        var phase = $(".phase").val();
        var course = $(".course").val();
        if(year==null || year==""){
            layer.msg("请选择日期",{time:1000});
            return false;
        }
        //成绩列表
        var tableIns = table.render({
        elem: '#scoreList',
        url : 'http://localhost:8080/ScoreManagement_war_exploded/score/queryStudentScoreAll.action',
        where: {
            "classId": userGrade,
            "year":year,
            "phases":phase,
            "courseId":course
        },
        parseData: function(res){ //res 即为原始返回的数据
            return {
              "code": 0, //解析接口状态
              "msg": "", //解析提示文本
              "data": res//解析数据列表
            };
          },
        cellMinWidth : 95,
        page : false,
        height : "full-125",
        id : "teacListTable",
        cols : [[
            {field: 'id', title: '学号', minWidth:100, align:"center",templet: function(d){
                return d.student.id
            }},
            {field: 'name', title: '姓名', minWidth:100, align:"center",templet: function(d){
                return d.student.name
            }},
            {field: 'course', title: '课程', minWidth:100, align:"center",templet: function(d){
                return d.course.name
            }},
            {field: 'year', title: '学年', minWidth:100, align:"center",templet: function(){
                var date = new Date;
                return date.getFullYear()-1+"-"+date.getFullYear();
            }},
            {field: 'month', title: '学期', minWidth:100, align:"center",templet: function(){
                var date = new Date;
                var month = date.getMonth();
                if(month>=3&&month<9){
                    return "第二学期";
                }else{
                    return "第一学期";
                }
            }},
            {field: 'attendanceRecord', title: '出勤成绩', minWidth:100, align:"center"},
            {field: 'assignmentRecord', title: '平时成绩', minWidth:100, align:"center"},
            {field: 'examRecond', title: '考试成绩', minWidth:100, align:"center"},
            {field: 'totalPoints', title: '总成绩', minWidth:100, align:"center"}
        ]],
        });
    }

    function studentScore(){
        var year = $("#test2").val();
        var phase = $(".phase").val();
        if(year==null || year==""){
            layer.msg("请选择日期",{time:1000});
            return false;
        }
        var studentId="";
        if(identity==3){
            studentId = $(".searchVal").val();
            if(studentId==null||studentId==""){
                layer.msg("请输入学号", {
                    time: 1000
                });
                return false;
            }
            console.log(studentId);
        }else{
            studentId = accountInfo.id;
        }
        //学生个人成绩
        var tableIns = table.render({
        elem: '#scoreList',
        url : 'http://localhost:8080/ScoreManagement_war_exploded/score/selectStudentScores.action',
        where: {
            "studentId":studentId,
            "year":year,
            "phases":phase
        },
        parseData: function(res){ //res 即为原始返回的数据
            return {
              "code": 0, //解析接口状态
              "msg": "", //解析提示文本
              "data": res//解析数据列表
            };
          },
        cellMinWidth : 95,
        page : false,
        height : "full-125",
        id : "teacListTable",
        cols : [[
            {field: 'id', title: '学号', minWidth:100, align:"center",templet: function(d){
                return d.student.id
            }},
            {field: 'name', title: '姓名', minWidth:100, align:"center",templet: function(d){
                return d.student.name
            }},
            {field: 'year', title: '学年', minWidth:100, align:"center",templet: function(){
                var date = new Date;
                return date.getFullYear()-1+"-"+date.getFullYear();
            }},
            {field: 'month', title: '学期', minWidth:100, align:"center",templet: function(){
                var date = new Date;
                var month = date.getMonth();
                if(month>=3&&month<9){
                    return "第二学期";
                }else{
                    return "第一学期";
                }
            }},
            {field: 'course', title: '课程', minWidth:100, align:"center",templet: function(d){
                return d.course.name
            }},
            {field: 'attendanceRecord', title: '出勤成绩', minWidth:100, align:"center",edit:"text"},
            {field: 'assignmentRecord', title: '平时成绩', minWidth:100, align:"center",edit:"text"},
            {field: 'examRecond', title: '考试成绩', minWidth:100, align:"center",edit:"text"},
            {field: 'totalPoints', title: '总成绩', minWidth:100, align:"center",edit:"text"},
            {title: '操作', minWidth:200, templet:'#userListBar',fixed:"right",align:"center"}
        ]],
        });
    }

    //列表操作
    table.on('tool(scoreList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'save'){ //保存
            var date = new Date();
            console.log(data);
            console.log(data.assignmentRecord);
            console.log(data.attendanceRecord);
            console.log(data.examRecond);
            console.log(data.totalPoints);
            if(data.assignmentRecord==null||data.assignmentRecord==""||data.attendanceRecord==null||data.attendanceRecord==""||data.examRecond==null||data.examRecond==""||data.totalPoints==null||data.totalPoints==""){
                layer.msg("成绩不能为空",{time:1000});
                return false;
            }
            $.ajax({
                type:"GET",
               url:"http://localhost:8080/ScoreManagement_war_exploded/score/updateScore.action",
                data:{
                    "id":data.id,
                    "attendanceRecord":data.attendanceRecord,
                    "assignmentRecord":data.assignmentRecord,
                    "examRecond":data.examRecord,
                    "totalPoints":data.totalPoints
                },
                async: false,
                dataType:"JSON",
                success:function(data) {
                    if(data.success=="ok"){
                        layer.msg("保存成功",{time:1000});
                    }else{
                        layer.msg("保存失败，请稍后再试",{time:1000});
                    }
                    form.render();
                },
                error: function(XMLHttpRequest, textStatus, errorThrow) {
                    layer.msg("系统繁忙，请稍后再试",{time:1000});
                    debugger;
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
        }
    });
    //搜索
    $(".search_btn").on("click",function(){
        scores();
    });
    //搜索
    $(".student_btn").on("click",function(){
        studentScore();
    });
})

//查询所有班级
$.ajax({
    type: "GET",
    url: "http://localhost:8080/ScoreManagement_war_exploded/class/queryAll.action",
    dataType: "JSON",
    async :false,
    success: function (data,item) {
          for (var item=0; item < data.length; item++) {
            var newOption = document.createElement("option");
            newOption.text = data[item].major.name + data[item].no;
            newOption.value =  data[item].id;
            document.getElementById("class_id").add(newOption);
          }
    },
    error: function (XMLHttpRequest, textStatus, errorThrow) {
        layer.msg("系统繁忙，请稍后再试", {
            time: 1000
        });
        debugger;
        console.log(XMLHttpRequest.status);
        console.log(XMLHttpRequest.readyState);
        console.log(textStatus);
    }
});

//查询所有课程
$.ajax({
    type: "GET",
    url: "http://localhost:8080/ScoreManagement_war_exploded/course/queryAll.action",
    dataType: "JSON",
    async :false,
    success: function (data,item) {
          for (var item=0; item < data.length; item++) {
            var newOption = document.createElement("option");
            newOption.text = data[item].name;
            newOption.value =  data[item].id;
            document.getElementById("course").add(newOption);
          }
    },
    error: function (XMLHttpRequest, textStatus, errorThrow) {
        layer.msg("系统繁忙，请稍后再试", {
            time: 1000
        });
        debugger;
        console.log(XMLHttpRequest.status);
        console.log(XMLHttpRequest.readyState);
        console.log(textStatus);
    }
});





