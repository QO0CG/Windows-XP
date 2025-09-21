import { getItemByPath } from "./system.js";
import { openItem } from "./openItem.js";

export function initFlashPlayer(win, showNotification, swfPath = null) {
  const contentArea = win.querySelector('.window-content');
  contentArea.innerHTML = "";
  contentArea.style.backgroundColor = '#f0f0f0';
  contentArea.style.display = 'flex';
  contentArea.style.flexDirection = 'column';
  contentArea.style.overflow = 'hidden';

  const ruffleContainer = document.createElement('div');
  ruffleContainer.id = 'ruffle-container';
  ruffleContainer.style.flexGrow = '1';
  ruffleContainer.style.display = 'flex';
  ruffleContainer.style.justifyContent = 'center';
  ruffleContainer.style.alignItems = 'center';
  contentArea.appendChild(ruffleContainer);

  // This is necessary for Ruffle to work.
  window.RufflePlayer = window.RufflePlayer || {};
  window.RufflePlayer.config = {
    "publicPath": "https://unpkg.com/@ruffle-rs/ruffle",
  };

  function playSwf(path) {
    ruffleContainer.innerHTML = '';
    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();
    ruffleContainer.appendChild(player);
    player.style.width = '100%';
    player.style.height = '100%';
    player.load(path);
  }

  if (swfPath) {
    const item = getItemByPath(swfPath);
    if (item && item.content) {
      playSwf(item.content);
    } else {
      ruffleContainer.innerHTML = `<p>Error: Could not load SWF file at ${swfPath}</p>`;
    }
  } else {
    // Show list of games
    ruffleContainer.style.flexDirection = 'column';
    ruffleContainer.style.overflowY = 'auto';
    ruffleContainer.style.padding = '10px';
    ruffleContainer.style.alignItems = 'flex-start';

    const title = document.createElement('h3');
    title.textContent = "Select a Flash Game to Play:";
    ruffleContainer.appendChild(title);

    const gamesFolder = getItemByPath("C:/Games/Flash Games/");
    if (gamesFolder && gamesFolder.children) {
      Object.keys(gamesFolder.children).forEach(gameName => {
        const gamePath = `C:/Games/Flash Games/${gameName}`;
        const gameItem = document.createElement('div');
        gameItem.textContent = gameName.replace('.swf', '');
        gameItem.style.padding = '8px';
        gameItem.style.cursor = 'pointer';
        gameItem.style.width = '100%';
        gameItem.style.boxSizing = 'border-box';
        gameItem.style.borderRadius = '3px';

        gameItem.addEventListener('mouseenter', () => {
          gameItem.style.backgroundColor = '#d3e5fa';
        });
        gameItem.addEventListener('mouseleave', () => {
          gameItem.style.backgroundColor = 'transparent';
        });

        gameItem.addEventListener('click', () => {
          // Reset container styles before playing
          ruffleContainer.style.padding = '0';
          ruffleContainer.style.flexDirection = 'row';
          ruffleContainer.style.overflowY = 'hidden';
          ruffleContainer.style.alignItems = 'center';
          ruffleContainer.style.justifyContent = 'center';

          playSwf(gamesFolder.children[gameName].content);
          // Update window title
          const titleBar = win.querySelector('.title-bar-text');
          if (titleBar) titleBar.textContent = `${gameName} - Flash Player`;
        });
        ruffleContainer.appendChild(gameItem);
      });
    } else {
      ruffleContainer.innerHTML = `<p>Could not find the 'Flash Games' folder.</p>`;
    }
  }
}