"use server";

import { Freebox, FreeboxRegister } from "freebox";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

let fbx: Freebox;

export async function connectFreebox() {
  const file = join(__dirname, "../../../freebox.json");
  console.log(file);
  let preferences: any;

  if (!existsSync(file)) {
    console.log("doesnt exists");
    const freeboxRegister = new FreeboxRegister({
      app_id: "fbx.delta",
      app_name: "YggDownloaderApp",
      app_version: "1.0.0",
      device_name: "YggServer",
    });

    preferences = await freeboxRegister.register();
    console.log("writing ", preferences);
    await writeFile(file, JSON.stringify(preferences));
  } else {
    console.log("exists");
    preferences = JSON.parse((await readFile(file)).toString());
    console.log("preferences");
  }

  fbx = new Freebox({
    ...preferences,
  });

  //await fbx.login();
  /*
  console.log("connected");

  const response = await fbx.request({
    method: "GET",
    url: "wifi/config",
  });

  console.log(await response.status);

  const form = new FormData();
  form.append("download_url", "https://veagle.fr/downloads/weathget_update_latest.zip");
  const resa = await fbx.request({
    method: "POST",
    url: "/downloads/add",
    params: form,
    headers: { "Content-Type": "multipart/form-data" },

  })
  console.log(await resa.status);

*/
}

export { fbx };
