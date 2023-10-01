// TODO: Make sure CURRENT_MODE is PROD
export const CURRENT_MODE = "prod" // dev | prod

/** @returns {string} */
export function StringBasedEnv(obj) {
  return obj[CURRENT_MODE]
}

export const API_URL = StringBasedEnv({
  dev: "http://localhost:8080",
  prod: "https://api.ocebedwars.com"
})