var form, $,areaData;
layui.config({
    base : "../../js/"
}).extend({
    "address" : "address"
})
var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
// alert(JSON.stringify(accountInfo))
var test1 = accountInfo.shift;
var vue = new Vue({
	el:"#userInfo",
	data:{
        account:accountInfo
	}
});
layui.use(['form','layer','upload','laydate',"address"],function(){
    form = layui.form;
    $ = layui.jquery;
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        upload = layui.upload,
        laydate = layui.laydate,
        address = layui.address;

    //添加验证规则
    form.verify({
        userBirthday : function(value){
            if(!/^(\d{4})[\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|1[0-2])([\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/.test(value)){
                return "出生日期格式不正确！";
            }
        }
    })
    //选择出生日期
    laydate.render({
        elem: '.birthday',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        max : 0
    });

    //获取省信息
    address.provinces();
    
    //提交个人资料
    form.on("submit(changeUser)",function(data){
        var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
        var hidden = $(".hidden").val();
        var identity = sessionStorage.getItem("identity");
        var url="";
        if(hidden>=1){
            if(hidden==2){
                url = "teacher";
            }else{
                url = "student";
            }
            $.ajax({
                type:"POST",
                url:"http://localhost:8080/ScoreManagement_war_exploded/"+url+"/update.action",
                data:{
                    'id' : $(".id").val(),
                    'name' : $(".name").val(),
                    'sex' : data.field.sex,
                    'tel' : $(".tel").val(),
                    'birthday' : $(".birthday").val(),
                    'email' : $(".email").val()
                },
                dataType:"JSON",
                success:function(data) {
                    if(data!=null){
                        layer.close(index);
                        layer.msg("修改成功！");
                        setTimeout(function () {
                            top.layer.close(index);
                            //刷新父页面
                            parent.location.reload();
                            layer.closeAll("iframe");
                            
                        }, 200);
                    }else{
                        layer.close(index);
                        layer.msg("修改失败！");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrow) {
                    layer.close(index);
                    layer.msg("系统繁忙，请稍后再试",{time:1000});
                    debugger;
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
        }else{
            if(identity==1){
                url = "student";
            }else if(identity==2){
                url = "teacher";
            }else{
                url = "admin";
            }
            $.ajax({
                type:"POST",
                url:"http://localhost:8080/ScoreManagement_war_exploded/"+url+"/update.action",
                data:{
                    'id' : $(".id").val(),
                    'name' : $(".name").val(),
                    'sex' : data.field.sex,
                    'tel' : $(".tel").val(),
                    'birthday' : $(".birthday").val(),
                    'email' : $(".email").val()
                },
                dataType:"JSON",
                success:function(data) {
                    if(data!=null){
                        layer.close(index);
                        layer.msg("修改成功！");
                        sessionStorage.setItem("accountInfo",JSON.stringify(data));
                        
                    }else{
                        layer.close(index);
                        layer.msg("修改失败！");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrow) {
                    layer.close(index);
                    layer.msg("系统繁忙，请稍后再试",{time:1000});
                    debugger;
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
        }
        
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })

    //修改密码
    form.on("submit(changePwd)",function(data){
        var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
            layer.msg("密码修改成功！");
            $(".pwd").val('');
        },2000);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })
})