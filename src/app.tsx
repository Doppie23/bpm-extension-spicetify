import extractIdFromSpotifyURI from "./utils/extractID";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { clientId, clientSecret } from "../env";

import "./style.css";

async function main() {
  Spicetify.Player.addEventListener("songchange", async (e) => {
    try {
      setBPMElementText("Loading bpm...");

      const songUID = e?.data.item.uri;
      const songID = songUID ? extractIdFromSpotifyURI(songUID) : undefined;
      if (!songID) {
        throw new Error("Kon nummer niet vinden");
      }

      const sdk = SpotifyApi.withClientCredentials(clientId, clientSecret);

      const res = await sdk.tracks.audioFeatures(songID);
      const tempo = Math.round(res.tempo);
      setBPMElementText(`${tempo} BPM`);
    } catch (error) {
      console.error(error);
      removeElement();
    }
  });
}

function setBPMElementText(text: string) {
  const bpmElement = document.querySelector(".BPM-text");
  if (bpmElement) {
    bpmElement.innerHTML = text;
  } else {
    // Element toevoegen want bestaat nog niet
    const nowPlaylingWidget = document.querySelector(
      ".main-trackInfo-container"
    );
    if (nowPlaylingWidget == null) {
      throw new Error("Kan widget niet vinden");
    }
    nowPlaylingWidget.appendChild(createBpmElement());
  }

  function createBpmElement() {
    const bpmElement = document.createElement("div");
    bpmElement.classList.add("BPM-text");
    bpmElement.innerText = text;
    return bpmElement;
  }
}

function removeElement() {
  const bpmElement = document.querySelector(".BPM-text");
  if (bpmElement) {
    bpmElement.remove();
  }
}

export default main;
