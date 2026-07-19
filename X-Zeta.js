const XZ = window.XZ = {
    patched :false ,
    loggers:{
        wireframe:false
    },
    wireframe: {
        enabled:false,
        skipUI: true,
        count: {
            min: 6,
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
    PatchAll(){
        if(this.patched) return;
        this.patched = true;
        [window.WebGLRenderingContext,window.WebGL2RenderingContext].forEach(Context => {
    if (!Context) return;

    const proto = Context.prototype;
    if (proto.drawElements)proto.drawElements = new Proxy(proto.drawElements, XZ.wireframeHandler);
    if (proto.drawElementsInstanced)proto.drawElementsInstanced = new Proxy(proto.drawElementsInstanced, XZ.wireframeHandler);
});
performance.now = function(){
    if(XZ.speedhack.value === 1){return XZ.speedhack.originalPerformanceNow()};
    const realTime = XZ.speedhack.originalPerformanceNow();
    return XZ.speedhack.startFake + (realTime - XZ.speedhack.startReal)*XZ.speedhack.value};
    },
    Hacks:{
        WireFrame(){
            XZ.wireframe.enabled = !XZ.wireframe.enabled
            return alert("WireFrame: " + (XZ.wireframe.enabled ? "Activated" : "Deactivated"))
        },
        SetSpeed(value){
            if (typeof value !== "number" || value <= 0) return alert("Invalid speed");
            const current = XZ.speedhack.originalPerformanceNow();
            XZ.speedhack.startFake = current;
            XZ.speedhack.startReal = current;
            XZ.speedhack.value = value;
            alert("Speed Set to:-" + value)
   },
    }
}
XZ.PatchAll();
