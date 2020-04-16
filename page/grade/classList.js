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
            {type: "checkbox", fixed:"left", width:50},
            {field: 'teacher', title: '职工号', minWidth:100, align:"center",templet: function(d){
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

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("teacListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    id: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            table.reload("teacListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    id: 0  //搜索的关键字
                }
            })
            // layer.msg("请输入搜索的内容");
        }
    });

    //添加用户
    function addUser(edit){
        var index = layui.layer.open({
            title : "添加用户",
            type : 2,
            content : "userAdd.html",
            success : function(layero, index){
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
    $(".addNews_btn").click(function(){
        addUser();
    })
//编辑
    function edit(edit){
        var index = layui.layer.open({
            title : "修改用户",
            type : 2,
            content : "modifyTeacherInfo.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body',index);
                if(edit){
                    $.ajax({
                        type:"GET",
                       url:"http://localhost:8080/ScoreManagement_war_exploded/teacher/selectTeacherOne.action",
                        data:{
                            "id":edit.id
                        },
                        async: false,
                        dataType:"JSON",
                        success:function(data) {
                            console.log(JSON.stringify(data))
                            body.find(".id").val(data.id);  //登录名
                            body.find(".name").val(data.name);
                            body.find(".college").val(data.college.name);
                            body.find(".sex input[value='"+data.sex+"']").prop("checked","checked");  //性别
                            if(data.tel!=null||data.tel!=""){
                                body.find(".tel").val(data.tel);
                            }
                            if(data.birthday!=null||data.birthday!=""){
                                body.find(".birthday").val(data.birthday);
                            }
                            if(data.email!=null||data.email!=""){
                                body.find(".email").val(data.email);
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
    table.on('tool(userList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            edit(data);
        }else if(layEvent === 'query'){ //查询
            layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
                $.get("http://localhost:8080/ScoreManagement_war_exploded/teacher/deleteTeacher.action", {
                    id : data.id  //将需要删除的newsId作为参数传入
                },function(data){
                    tableIns.reload();
                    layer.msg("删除成功",{time:1000});
                    layer.close(index);
                })
            });
        }
    });

})
