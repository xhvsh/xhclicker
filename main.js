var xhClicker = {};

xhClicker.init = function () {
  xhClicker.AutoClickMode = false;
  xhClicker.GoldenClickMode = false;
  xhClicker.WrathClickMode = false;
  xhClicker.ReindeerClickMode = false;
  xhClicker.FortuneClickMode = false;
  xhClicker.BuildingClickMode = false;
  xhClicker.UIVisible = true;
  xhClicker.InAscension = false;

  // --- Clicker logic ---

  xhClicker.ClickCookie = function () {
    if (!xhClicker.AutoClickMode) return;
    var cookie = document.getElementById("bigCookie");
    xhClicker.dispatchClick(cookie);
  };

  xhClicker.ClickShimmers = function () {
    if (!xhClicker.GoldenClickMode && !xhClicker.WrathClickMode && !xhClicker.ReindeerClickMode) return;
    for (var i = 0; i < Game.shimmers.length; i++) {
      var shimmer = Game.shimmers[i];
      if (!shimmer || !shimmer.l) continue;
      var type = shimmer.type;
      var isWrath = type === "golden" && shimmer.wrath;
      var isGolden = type === "golden" && !shimmer.wrath;
      if (isGolden && xhClicker.GoldenClickMode) xhClicker.dispatchClick(shimmer.l);
      if (isWrath && xhClicker.WrathClickMode) xhClicker.dispatchClick(shimmer.l);
      if (type === "reindeer" && xhClicker.ReindeerClickMode) xhClicker.dispatchClick(shimmer.l);
    }
  };

  xhClicker.ClickFortune = function () {
    if (!xhClicker.FortuneClickMode) return;
    if (Game.TickerEffect && Game.TickerEffect.type === "fortune") {
      Game.tickerL.click();
    }
  };

  xhClicker.BuyBuildings = function () {
    if (!xhClicker.BuildingClickMode) return;
    for (var i = 0; i < Game.ObjectsById.length; i++) {
      var obj = Game.ObjectsById[i];
      if (obj && Game.cookies >= obj.price) {
        obj.buy(1);
      }
    }
  };

  xhClicker.dispatchClick = function (target) {
    if (!target) return;
    var e = document.createEvent("HTMLEvents");
    e.initEvent("click", true, true);
    target.dispatchEvent(e);
  };

  // --- UI ---

  xhClicker.toggleUI = function () {
    xhClicker.UIVisible = !xhClicker.UIVisible;
    xhClicker.ButtonContainer.style.opacity = xhClicker.UIVisible ? "1" : "0";
    xhClicker.ButtonContainer.style.pointerEvents = xhClicker.UIVisible ? "all" : "none";
  };

  xhClicker.setButtonState = function (btn, active) {
    var pip = btn.querySelector(".ac-pip");
    var label = btn.querySelector(".ac-status");
    if (!pip || !label) return;
    if (active) {
      btn.classList.add("ac-active");
      pip.style.background = "#7fff6a";
      pip.style.boxShadow = "0 0 6px #7fff6a";
      label.textContent = "ON";
      label.style.color = "#7fff6a";
    } else {
      btn.classList.remove("ac-active");
      pip.style.background = "#555";
      pip.style.boxShadow = "none";
      label.textContent = "OFF";
      label.style.color = "#555";
    }
  };

  xhClicker.makeButton = function (labelText, callback) {
    var btn = document.createElement("div");
    btn.className = "ac-btn";

    var left = document.createElement("div");
    left.className = "ac-btn-left";

    var pip = document.createElement("span");
    pip.className = "ac-pip";

    var text = document.createElement("span");
    text.className = "ac-label";
    text.textContent = labelText;

    left.appendChild(pip);
    left.appendChild(text);

    var status = document.createElement("span");
    status.className = "ac-status";
    status.textContent = "OFF";

    btn.appendChild(left);
    btn.appendChild(status);

    xhClicker.setButtonState(btn, false);
    btn.addEventListener("click", function () {
      callback();
    });

    return btn;
  };

  xhClicker.injectStyles = function () {
    var style = document.createElement("style");
    style.id = "ac-styles";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

      #ac-panel {
        font-family: 'Share Tech Mono', monospace;
        position: fixed;
        bottom: 50px;
        z-index: 9999;
        background: rgba(10, 10, 10, 0.85);
        border: 1px solid rgba(255,255,255,0.08);
        border-top: 2px solid rgba(255,255,255,0.15);
        padding: 10px 14px 12px;
        width: 340px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03);
        border-radius: 4px;
        backdrop-filter: blur(12px);
        user-select: none;
      }

      #ac-panel .ac-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }

      #ac-panel .ac-title {
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
      }

      #ac-panel .ac-toggle {
        font-size: 9px;
        letter-spacing: 0.1em;
        color: rgba(255,255,255,0.3);
      }

      .ac-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        margin-bottom: 6px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 3px;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
        color: white;
      }

      .ac-btn:last-child { margin-bottom: 0; }

      .ac-btn:hover {
        background: rgba(255,255,255,0.07);
        border-color: rgba(255,255,255,0.12);
      }

      .ac-btn.ac-active {
        background: rgba(127, 255, 106, 0.05);
        border-color: rgba(127, 255, 106, 0.18);
      }

      .ac-btn-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .ac-pip {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #555;
        flex-shrink: 0;
        transition: background 0.2s, box-shadow 0.2s;
      }

      .ac-label {
        font-size: 11px;
        letter-spacing: 0.08em;
        color: rgba(255,255,255,0.75);
      }

      .ac-status {
        font-size: 10px;
        letter-spacing: 0.14em;
        color: #555;
        transition: color 0.2s;
      }
    `;
    document.head.appendChild(style);
  };

  xhClicker.createUI = function () {
    xhClicker.injectStyles();

    var panel = document.createElement("div");
    panel.id = "ac-panel";

    var header = document.createElement("div");
    header.className = "ac-header";
    var title = document.createElement("span");
    title.className = "ac-title";
    title.textContent = "xhClicker";
    var hint = document.createElement("span");
    hint.className = "ac-toggle";
    hint.textContent = "[X] Toggle Visibility";
    header.appendChild(title);
    header.appendChild(hint);
    panel.appendChild(header);

    xhClicker.AutoButton = xhClicker.makeButton("Auto Click Big Cookie", function () {
      xhClicker.AutoClickMode = !xhClicker.AutoClickMode;
      xhClicker.setButtonState(xhClicker.AutoButton, xhClicker.AutoClickMode);
    });

    xhClicker.GoldenButton = xhClicker.makeButton("Auto Golden Cookies", function () {
      xhClicker.GoldenClickMode = !xhClicker.GoldenClickMode;
      xhClicker.setButtonState(xhClicker.GoldenButton, xhClicker.GoldenClickMode);
    });

    xhClicker.WrathButton = xhClicker.makeButton("Auto Wrath Cookies", function () {
      xhClicker.WrathClickMode = !xhClicker.WrathClickMode;
      xhClicker.setButtonState(xhClicker.WrathButton, xhClicker.WrathClickMode);
    });

    xhClicker.ReindeerButton = xhClicker.makeButton("Auto Reindeer", function () {
      xhClicker.ReindeerClickMode = !xhClicker.ReindeerClickMode;
      xhClicker.setButtonState(xhClicker.ReindeerButton, xhClicker.ReindeerClickMode);
    });

    xhClicker.FortuneButton = xhClicker.makeButton("Auto Fortune Cookies", function () {
      xhClicker.FortuneClickMode = !xhClicker.FortuneClickMode;
      xhClicker.setButtonState(xhClicker.FortuneButton, xhClicker.FortuneClickMode);
    });

    xhClicker.BuildingButton = xhClicker.makeButton("Auto Buy Buildings", function () {
      xhClicker.BuildingClickMode = !xhClicker.BuildingClickMode;
      xhClicker.setButtonState(xhClicker.BuildingButton, xhClicker.BuildingClickMode);
    });

    panel.appendChild(xhClicker.AutoButton);
    panel.appendChild(xhClicker.GoldenButton);
    panel.appendChild(xhClicker.WrathButton);
    panel.appendChild(xhClicker.ReindeerButton);
    panel.appendChild(xhClicker.FortuneButton);
    panel.appendChild(xhClicker.BuildingButton);

    document.body.appendChild(panel);

    var sectionLeft = document.getElementById("sectionLeft");
    var rect = sectionLeft.getBoundingClientRect();
    panel.style.left = rect.left + rect.width / 2 - 170 + "px";

    xhClicker.ButtonContainer = panel;
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "x" || e.key === "X") {
      if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      xhClicker.toggleUI();
    }
  });

  window.setTimeout(function () {
    xhClicker.createUI();
    xhClicker.AutoClickInterval = window.setInterval(xhClicker.ClickCookie, 25);
    xhClicker.ShimmerClickInterval = window.setInterval(xhClicker.ClickShimmers, 25);
    xhClicker.FortuneClickInterval = window.setInterval(xhClicker.ClickFortune, 500);
    xhClicker.BuildingInterval = window.setInterval(xhClicker.BuyBuildings, 500);
  }, 200);

  Game.Notify("xhClicker loaded", "", [16, 5]);
  xhClicker.isLoaded = true;
};

xhClicker.save = function () {};
xhClicker.load = function () {};

if (!xhClicker.isLoaded) Game.registerMod("xhClicker", xhClicker);
