const jsonData = {
    "users": [
      {
        "username": "Blue_Bed",
        "rank": "OWNER",
        "color": "RED"
      },
      {
        "username": "hqx",
        "rank": "MEDIA",
        "color": "PURPLE"
      },
      {
        "username": "ehill451",
        "rank": "MODERATOR",
        "color": "GREEN"
      },
      {
        "username": "Astqroid",
        "rank": "OWNER",
        "color": "RED"
      },
      {
        "username": "Frogbyte",
        "rank": "MEDIA",
        "color": "PURPLE"
      },
      {
        "username": "CLB0",
        "rank": "MEDIA",
        "color": "PURPLE"
      },
      {
        "username": "ReallyDifficult",
        "rank": "JR HELPER",
        "color": "LIGHTBLUE"
      },
      {
        "username": "quadflame",
        "rank": "MEDIA",
        "color": "PURPLE"
      }
    ]
  };

  // Function to find the rank and color by player name
  function findRankAndColorByPlayerName(playerName) {
    const user = jsonData.users.find(user => user.username.toLowerCase() === playerName.toLowerCase());
    if (user) {
      return {
        rank: user.rank,
        color: user.color
      };
    } else {
      return {
        rank: 'MEMBER',
        color: 'BLACK' // Default color if no match is found
      };
    }
  }

  // Function to set player's skin
  function setPlayerSkin(playerName) {
    const playerSkin = document.getElementById('getPlayerSkin');
    playerSkin.src = `https://visage.surgeplay.com/full/512/${playerName}`;
    
    // Add an onerror event handler to load a fallback image
    playerSkin.onerror = function () {
      playerSkin.src = 'imgs/hqx_skin.png'; // Fallback image
    };
  }

  // Function to get parameters from the URL
  function getFromURL() {
    // Gets the Search Parameters
    const searchParams = new URLSearchParams(window.location.search);
    const playerName = searchParams.get('player');

    if (playerName == "") {
        location.href = "index.html";
    } else {
        // Sets the player's name in the title
        const playerTitle = document.getElementById('getPlayerName');
        playerTitle.innerHTML = playerName;

        // Call the function to set the player's skin
        setPlayerSkin(playerName);

        // Call the function to find and set the player's rank and color
        const { rank, color } = findRankAndColorByPlayerName(playerName);
        const playerRankElement = document.getElementById('playerRank');
        playerRankElement.innerHTML = `<span style="background-color: ${color}">${rank}</span>`;
    }
}

// Call getFromURL on window load
window.onload = getFromURL;