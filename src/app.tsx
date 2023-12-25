import extractIdFromSpotifyURI from "./utils/extractID";

import "./style.css";

type AudioFeatures = {
  tempo: number;
};

async function main() {
  Spicetify.Player.addEventListener("songchange", (e) => {
    try {
      setBPMElementText("Loading bpm...");
      const songUID = e?.data.track?.uri;
      const songID = songUID ? extractIdFromSpotifyURI(songUID) : undefined;
      if (!songID) {
        throw new Error("Kon nummer niet vinden");
      }
      Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/audio-features/${songID}`).then((res: AudioFeatures) => {
        const tempo = Math.round(res.tempo);
        setBPMElementText(`${tempo} BPM`);
      });
    } catch (error) {
      console.log("test");
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
    const nowPlaylingWidget = document.querySelector(".main-trackInfo-container");
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
