var ripple = function () { function rippleStart(t) { ("0" == (rippleContainer = getRippleContainer(t.target)).getAttribute("animating") || !rippleContainer.hasAttribute("animating")) && t.target.className.indexOf("ripple") > -1 && (rippleContainer.setAttribute("animating", "1"), offsetX = "number" == typeof t.offsetX ? t.offsetX : t.touches[0].clientX - t.target.getBoundingClientRect().left, offsetY = "number" == typeof t.offsetY ? t.offsetY : t.touches[0].clientY - t.target.getBoundingClientRect().top, fullCoverRadius = Math.max(Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)), Math.sqrt(Math.pow(t.target.clientWidth - offsetX, 2) + Math.pow(t.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetX, 2) + Math.pow(t.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetY, 2) + Math.pow(t.target.clientWidth - offsetX, 2))), expandTime = t.target.getAttribute("ripple-press-expand-time") || 3, rippleContainer.style.transition = "transform " + expandTime + "s ease-out, box-shadow 0.1s linear", rippleContainer.style.background = t.target.getAttribute("ripple-color") || "white", rippleContainer.style.opacity = t.target.getAttribute("ripple-opacity") || "0.6", rippleContainer.style.boxShadow = t.target.getAttribute("ripple-shadow") || "none", rippleContainer.style.top = offsetY + "px", rippleContainer.style.left = offsetX + "px", rippleContainer.style.transform = "translate(-50%, -50%) scale(" + fullCoverRadius / 100 + ")") } function rippleEnd(e) { "1" == (rippleContainer = getRippleContainer(e.target)).getAttribute("animating") && (rippleContainer.setAttribute("animating", "2"), background = window.getComputedStyle(rippleContainer, null).getPropertyValue("background"), destinationRadius = e.target.clientWidth + e.target.clientHeight, rippleContainer.style.transition = "none", expandTime = e.target.getAttribute("ripple-release-expand-time") || .4, rippleContainer.style.transition = "transform " + expandTime + "s linear, background " + expandTime + "s linear, opacity " + expandTime + "s ease-in-out", rippleContainer.style.transform = "translate(-50%, -50%) scale(" + destinationRadius / 100 + ")", rippleContainer.style.background = "radial-gradient(transparent 10%, " + background + " 40%)", rippleContainer.style.opacity = "0", e.target.dispatchEvent(new CustomEvent("ripple-button-click", { target: e.target })), eval(e.target.getAttribute("onrippleclick"))) } function rippleRetrieve(t) { "translate(-50%, -50%) scale(0)" == (rippleContainer = getRippleContainer(t.target)).style.transform && rippleContainer.setAttribute("animating", "0"), "1" == rippleContainer.getAttribute("animating") && (rippleContainer.setAttribute("animating", "3"), collapseTime = t.target.getAttribute("ripple-leave-collapse-time") || .4, rippleContainer.style.transition = "transform " + collapseTime + "s linear, box-shadow " + collapseTime + "s linear", rippleContainer.style.boxShadow = "none", rippleContainer.style.transform = "translate(-50%, -50%) scale(0)") } function getRippleContainer(t) { for (childs = t.childNodes, ii = 0; ii < childs.length; ii++)try { if (childs[ii].className.indexOf("rippleContainer") > -1) return childs[ii] } catch (n) { } return t } window.addEventListener("load", function () { (css = document.createElement("style")).type = "text/css", css.innerHTML = ".ripple { overflow: hidden !important; position: relative; } .ripple .rippleContainer { display: block; height: 200px !important; width: 200px !important; padding: 0px 0px 0px 0px; border-radius: 50%; position: absolute !important; top: 0px; left: 0px; transform: translate(-50%, -50%) scale(0); -webkit-transform: translate(-50%, -50%) scale(0); -ms-transform: translate(-50%, -50%) scale(0); background-color: transparent; }  .ripple * {pointer-events: none !important;}", document.head.appendChild(css), ripple.registerRipples() }); var ripple = { registerRipples: function () { for (rippleButtons = document.getElementsByClassName("ripple"), i = 0; i < rippleButtons.length; i++)rippleButtons[i].addEventListener("touchstart", function (t) { rippleStart(t) }, { passive: !0 }), rippleButtons[i].addEventListener("touchmove", function (t) { if (t.target.hasAttribute("ripple-cancel-on-move")) return void rippleRetrieve(t); try { overEl = document.elementFromPoint(t.touches[0].clientX, t.touches[0].clientY).className.indexOf("ripple") >= 0 } catch (n) { overEl = !1 } overEl || rippleRetrieve(t) }, { passive: !0 }), rippleButtons[i].addEventListener("touchend", function (t) { rippleEnd(t) }, { passive: !0 }), rippleButtons[i].addEventListener("mousedown", function (t) { rippleStart(t) }, { passive: !0 }), rippleButtons[i].addEventListener("mouseup", function (t) { rippleEnd(t) }, { passive: !0 }), rippleButtons[i].addEventListener("mousemove", function (t) { t.target.hasAttribute("ripple-cancel-on-move") && (0 != t.movementX || 0 != t.movementY) && rippleRetrieve(t) }, { passive: !0 }), rippleButtons[i].addEventListener("mouseleave", function (t) { rippleRetrieve(t) }, { passive: !0 }), rippleButtons[i].addEventListener("transitionend", function (t) { ("2" == t.target.getAttribute("animating") || "3" == t.target.getAttribute("animating")) && (t.target.style.transition = "none", t.target.style.transform = "translate(-50%, -50%) scale(0)", t.target.style.boxShadow = "none", t.target.setAttribute("animating", "0")) }, { passive: !0 }), getRippleContainer(rippleButtons[i]) == rippleButtons[i] && (rippleButtons[i].innerHTML += '<div class="rippleContainer"></div>') }, ripple: function (t) { 0 > t.className.indexOf("ripple") || (rect = t.getBoundingClientRect(), rippleStart(e = { target: t, offsetX: rect.width / 2, offsetY: rect.height / 2 }), rippleEnd(e)) } }; return ripple }();