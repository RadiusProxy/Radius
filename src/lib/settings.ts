interface Settings {
  backgroundUrl: string;
}

const defaults: Settings = {
  backgroundUrl: ""
}

export function setSetting(k: string, v: string) {
  const settings = JSON.parse(localStorage.getItem("settings") ?? JSON.stringify(defaults))
  settings[k] = v
  localStorage.setItem("settings", JSON.stringify(settings))
}

export function getSetting(k: string) {
  const settings = JSON.parse(localStorage.getItem("settings") ?? JSON.stringify(defaults))
  return settings[k] ?? ""
}

export function getAllSettings() {
  const settings = JSON.parse(localStorage.getItem("settings") ?? JSON.stringify(defaults))
  return settings
}