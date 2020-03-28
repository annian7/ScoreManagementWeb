//产生验证码  
            window.onload = function() {
                createCode();
                var timeDiv = document.getElementById("time");
                window.setInterval(function(){
                    timeDiv.innerHTML = new Date().toLocaleString();
                }, 1000);
            };
            var code; //在全局定义验证码  
            function createCode() {
                code = "";
                var codeLength = 4; //验证码的长度  
                var checkCode = document.getElementById("code");
                var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数  
                for(var i = 0; i < codeLength; i++) { //循环操作  
                    var index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）  
                    code += random[index]; //根据索引取得随机数加到code上  
                }
                checkCode.value = code; //把code值赋给验证码  
            }
            
