﻿/*
 * jQuery UI Mouse 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function (a, c) { var b = false; a(document).mouseup(function () { b = false }); a.widget("ui.mouse", { version: "1.10.4", options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 }, _mouseInit: function () { var d = this; this.element.bind("mousedown." + this.widgetName, function (e) { return d._mouseDown(e) }).bind("click." + this.widgetName, function (e) { if (true === a.data(e.target, d.widgetName + ".preventClickEvent")) { a.removeData(e.target, d.widgetName + ".preventClickEvent"); e.stopImmediatePropagation(); return false } }); this.started = false }, _mouseDestroy: function () { this.element.unbind("." + this.widgetName); if (this._mouseMoveDelegate) { a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate) } }, _mouseDown: function (f) { if (b) { return } (this._mouseStarted && this._mouseUp(f)); this._mouseDownEvent = f; var g = this, d = (f.which === 1), e = (typeof this.options.cancel === "string" && f.target.nodeName ? a(f.target).closest(this.options.cancel).length : false); if (!d || e || !this._mouseCapture(f)) { return true } this.mouseDelayMet = !this.options.delay; if (!this.mouseDelayMet) { this._mouseDelayTimer = setTimeout(function () { g.mouseDelayMet = true }, this.options.delay) } if (this._mouseDistanceMet(f) && this._mouseDelayMet(f)) { this._mouseStarted = (this._mouseStart(f) !== false); if (!this._mouseStarted) { f.preventDefault(); return true } } if (true === a.data(f.target, this.widgetName + ".preventClickEvent")) { a.removeData(f.target, this.widgetName + ".preventClickEvent") } this._mouseMoveDelegate = function (h) { return g._mouseMove(h) }; this._mouseUpDelegate = function (h) { return g._mouseUp(h) }; a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate); f.preventDefault(); b = true; return true }, _mouseMove: function (d) { if (a.ui.ie && (!document.documentMode || document.documentMode < 9) && !d.button) { return this._mouseUp(d) } if (this._mouseStarted) { this._mouseDrag(d); return d.preventDefault() } if (this._mouseDistanceMet(d) && this._mouseDelayMet(d)) { this._mouseStarted = (this._mouseStart(this._mouseDownEvent, d) !== false); (this._mouseStarted ? this._mouseDrag(d) : this._mouseUp(d)) } return !this._mouseStarted }, _mouseUp: function (d) { a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate); if (this._mouseStarted) { this._mouseStarted = false; if (d.target === this._mouseDownEvent.target) { a.data(d.target, this.widgetName + ".preventClickEvent", true) } this._mouseStop(d) } return false }, _mouseDistanceMet: function (d) { return (Math.max(Math.abs(this._mouseDownEvent.pageX - d.pageX), Math.abs(this._mouseDownEvent.pageY - d.pageY)) >= this.options.distance) }, _mouseDelayMet: function () { return this.mouseDelayMet }, _mouseStart: function () { }, _mouseDrag: function () { }, _mouseStop: function () { }, _mouseCapture: function () { return true } }) })(jQuery);