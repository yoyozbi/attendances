import { readFileSync } from "fs";

function read(secretName: string): string | boolean {
  try {
    return readFileSync(`/run/secrets/${secretName}`, 'utf8');
  } catch (err) {
    let error = err as { code: string }
    if (error.code !== 'ENOENT') {
      //console.error(`An error occurred while trying to read the secret: ${secretName}. Err: ${err}`);
      return false;
    } else {
      console.log(`Could not find the secret, probably not running in swarm mode: ${secretName}. Err: ${err}`);
      return false;
    }
  }
}

export function setSecrets() {
  let secretsList = ["SESSION_SECRET"];
  for (let sec of secretsList) {
    let res = read(sec);
    if (typeof res === "string") {
      process.env[sec] = res;
    }
  }
}
