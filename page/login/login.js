layui.use(['form','layer','jquery'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    $(".loginBody .seraph").click(function(){
        layer.msg("这只是做个样式，至于功能，你见过哪个后台能这样登录的？还是老老实实的找管理员去注册吧",{
            time:5000
        });
    })

    //登录按钮
    form.on("submit(login)",function(data){
        var articleFrom = data.field;
        var identity="";
        if(articleFrom.code.toUpperCase()!=articleFrom.codeText.toUpperCase()){
            layer.msg("验证码错误，请重新输入",{time:1000});
            return false;
        }
        if(articleFrom.identity==1){
            identity = "student";
        }else if(articleFrom.identity==2){
            identity = "teacher";
        }else{
            identity = "admin";
        }

        $.ajax({
            type:"GET",
           url:"http://localhost:8080/ScoreManagement_war_exploded/"+identity+"/login.action",
            
            data:{
                "id":articleFrom.id,
                "password":articleFrom.password
            },
            dataType:"JSON",
            success:function(data) {
                sessionStorage.setItem("accountInfo",JSON.stringify(data));
                sessionStorage.setItem("identity",articleFrom.identity);
                if(data.name==""||data.name==null){
                    layer.msg("用户名或密码错误",{time:1000});
                }else if(data.success=="ok"){
                    setTimeout(function(){
                        window.location.href = "/index.html";
                    },1000);
                }else{
                    layer.msg("系统繁忙，请稍后再试",{time:1000});
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrow) {
                layer.msg("系统繁忙，请稍后再试",{time:1000});
                debugger;
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
        return false;
    })

    //表单输入效果
    $(".loginBody .input-item").click(function(e){
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    })
    $(".loginBody .layui-form-item .layui-input").focus(function(){
        $(this).parent().addClass("layui-input-focus");
    })
    $(".loginBody .layui-form-item .layui-input").blur(function(){
        $(this).parent().removeClass("layui-input-focus");
        if($(this).val() != ''){
            $(this).parent().addClass("layui-input-active");
        }else{
            $(this).parent().removeClass("layui-input-active");
        }
    })
})
