const XZ = window.XZ = {
    info : {
        Developer:"3lectr0N!nj@",
        Name: "X-Zeta",
        Version: "1.0",
        ExistingFeatures:["WireFrame","Speed-Hack"]
    },
    patched :false,
    loggers:{
        wireframe:false
    },
    settings:{
        wireframe: {
            enabled:false,
            skipUI: true,
            count: {
            min: 7,
            max: Infinity
        },
            onDraw(gl, args){
        const program = gl.getParameter(gl.CURRENT_PROGRAM);
        const [mode, count, type, offset] = args;
        if(XZ.loggers.wireframe)console.log({mode,count,type,offset,program});
        if (!this.enabled) return;
        const isUI = this.skipUI && program && program.isUIProgram === true;
        if (!isUI && count >= this.count.min && count <= this.count.max) {args[0] = gl.LINES;}
    },
            wireframeHandler:{
            apply(target, gl, args) {
        XZ.settings.wireframe.onDraw(gl, args);
        return Reflect.apply(target, gl, args);
    }
        },
    },
        speedhack :{
        value: 1,
        startReal: performance.now(),
        startFake: performance.now(),
        originalPerformanceNow: performance.now.bind(performance),
    },
    },
    memory:[],
    scanned:0,
    Scans:{},
    PatchAll(){
        if(this.patched) return;
        this.patched = true;
        //WIREFRAME PATCH
        [window.WebGLRenderingContext,window.WebGL2RenderingContext].forEach(Context => {
    if (!Context) return;

    const proto = Context.prototype;
    if (proto.drawElements)proto.drawElements = new Proxy(proto.drawElements, XZ.settings.wireframe.wireframeHandler);
    if (proto.drawElementsInstanced)proto.drawElementsInstanced = new Proxy(proto.drawElementsInstanced, XZ.settings.wireframe.wireframeHandler);
});
        //SPEED-HACk PATCH
        performance.now = function(){
    if(XZ.settings.speedhack.value === 1){return XZ.settings.speedhack.originalPerformanceNow()};
    const realTime = XZ.settings.speedhack.originalPerformanceNow();
    return XZ.settings.speedhack.startFake + (realTime - XZ.settings.speedhack.startReal)*XZ.settings.speedhack.value};
    },
    Features:{
        //WIREFRAME
        SetWireFrameCount(min=7,max=Infinity){
            if (typeof max !== "number" || max <= 0 || typeof min !== "number" || min <= 0) return alert("Invalid count")
            XZ.settings.wireframe.count={max,min}
        },
        WireFrame(){
            XZ.settings.wireframe.enabled = !XZ.settings.wireframe.enabled
            return console.log("WireFrame: " + (XZ.settings.wireframe.enabled ? "Activated" : "Deactivated"))
        },
        //SPEEDHACK
        SetSpeed(value){
            if (typeof value !== "number" || value <= 0) return alert("Invalid speed");
            const current = XZ.settings.speedhack.originalPerformanceNow();
            XZ.settings.speedhack.startFake = current;
            XZ.settings.speedhack.startReal = current;
            XZ.settings.speedhack.value = value;
            return console.log("Speed Set to:-" + value)
   },
    }
}
XZ.PatchAll();
