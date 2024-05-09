import "./style.css";
import pitchClassToKey from "./utils/pitchClassToKey";

async function main() {
  let songData: (Track & { name: string }) | undefined;

  Spicetify.Player.addEventListener("onplaypause", async (e) => {
    try {
      setBPMElementText("Loading bpm...");

      const songUID = e?.data.item.uri;

      const res = await Spicetify.getAudioData(songUID);
      const trackData = res.track as Track;
      songData = { ...trackData, name: e?.data.item.metadata.title };

      const tempo = Math.round(songData.tempo);
      setBPMElementText(`${tempo} BPM`);
    } catch (error) {
      console.error(error);
      removeElement();
    }
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
        throw new Error("Kan widget niet vinden");
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
