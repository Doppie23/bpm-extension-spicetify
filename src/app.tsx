import "./style.css";
import pitchClassToKey from "./utils/pitchClassToKey";

const RETRY_ATTEMPTS = 3;

async function main() {
  let songData: (Track & { name: string }) | undefined;

  Spicetify.Player.addEventListener("songchange", async (e) => {
    for (let i = 0; i < RETRY_ATTEMPTS; i++) {
      setBPMElementText("Loading bpm...");

      try {
        const res = await Spicetify.getAudioData();
        if (!res || !res.track) throw new Error("No track data");

        const trackData = res.track as Track;
        songData = { ...trackData, name: e?.data.item.metadata.title };

        const tempo = Math.round(songData.tempo);
        setBPMElementText(`${tempo} BPM`);
        return;
      } catch (error) {
        console.error(error);
        if (i + 1 < RETRY_ATTEMPTS)
          console.log(`Retrying, attempt ${i + 1}/${RETRY_ATTEMPTS}}`);
      }
    }

    Spicetify.showNotification("Error getting track data", true);
    console.log(`Failed getting track data after ${RETRY_ATTEMPTS} attempts}`);
    removeElement();
  });

  function clickHandler() {
    if (!songData) return;

    Spicetify.PopupModal.display({
      title: songData.name,
      content: `
        <p class="song_info">BPM: <span class="song_info__data">${
          songData.tempo
        }</span> <span class="song_info">(${
        songData.tempo_confidence
      })</span></p>
        ${
          songData.key != -1
            ? `<p class="song_info">Key: <span class="song_info__data">${pitchClassToKey(
                songData.key
              )}</span> <span class="song_info">(${
                songData.key_confidence
              })</span></p>`
            : ""
        }
        <p class="song_info">Loudness: <span class="song_info__data">${
          songData.loudness
        }</span></p>
        <p class="song_info">Time signature: <span class="song_info__data">${
          songData.time_signature
        }/4</span> <span class="song_info">(${
        songData.time_signature_confidence
      })</span></p>
      `,
      isLarge: true,
    });
  }

  function setBPMElementText(text: string) {
    const bpmElement = document.querySelector(".BPM-text");
    if (bpmElement) {
      bpmElement.innerHTML = text;
    } else {
      // Element toevoegen want bestaat nog niet
      const nowPlaylingWidget = document.querySelector(
        ".main-nowPlayingWidget-trackInfo"
      );
      if (nowPlaylingWidget == null) {
        throw new Error("Could not find now playing widget");
      }
      nowPlaylingWidget.appendChild(createBpmElement());
    }

    function createBpmElement() {
      const bpmElement = document.createElement("div");
      bpmElement.classList.add("BPM-text");
      bpmElement.innerText = text;
      bpmElement.addEventListener("click", clickHandler);
      return bpmElement;
    }
  }

  function removeElement() {
    const bpmElement = document.querySelector(".BPM-text");
    if (bpmElement) {
      bpmElement.remove();
    }
  }
}

export default main;
