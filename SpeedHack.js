window.SpeedHack:{
  settings:{
            value: 1,
            startReal: performance.now(),
            startFake: performance.now(),
            originalPerformanceNow: performance.now.bind(performance),
        },
  patch(){
    performance.now = function() {
            if (SpeedHack.settings.value === 1) {
                return SpeedHack.settings.originalPerformanceNow()
            };
            const realTime = SpeedHack.settings.originalPerformanceNow();
            return SpeedHack.settings.startFake + (realTime - SpeedHack.settings.startReal) * SpeedHack.settings.value
        };
  },
    features:{
            SetSpeed(value) {
                if (typeof value !== "number" || value <= 0) return alert("Invalid speed");
                const current = SpeedHack.settings.originalPerformanceNow();
                SpeedHack.settings.startFake = current;
                SpeedHack.settings.startReal = current;
                SpeedHack.settings.value = value;
                return console.log("Speed Set to:-" + value)
            },
        }
}
