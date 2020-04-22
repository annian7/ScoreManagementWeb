layui.use(['form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;
    var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
    var identity = sessionStorage.getItem("identity");
    var teacherId = 0;
    if(identity==2){
        teacherId = accountInfo.id;
    }
    //用户列表
    var tableIns = table.render({
        elem: '#classList',
        url : 'http://localhost:8080/ScoreManagement_war_exploded/courseArrangement/queryAll.action',
        where:{
            "teacherId":teacherId
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
            {field: 'teacher', title: '教师姓名', minWidth:100, align:"center",templet: function(d){
                return d.teacher.name;
            }},
            {field: 'course', title: '课程', minWidth:100, align:"center",templet: function(d){
                    return d.course.name
            }},
            {field: 'shift', title: '班级', minWidth:100, align:"center",templet: function(d){
                return d.shift.major.name+d.shift.no
            }},
            {title: '操作', minWidth:200, templet:'#userListBar',fixed:"right",align:"center"}
        ]],
    });
//编辑
    function edit(edit){
        var index = layui.layer.open({
            title : "填入成绩",
            type : 2,
            content : "studentList.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body',index);
                if(edit){
                    body.find(".classId").val(edit.shift.id);  //班级id
                    body.find(".courseId").val(edit.course.id);  //课程id
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }

    //列表操作
    table.on('tool(classList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){ //编辑
            edit(data);
        }
    });
})
