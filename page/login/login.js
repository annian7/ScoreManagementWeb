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
        $(this).text("登录中...");
        var articleFrom = data.field;
        // alert(JSON.stringify(articleFrom))
        $.ajax({
            type:"GET",
            url:"http://localhost:9000/web/CustomerController/login",
            data:{
                phone:articleFrom.id,
                pCode:articleFrom.password
            },
            dataType:"JSON",
            success:function(data) {
                if(data.success=="false"){
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
                alert("error");
                debugger;
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
                $(this).text("登录");
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
