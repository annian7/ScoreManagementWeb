var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
var identity = sessionStorage.getItem("identity");
var vue = new Vue({
    el: "#changePsw",
    data: {
        account: accountInfo,
        identity: identity,
    }
});


// var vue = new Vue({
//     el: "#reset",
//     data: {
//         account: accountInfo,
//         identity: identity,

//     },
//     methods: {
//         greet: function () {
          
//             var usercode = $("#usercode").val();
//             var oldPwd2 = $("#oldPwd").val();
//             alert("您所重置的账号是"+usercode+"初始化密码为123456")
//           var identity = sessionStorage.getItem("identity");

//           var url = "";
//           if (identity == 1) {
//               url = "student";
//           } else if (identity == 2) {
//               url = "teacher";
//           } else {
//               url = "admin";
//           }


//             axios.get('http://localhost:8080/ScoreManagement_war_exploded/' + url + '/resetPassword.action?password', {
//                     params: {
//                         id: usercode,
//                     }
//                 })
//                 .then(function (response) {
//                    // alert(response.data.result)
//                  if(response.data){
//                       layer.msg("重置成功", {
//                           time: 1000
//                       })
//                  }
                     
                        
                 
//                     console.log(response);
//                 })
//                 .catch(function (error) {
//                     console.log(error);
//                 })
//                 .then(function () {
//                     // always executed
//                 });
            
            
//         }
//     }
// });






  