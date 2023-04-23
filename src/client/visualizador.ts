import {ActionResult} from "../common/types"

window.addEventListener('load', async function(){
    var idCorto = document.getElementById('idCorto') as HTMLDivElement;
    var tokenDiv = document.getElementById('token') as HTMLDivElement;
    var main_layout = document.getElementById('main_layout') as HTMLDivElement;
    if(typeof fetch == "undefined"){
        main_layout.textContent="typeof fetch is undefined";
    }
    var response = await fetch('../../remoco?'+new URLSearchParams({action:'getToken'}));
    var result:ActionResult = await response.json();
    idCorto.textContent = result.idCorto;
    var token: string = result.token;
    var step: number = 0;
    tokenDiv.textContent = result.token;
    // @ts-ignore
    controlar_compatibilidad(false, 'resultado-incompatibilidad');
    setInterval(async ()=>{
        var response = await fetch('../../remoco?'+new URLSearchParams({action:'getScripts', token, step:step.toString()}));
        if (response.status == 406) {
            main_layout.textContent = "ERROR 406. Must refresh. ";
            main_layout.textContent += await response.text();
            return;
        }
        var resultAction:ActionResult = await response.json();
        resultAction.scripts.forEach(s=>{
            var script = document.createElement('script')
            script.src = s.url;
            document.body.appendChild(script);
            step++;
        })
    },2000)
})
