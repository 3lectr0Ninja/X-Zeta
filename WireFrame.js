const WireFrame = {
    name : "wireframe",
    settings: {
        enabled: false,
        skipUI: true,
        count: {
            min: 7,
            max: Infinity
        },

        onDraw(gl, args) {
            const program = gl.getParameter(gl.CURRENT_PROGRAM);
            const [mode, count, type, offset] = args;

            if (XZ.loggers.wireframe) {
                console.log({ mode, count, type, offset, program });
            }

            if (!this.enabled) return;

            const isUI = this.skipUI &&
                program &&
                program.isUIProgram === true;

            if (!isUI &&
                count >= this.count.min &&
                count <= this.count.max) {
                args[0] = gl.LINES;
            }
        },

        handler: {
            apply(target, gl, args) {
                WireFrame.settings.onDraw.call(WireFrame.settings, gl, args);
                return Reflect.apply(target, gl, args);
            }
        }
    },

    patch() {
        [WebGLRenderingContext, WebGL2RenderingContext].forEach(Context => {
            if (!Context) return;

            const proto = Context.prototype;

            if (proto.drawElements)
                proto.drawElements = new Proxy(
                    proto.drawElements,
                    WireFrame.settings.handler
                );

            if (proto.drawElementsInstanced)
                proto.drawElementsInstanced = new Proxy(
                    proto.drawElementsInstanced,
                    WireFrame.settings.handler
                );
        });
    },

    features: {
        WireFrame() {
            WireFrame.settings.enabled =
                !WireFrame.settings.enabled;

            console.log(
                "WireFrame: " +
                (WireFrame.settings.enabled ? "Activated" : "Deactivated")
            );
        },

        SetWireFrameCount(min = 7, max = Infinity) {
            WireFrame.settings.count = { min, max };
        }
    }
};
