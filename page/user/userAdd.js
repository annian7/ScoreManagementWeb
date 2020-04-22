
layui.use(['form', 'laydate','layer'], function () {

    var form = layui.form,
      laydate = layui.laydate,
    layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
         //添加验证规则
         form.verify({
             userBirthday: function (value) {
                 if (!/^(\d{4})[\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|1[0-2])([\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/.test(value)) {
                     return "出生日期格式不正确！";
                 }
             },
             newpassword: function (value, item) {
                 if (value.length < 6) {
                     return "密码长度不能小于6位";
                 }
             },
             phone:function (value,item) {
                 var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                 if (!reg.test(value)) {
                  
                     return "手机格式不对";
                 }
             },
             username:function (value,item) {
                 var name = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
                 if (!name.test(value)) {

                     return "姓名只支持中文两个汉字以上";
                 }
             }
         })
//选择出生日期
laydate.render({
    elem: '#birthday',
    format: 'yyyy-MM-dd',
    trigger: 'click',
    max: 0
});
    form.on("submit(addUser)", function (data) {
        // var radio = $('input:radio[name="sex"]:checked').val() 获取性别
        var studentId = $("#studentId").val()
        var studentName = $("#studentName").val()
        var studentPassword = $("#studentPassword").val()
        var birthday = $("#birthday").val()
        var tel = $("#tel").val()
        var email = $("#email").val()
        var radio = data.field.sex//获取性别
        var userGrade = data.field.userGrade //获取classid newOption.value
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        axios.get(  'http://localhost:8080/ScoreManagement_war_exploded/admin/addStudent.action', {
            params: {
                id: studentId,
                password: studentPassword,
                name: studentName,
                sex: radio,
                birthday: birthday,
                tel: tel,
                email: email,
                classId: userGrade
            },
             async :false,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        setTimeout(function () {
            top.layer.close(index);
            top.layer.msg("用户添加成功！");
            //刷新父页面
            parent.location.reload();
            layer.closeAll("iframe");
            
        }, 2000);
        return false;

    })


    //格式化时间
    function filterTime(val) {
        if (val < 10) {
            return "0" + val;
        } else {
            return val;
        }
    }
    //定时发布
    var time = new Date();
    var submitTime = time.getFullYear() + '-' + filterTime(time.getMonth() + 1) + '-' + filterTime(time.getDate()) + ' ' + filterTime(time.getHours()) + ':' + filterTime(time.getMinutes()) + ':' + filterTime(time.getSeconds());

})




//查询所有班级
  $.ajax({
        type: "GET",
        url: "http://localhost:8080/ScoreManagement_war_exploded/class/queryAll.action",
        dataType: "JSON",
        async :false,
        success: function (data,item) {
           // alert(JSON.stringify(data))
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





