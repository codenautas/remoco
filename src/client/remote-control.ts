import {unexpected} from "cast-error";

window.addEventListener('load', async function(){
    var url = document.getElementById('url') as HTMLInputElement;
    var send = document.getElementById('send') as HTMLButtonElement;
    var consoleDiv = document.getElementById('result') as HTMLButtonElement;
    var token: string|null = null
    send.onclick=async ()=>{
        var params:{
            action: string;
            token: string;
            scriptUrl: string;
        } | {
            action: string;
            idCorto: string;
        }=token?{action:'sendScript', token, scriptUrl:url.value}:{action:'connectToId', idCorto:'i'+url.value};
        var resultDiv = document.createElement('div');
        resultDiv.textContent = '\n' + ('scriptUrl' in params? params.scriptUrl : 'conectando');
        consoleDiv.insertBefore(resultDiv, consoleDiv.children[0]);
        try{
            var response = await fetch('/remoco?'+new URLSearchParams(params))
            var text = await response.text();
            var resultDivLine = document.createElement('span');
            resultDiv.textContent += ': ';
            resultDiv.appendChild(resultDivLine);
            resultDivLine.textContent = text;
            if (response.status >= 400) {
                resultDivLine.style.color = 'red'
            } else {
                var result = JSON.parse(text);
                if('scriptUrl' in params){
                    var resultInterval = setInterval(async ()=>{
                        var response = await fetch('/remoco'+new URLSearchParams({action:'getResult', step:result.step}))
                        var resultAction = await response.json();
                        if(resultAction.received){
                            clearInterval(resultInterval);
                            resultDiv.textContent+=' → '+JSON.stringify(resultAction.result);
                        }
                    },2000)
                }else{
                    token = result.token;
                }
            }
        }catch(err){
            let error = unexpected(err);
            resultDiv.textContent+='. ERROR: '+error.message;
        }
    }
})
