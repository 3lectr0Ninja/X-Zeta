const XZ = window.XZ = {
    info: {
        Developer: "3lectr0N!nj@",
        Name: "X-Zeta",
        Version: "1.0",
        ExistingFeatures: ["WireFrame", "Speed-Hack"]
    },
    patched: false,
    loggers: {
        wireframe: false
    },
    patches: [],
    Pluginsurls:["https://raw.githubusercontent.com/3lectr0Ninja/X-Zeta/refs/heads/main/WireFrame.js","https://raw.githubusercontent.com/3lectr0Ninja/X-Zeta/refs/heads/main/SpeedHack.js"],
    async DownloadPlugins(){
    for (const url of this.Pluginsurls) {await this.LoadPlugin(url);XZ.PatchAll();}
    },
    async LoadPlugin(url){
        async function loadScript(url) {
            try {
      const res = await fetch(url);
      const code = await res.text();
      (0, eval)(code);
    } catch (err) {console.error("Failed to load script:", url, err);
                  }
  }
        await loadScript(url)
        let spliturl = url.split("/")
        let plugin = spliturl[spliturl.length-1].split(".")[0]
        console.log(plugin," Loaded")
        this.SetPlugin(window[plugin])
    },
    SetPlugin(plugin){
        this.settings[plugin.name] = plugin.settings;
        this.Features[plugin.name.toUpperCase()] = plugin.features;
        this.patches.push(plugin.patch);
        console.log(plugin.name," Set")
    },
    settings: {},
    scanned: 0,
    Scans: {},
    PatchAll() {
        if (this.patched) return;
        this.patches.forEach((func)=>{func()})
        this.patched = true;
    },
    Features: {}
};
