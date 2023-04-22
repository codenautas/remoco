import {ActionParams, ActionResult, ClientInfo} from "../common/types";

import {launch, Server4Test, ServiceDef, Request, Response, NextFunction} from "server4test";

import {unexpected} from "cast-error"
import * as MiniTools from "mini-tools"

class RemocoMiddleware{
    losTokens:{[k in string]:ClientInfo}={}
    losIds:{[k in string]:ClientInfo}={}
    getMiddleware(){
        return (req:Request, res:Response, next?:NextFunction)=>this.middleware(req, res, next);
    }
    async middleware(req:Request, res:Response, next?:NextFunction){
        try {
            var actionName:string = `${req.query.action}Action`;
            // @ts-ignore
            var actionFunction:(params:ActionParams)=>Promise<ActionResult> = this[actionName]
            // @ts-ignore
            var params:ActionParams = req.query;
            if(typeof actionFunction === "function" ){
                var result = await actionFunction.call(this, params);
                res.json(result);
            }
        } catch (err) {
            var error = unexpected(err);
            MiniTools.serveErr(req, res, next!)(error);
        }
    }
    async getTokenAction(_params:ActionParams):Promise<Partial<ActionResult>>{
        do{
            var token='tok'+Math.random().toString().substr(2);
        }while(this.losTokens[token]);
        do{
            var idCorto='i'+Math.random().toString().substr(2,4);
        }while(this.losIds[idCorto]);
        var info:ClientInfo = {token, idCorto, scripts:[], step:0}
        this.losTokens[token]=info;
        this.losIds[idCorto]=info;
        return {token, idCorto};
    }
    async connectToIdAction(params:ActionParams):Promise<Partial<ActionResult>>{
        var info = this.losIds[params.idCorto];
        if(info == null){
            throw new Error('invalid token')
        }
        return {token:info.token};
    }
    async sendScriptAction(params:ActionParams):Promise<Partial<ActionResult>>{
        var info = this.losTokens[params.token];
        if(info == null){
            throw new Error('invalid token')
        }
        info.scripts.push({url: params.scriptUrl, result:undefined});
        return {step:info.scripts.length-1}
    }
    async getScriptsAction(params:ActionParams):Promise<Partial<ActionResult>>{
        var info = this.losTokens[params.token];
        if(info == null){
            throw new Error('invalid token')
        }
        info.step = params.step;
        return {scripts:info.scripts.slice(params.step).map(({result, ...rest})=>({...rest}))}
    }
    async sendResultAction(params:ActionParams):Promise<Partial<ActionResult>>{
        var info = this.losTokens[params.token];
        if(info == null){
            throw new Error('invalid token')
        }
        var scriptInfo = info.scripts[info.step];
        if(scriptInfo == null){
            throw new Error('invalid step')
        }
        scriptInfo.result = params.resultJson!=null ? JSON.parse(params.resultJson) : null;
        return {}
    }
    async getResultAction(params:ActionParams):Promise<Partial<ActionResult>>{
        var info = this.losTokens[params.token];
        if(info == null){
            throw new Error('invalid token')
        }
        var scriptInfo = info.scripts[params.step];
        if(scriptInfo == null){
            throw new Error('invalid step')
        }
        return {result: scriptInfo.result, received: scriptInfo.result != undefined}
    }
}

class RemocoServer extends Server4Test{
    remocoMiddleware = new RemocoMiddleware();
    directServices():Array<ServiceDef>{
        return [
            ...super.directServices(),
            {path:'/remoco', method:'get', middleware:this.remocoMiddleware.getMiddleware()}
        ]
    }
}

launch({serverClass:RemocoServer, server4test:{"server4test-directory":true}});