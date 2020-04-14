layui.use(['form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#userList',
        url : 'http://localhost:8080/ScoreManagement_war_exploded/student/queryPage.action',
        parseData: function(res){ //res 即为原始返回的数据
            return {
              "code": 0, //解析接口状态
              "msg": "", //解析提示文本
              "count": res.count, //解析数据长度
              "data": res.data //解析数据列表
            };
          },
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        id : "userListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'id', title: '学号', minWidth:100, align:"center"},
            {field: 'name', title: '姓名', minWidth:100, align:"center"},
            {field: 'shift', title: '班级', minWidth:100, align:"center",
                templet: function(d){
                    return d.shift.major.name+d.shift.no
                }
            },
            {field: 'sex', title: '用户性别', align:'center',
                templet: function(d){
                    if(d.sex == '1'){
                    return '男'
                    } else { return '女'}
                }
            },
            {field: 'email', title: '邮箱', align:'center',templet:function(d){
                if(d.email!=null&&d.email!=""){
                    return '<a class="layui-blue" href="mailto:'+d.email+'">'+d.email+'</a>';
                }else{
                    return "无";
                }
            }},
            {field: 'tel', title: '手机号', align:'center',templet:function(d){
                if(d.tel!=null&&d.tel!=""){
                    return d.tel;
                }else{
                    return "无";
                }
            }},
            {title: '操作', minWidth:200, templet:'#userListBar',fixed:"right",align:"center"}
        ]],
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("userListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    id: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            table.reload("userListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    id:0
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
                // var body = layui.layer.getChildFrame('body', index);
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
            content : "modifyStudentInfo.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    $.ajax({
                        type:"GET",
                        async: false,
                       url:"http://localhost:8080/ScoreManagement_war_exploded/student/selectStudentOne.action",
                        data:{
                            "id":edit.id
                        },
                        dataType:"JSON",
                        success:function(data) {
                            console.log(JSON.stringify(data))
                            body.find(".id").val(data.id);  
                            body.find(".name").val(data.name);
                            body.find(".class").val(data.shift.major.name+data.shift.no);
                            body.find(".sex input[name='sex'][value='"+data.sex+"']").prop("checked","checked");  //性别
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
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
                 $.get("http://localhost:8080/ScoreManagement_war_exploded/student/deleteStudent.action", {
                    // newsId : data.newsId  //将需要删除的newsId作为参数传入
                    id : data.id
                 },function(data){
                    tableIns.reload();
                    layer.msg("删除成功",{time:1000});
                    layer.close(index);
                })
            });
        } else if (layEvent === 'reset') { //重置
            layer.confirm('密码重置后为123456!', {
                icon: 3,
                title: '提示信息'
            }, function (index) {
                $.get("http://localhost:8080/ScoreManagement_war_exploded/student/resetPassword.action?password", {
                    
                    id: data.id
                }, function (data) {
                    tableIns.reload();
                    layer.msg("重置成功",{time:1000});
                    layer.close(index);
                })
            });
        }
    });

})
