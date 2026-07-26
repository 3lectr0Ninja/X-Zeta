window.SpeedHack:{
  settings:{
            value: 1,
            startReal: performance.now(),
            startFake: performance.now(),
            originalPerformanceNow: performance.now.bind(performance),
        },
  patch(){
    performance.now = function() {
            if (XZ.settings.speedhack.value === 1) {
                return XZ.settings.speedhack.originalPerformanceNow()
            };
            const realTime = XZ.settings.speedhack.originalPerformanceNow();
            return XZ.settings.speedhack.startFake + (realTime - XZ.settings.speedhack.startReal) * XZ.settings.speedhack.value
        };
  },
    features:{
            SetSpeed(value) {
                if (typeof value !== "number" || value <= 0) return alert("Invalid speed");
                const current = XZ.settings.speedhack.originalPerformanceNow();
                XZ.settings.speedhack.startFake = current;
                XZ.settings.speedhack.startReal = current;
                XZ.settings.speedhack.value = value;
                return console.log("Speed Set to:-" + value)
            },
        }
}
