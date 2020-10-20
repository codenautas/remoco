
export type Result = any

export type ScriptInfo={
    url: string
}

export type ScriptInfoWithResult=ScriptInfo & {
    result: Result
}

export type ClientInfo={
    token: string
    idCorto: string
    scripts: ScriptInfoWithResult[]
    step: number
}

export type ActionParams = {
    idCorto: string
    token: string
    step: number
    scriptUrl: string
    resultJson: string
}

export type ActionResult = {
    token: string
    idCorto: string
    step: number
    scripts: ScriptInfo[]
    result: any
    received: boolean
}
