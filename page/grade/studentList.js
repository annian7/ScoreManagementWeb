layui.use(['form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;
    var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
    var classId = $(".classId").val();
    var courseId = $(".courseId").val();
    //用户列表
    var tableIns = table.render({
        elem: '#studentList',
        url : 'http://localhost:8080/ScoreManagement_war_exploded/student/queryAll.action',
        where:{
            "classId":classId
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
                return d.id
            }},
            {field: 'name', title: '姓名', minWidth:100, align:"center",templet: function(d){
                return d.name
            }},
            {field: 'shift', title: '班级', minWidth:100, align:"center",templet: function(d){
                return d.shift.major.name+d.shift.no
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
            {field: 'attendanceRecord', title: '出勤成绩', minWidth:100, align:"center",edit:"text"},
            {field: 'assignmentRecord', title: '平时成绩', minWidth:100, align:"center",edit:"text"},
            {field: 'examRecord', title: '考试成绩', minWidth:100, align:"center",edit:"text"},
            {title: '操作', minWidth:200, templet:'#userListBar',fixed:"right",align:"center"}
        ]],
    });

    //列表操作
    table.on('tool(studentList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'sven'){ //保存
            var date = new Date();
            if(data.assignmentRecord==null||data.assignmentRecord==""||data.attendanceRecord==null||data.attendanceRecord==""||data.examRecord==null||data.examRecord==""){
                layer.msg("成绩不能为空",{time:1000});
                return false;
            }
            var courseId = $(".courseId").val();
            var year = date.getFullYear();
            var month = date.getMonth();
            if(month>=3&&month<9){
                month=2
            }else{
                month=1
            }
            console.log(courseId)
            $.ajax({
                type:"GET",
               url:"http://localhost:8080/ScoreManagement_war_exploded/score/insertScore.action",
                data:{
                    "studentId":data.id,
                    "teacherId":accountInfo.id,
                    "courseId":courseId,
                    "attendanceRecord":data.attendanceRecord,
                    "assignmentRecord":data.assignmentRecord,
                    "examRecond":data.examRecord,
                    "year":year,
                    "phases":month
                },
                async: false,
                dataType:"JSON",
                success:function(data) {
                    if(data.success=="ok"){
                        layer.msg("保存成功",{time:1000});
                    }else{
                        layer.msg("成绩记录已存在",{time:1000});
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

})
