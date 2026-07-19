const XZ = window.XZ = {
    patched :false ,
    info : {
        developer:"3lectr0N!nj@",
        name: "X-Zeta",
        version: "1.0"
    },
    loggers:{
        wireframe:false
    },
    wireframe: {
        enabled:false,
        skipUI: true,
        count: {
            min: 7,
            max: Infinity
        }
    },
    speedhack :{
        value: 1,
        startReal: performance.now(),
        startFake: performance.now(),
        originalPerformanceNow: performance.now.bind(performance),
    },
    memory:null,
    Addresses:{},
    wireframeHandler:{
    apply(target, gl, args) {
        XZ.onDraw(gl, args);
        return Reflect.apply(target, gl, args);
    }
    },
    onDraw(gl, args) {
        const program = gl.getParameter(gl.CURRENT_PROGRAM);
        const [mode, count, type, offset] = args;
        if(XZ.loggers.wireframe)console.log({mode,count,type,offset,program});
        if (!this.wireframe.enabled) return;
        const isUI = this.wireframe.skipUI && program && program.isUIProgram === true;
        if (!isUI && count >= this.wireframe.count.min && count <= this.wireframe.count.max) {args[0] = gl.LINES;}
    },
    SetWireFrameCount(min=7,max=Infinity){
            if (typeof max !== "number" || max <= 0 || typeof min !== "number" || min <= 0) return alert("Invalid count")
            XZ.wireframe.count={max,min}
        },
    PatchAll(){
        if(this.patched) return;
        this.patched = true;
        //WIREFRAME PATCH
        [window.WebGLRenderingContext,window.WebGL2RenderingContext].forEach(Context => {
    if (!Context) return;

    const proto = Context.prototype;
    if (proto.drawElements)proto.drawElements = new Proxy(proto.drawElements, XZ.wireframeHandler);
    if (proto.drawElementsInstanced)proto.drawElementsInstanced = new Proxy(proto.drawElementsInstanced, XZ.wireframeHandler);
});
        //SPEED-HACk PATCH
        performance.now = function(){
    if(XZ.speedhack.value === 1){return XZ.speedhack.originalPerformanceNow()};
    const realTime = XZ.speedhack.originalPerformanceNow();
    return XZ.speedhack.startFake + (realTime - XZ.speedhack.startReal)*XZ.speedhack.value};
    },
    Features:{
        //WIREFRAME
        WireFrame(){
            XZ.wireframe.enabled = !XZ.wireframe.enabled
            return console.log("WireFrame: " + (XZ.wireframe.enabled ? "Activated" : "Deactivated"))
        },
        //SPEEDHACK
        SetSpeed(value){
            if (typeof value !== "number" || value <= 0) return alert("Invalid speed");
            const current = XZ.speedhack.originalPerformanceNow();
            XZ.speedhack.startFake = current;
            XZ.speedhack.startReal = current;
            XZ.speedhack.value = value;
            return console.log("Speed Set to:-" + value)
   },
    }
}
XZ.PatchAll();
