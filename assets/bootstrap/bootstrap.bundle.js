/*!
 * Bootstrap v5.1.3 (https://getbootstrap.com/)
 * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
! function (global, factory) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self).bootstrap = factory()
}(this, (function () {
  "use strict";
  const MAX_UID = 1e6,
    MILLISECONDS_MULTIPLIER = 1e3,
    TRANSITION_END = "transitionend",
    toType = obj => null == obj ? "" + obj : {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase(),
    getUID = prefix => {
      do {
        prefix += Math.floor(1e6 * Math.random())
      } while (document.getElementById(prefix));
      return prefix
    },
    getSelector = element => {
      let selector = element.getAttribute("data-bs-target");
      if (!selector || "#" === selector) {
        let hrefAttr = element.getAttribute("href");
        if (!hrefAttr || !hrefAttr.includes("#") && !hrefAttr.startsWith(".")) return null;
        hrefAttr.includes("#") && !hrefAttr.startsWith("#") && (hrefAttr = "#" + hrefAttr.split("#")[1]), selector = hrefAttr && "#" !== hrefAttr ? hrefAttr.trim() : null
      }
      return selector
    },
    getSelectorFromElement = element => {
      const selector = getSelector(element);
      return selector && document.querySelector(selector) ? selector : null
    },
    getElementFromSelector = element => {
      const selector = getSelector(element);
      return selector ? document.querySelector(selector) : null
    },
    getTransitionDurationFromElement = element => {
      if (!element) return 0;
      let {
        transitionDuration: transitionDuration,
        transitionDelay: transitionDelay
      } = window.getComputedStyle(element);
      const floatTransitionDuration = Number.parseFloat(transitionDuration),
        floatTransitionDelay = Number.parseFloat(transitionDelay);
      return floatTransitionDuration || floatTransitionDelay ? (transitionDuration = transitionDuration.split(",")[0], transitionDelay = transitionDelay.split(",")[0], 1e3 * (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay))) : 0
    },
    triggerTransitionEnd = element => {
      element.dispatchEvent(new Event(TRANSITION_END))
    },
    isElement$1 = obj => !(!obj || "object" != typeof obj) && (void 0 !== obj.jquery && (obj = obj[0]), void 0 !== obj.nodeType),
    getElement = obj => isElement$1(obj) ? obj.jquery ? obj[0] : obj : "string" == typeof obj && obj.length > 0 ? document.querySelector(obj) : null,
    typeCheckConfig = (componentName, config, configTypes) => {
      Object.keys(configTypes).forEach(property => {
        const expectedTypes = configTypes[property],
          value = config[property],
          valueType = value && isElement$1(value) ? "element" : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`)
      })
    },
    isVisible = element => !(!isElement$1(element) || 0 === element.getClientRects().length) && "visible" === getComputedStyle(element).getPropertyValue("visibility"),
    isDisabled = element => !element || element.nodeType !== Node.ELEMENT_NODE || !!element.classList.contains("disabled") || (void 0 !== element.disabled ? element.disabled : element.hasAttribute("disabled") && "false" !== element.getAttribute("disabled")),
    findShadowRoot = element => {
      if (!document.documentElement.attachShadow) return null;
      if ("function" == typeof element.getRootNode) {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null
      }
      return element instanceof ShadowRoot ? element : element.parentNode ? findShadowRoot(element.parentNode) : null
    },
    noop = () => {},
    reflow = element => {
      element.offsetHeight
    },
    getjQuery = () => {
      const {
        jQuery: jQuery
      } = window;
      return jQuery && !document.body.hasAttribute("data-bs-no-jquery") ? jQuery : null
    },
    DOMContentLoadedCallbacks = [],
    onDOMContentLoaded = callback => {
      "loading" === document.readyState ? (DOMContentLoadedCallbacks.length || document.addEventListener("DOMContentLoaded", () => {
        DOMContentLoadedCallbacks.forEach(callback => callback())
      }), DOMContentLoadedCallbacks.push(callback)) : callback()
    },
    isRTL = () => "rtl" === document.documentElement.dir,
    defineJQueryPlugin = plugin => {
      onDOMContentLoaded(() => {
        const $ = getjQuery();
        if ($) {
          const name = plugin.NAME,
            JQUERY_NO_CONFLICT = $.fn[name];
          $.fn[name] = plugin.jQueryInterface, $.fn[name].Constructor = plugin, $.fn[name].noConflict = () => ($.fn[name] = JQUERY_NO_CONFLICT, plugin.jQueryInterface)
        }
      })
    },
    execute = callback => {
      "function" == typeof callback && callback()
    },
    executeAfterTransition = (callback, transitionElement, waitForTransition = !0) => {
      if (!waitForTransition) return void execute(callback);
      const durationPadding = 5,
        emulatedDuration = getTransitionDurationFromElement(transitionElement) + 5;
      let called = !1;
      const handler = ({
        target: target
      }) => {
        target === transitionElement && (called = !0, transitionElement.removeEventListener(TRANSITION_END, handler), execute(callback))
      };
      transitionElement.addEventListener(TRANSITION_END, handler), setTimeout(() => {
        called || triggerTransitionEnd(transitionElement)
      }, emulatedDuration)
    },
    getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
      let index = list.indexOf(activeElement);
      if (-1 === index) return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
      const listLength = list.length;
      return index += shouldGetNext ? 1 : -1, isCycleAllowed && (index = (index + listLength) % listLength), list[Math.max(0, Math.min(index, listLength - 1))]
    },
    namespaceRegex = /[^.]*(?=\..*)\.|.*/,
    stripNameRegex = /\..*/,
    stripUidRegex = /::\d+$/,
    eventRegistry = {};
  let uidEvent = 1;
  const customEvents = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    },
    customEventsRegex = /^(mouseenter|mouseleave)/i,
    nativeEvents = new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);

  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++
  }

  function getEvent(element) {
    const uid = getUidEvent(element);
    return element.uidEvent = uid, eventRegistry[uid] = eventRegistry[uid] || {}, eventRegistry[uid]
  }

  function bootstrapHandler(element, fn) {
    return function handler(event) {
      return event.delegateTarget = element, handler.oneOff && EventHandler.off(element, event.type, fn), fn.apply(element, [event])
    }
  }

  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);
      for (let {
          target: target
        } = event; target && target !== this; target = target.parentNode)
        for (let i = domElements.length; i--;)
          if (domElements[i] === target) return event.delegateTarget = target, handler.oneOff && EventHandler.off(element, event.type, selector, fn), fn.apply(target, [event]);
      return null
    }
  }

  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);
    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];
      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) return event
    }
    return null
  }

  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = "string" == typeof handler,
      originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = void 0;
    return nativeEvents.has(typeEvent) || (typeEvent = originalTypeEvent), [delegation, originalHandler, typeEvent]
  }

  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if ("string" != typeof originalTypeEvent || !element) return;
    if (handler || (handler = delegationFn, delegationFn = null), customEventsRegex.test(originalTypeEvent)) {
      const wrapFn = fn => function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) return fn.call(this, event)
      };
      delegationFn ? delegationFn = wrapFn(delegationFn) : handler = wrapFn(handler)
    }
    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn), events = getEvent(element), handlers = events[typeEvent] || (events[typeEvent] = {}), previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);
    if (previousFn) return void(previousFn.oneOff = previousFn.oneOff && oneOff);
    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, "")),
      fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null, fn.originalHandler = originalHandler, fn.oneOff = oneOff, fn.uidEvent = uid, handlers[uid] = fn, element.addEventListener(typeEvent, fn, delegation)
  }

  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    fn && (element.removeEventListener(typeEvent, fn, Boolean(delegationSelector)), delete events[typeEvent][fn.uidEvent])
  }

  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector)
      }
    })
  }

  function getTypeEvent(event) {
    return event = event.replace(stripNameRegex, ""), customEvents[event] || event
  }
  const EventHandler = {
      on(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, !1)
      },
      one(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, !0)
      },
      off(element, originalTypeEvent, handler, delegationFn) {
        if ("string" != typeof originalTypeEvent || !element) return;
        const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn), inNamespace = typeEvent !== originalTypeEvent, events = getEvent(element), isNamespace = originalTypeEvent.startsWith(".");
        if (void 0 !== originalHandler) {
          if (!events || !events[typeEvent]) return;
          return void removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null)
        }
        isNamespace && Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1))
        });
        const storeElementEvent = events[typeEvent] || {};
        Object.keys(storeElementEvent).forEach(keyHandlers => {
          const handlerKey = keyHandlers.replace(stripUidRegex, "");
          if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
            const event = storeElementEvent[keyHandlers];
            removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector)
          }
        })
      },
      trigger(element, event, args) {
        if ("string" != typeof event || !element) return null;
        const $ = getjQuery(),
          typeEvent = getTypeEvent(event),
          inNamespace = event !== typeEvent,
          isNative = nativeEvents.has(typeEvent);
        let jQueryEvent, bubbles = !0,
          nativeDispatch = !0,
          defaultPrevented = !1,
          evt = null;
        return inNamespace && $ && (jQueryEvent = $.Event(event, args), $(element).trigger(jQueryEvent), bubbles = !jQueryEvent.isPropagationStopped(), nativeDispatch = !jQueryEvent.isImmediatePropagationStopped(), defaultPrevented = jQueryEvent.isDefaultPrevented()), isNative ? (evt = document.createEvent("HTMLEvents"), evt.initEvent(typeEvent, bubbles, !0)) : evt = new CustomEvent(event, {
          bubbles: bubbles,
          cancelable: !0
        }), void 0 !== args && Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get: () => args[key]
          })
        }), defaultPrevented && evt.preventDefault(), nativeDispatch && element.dispatchEvent(evt), evt.defaultPrevented && void 0 !== jQueryEvent && jQueryEvent.preventDefault(), evt
      }
    },
    elementMap = new Map,
    Data = {
      set(element, key, instance) {
        elementMap.has(element) || elementMap.set(element, new Map);
        const instanceMap = elementMap.get(element);
        instanceMap.has(key) || 0 === instanceMap.size ? instanceMap.set(key, instance) : console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`)
      },
      get: (element, key) => elementMap.has(element) && elementMap.get(element).get(key) || null,
      remove(element, key) {
        if (!elementMap.has(element)) return;
        const instanceMap = elementMap.get(element);
        instanceMap.delete(key), 0 === instanceMap.size && elementMap.delete(element)
      }
    },
    VERSION = "5.1.3";
  class BaseComponent {
    constructor(element) {
      (element = getElement(element)) && (this._element = element, Data.set(this._element, this.constructor.DATA_KEY, this))
    }
    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY), EventHandler.off(this._element, this.constructor.EVENT_KEY), Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null
      })
    }
    _queueCallback(callback, element, isAnimated = !0) {
      executeAfterTransition(callback, element, isAnimated)
    }
    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY)
    }
    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, "object" == typeof config ? config : null)
    }
    static get VERSION() {
      return "5.1.3"
    }
    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!')
    }
    static get DATA_KEY() {
      return "bs." + this.NAME
    }
    static get EVENT_KEY() {
      return "." + this.DATA_KEY
    }
  }
  const enableDismissTrigger = (component, method = "hide") => {
      const clickEvent = "click.dismiss" + component.EVENT_KEY,
        name = component.NAME;
      EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, (function (event) {
        if (["A", "AREA"].includes(this.tagName) && event.preventDefault(), isDisabled(this)) return;
        const target = getElementFromSelector(this) || this.closest("." + name),
          instance = void 0;
        component.getOrCreateInstance(target)[method]()
      }))
    },
    NAME$d = "alert",
    DATA_KEY$c = "bs.alert",
    EVENT_KEY$c = ".bs.alert",
    EVENT_CLOSE = "close.bs.alert",
    EVENT_CLOSED = "closed.bs.alert",
    CLASS_NAME_FADE$5 = "fade",
    CLASS_NAME_SHOW$8 = "show";
  class Alert extends BaseComponent {
    static get NAME() {
      return NAME$d
    }
    close() {
      const closeEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_CLOSE).defaultPrevented) return;
      this._element.classList.remove("show");
      const isAnimated = this._element.classList.contains("fade");
      this._queueCallback(() => this._destroyElement(), this._element, isAnimated)
    }
    _destroyElement() {
      this._element.remove(), EventHandler.trigger(this._element, EVENT_CLOSED), this.dispose()
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Alert.getOrCreateInstance(this);
        if ("string" == typeof config) {
          if (void 0 === data[config] || config.startsWith("_") || "constructor" === config) throw new TypeError(`No method named "${config}"`);
          data[config](this)
        }
      }))
    }
  }
  enableDismissTrigger(Alert, "close"), defineJQueryPlugin(Alert);
  const NAME$c = "button",
    DATA_KEY$b = void 0,
    EVENT_KEY$b = void 0,
    DATA_API_KEY$7 = ".data-api",
    CLASS_NAME_ACTIVE$3 = "active",
    SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]',
    EVENT_CLICK_DATA_API$6 = "click.bs.button.data-api";
  class Button extends BaseComponent {
    static get NAME() {
      return NAME$c
    }
    toggle() {
      this._element.setAttribute("aria-pressed", this._element.classList.toggle("active"))
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Button.getOrCreateInstance(this);
        "toggle" === config && data[config]()
      }))
    }
  }

  function normalizeData(val) {
    return "true" === val || "false" !== val && (val === Number(val).toString() ? Number(val) : "" === val || "null" === val ? null : val)
  }

  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => "-" + chr.toLowerCase())
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5),
      data = void 0;
    Button.getOrCreateInstance(button).toggle()
  }), defineJQueryPlugin(Button);
  const Manipulator = {
      setDataAttribute(element, key, value) {
        element.setAttribute("data-bs-" + normalizeDataKey(key), value)
      },
      removeDataAttribute(element, key) {
        element.removeAttribute("data-bs-" + normalizeDataKey(key))
      },
      getDataAttributes(element) {
        if (!element) return {};
        const attributes = {};
        return Object.keys(element.dataset).filter(key => key.startsWith("bs")).forEach(key => {
          let pureKey = key.replace(/^bs/, "");
          pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length), attributes[pureKey] = normalizeData(element.dataset[key])
        }), attributes
      },
      getDataAttribute: (element, key) => normalizeData(element.getAttribute("data-bs-" + normalizeDataKey(key))),
      offset(element) {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top + window.pageYOffset,
          left: rect.left + window.pageXOffset
        }
      },
      position: element => ({
        top: element.offsetTop,
        left: element.offsetLeft
      })
    },
    NODE_TEXT = 3,
    SelectorEngine = {
      find: (selector, element = document.documentElement) => [].concat(...Element.prototype.querySelectorAll.call(element, selector)),
      findOne: (selector, element = document.documentElement) => Element.prototype.querySelector.call(element, selector),
      children: (element, selector) => [].concat(...element.children).filter(child => child.matches(selector)),
      parents(element, selector) {
        const parents = [];
        let ancestor = element.parentNode;
        for (; ancestor && ancestor.nodeType === Node.ELEMENT_NODE && 3 !== ancestor.nodeType;) ancestor.matches(selector) && parents.push(ancestor), ancestor = ancestor.parentNode;
        return parents
      },
      prev(element, selector) {
        let previous = element.previousElementSibling;
        for (; previous;) {
          if (previous.matches(selector)) return [previous];
          previous = previous.previousElementSibling
        }
        return []
      },
      next(element, selector) {
        let next = element.nextElementSibling;
        for (; next;) {
          if (next.matches(selector)) return [next];
          next = next.nextElementSibling
        }
        return []
      },
      focusableChildren(element) {
        const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map(selector => selector + ':not([tabindex^="-"])').join(", ");
        return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el))
      }
    },
    NAME$b = "carousel",
    DATA_KEY$a = void 0,
    EVENT_KEY$a = ".bs.carousel",
    DATA_API_KEY$6 = ".data-api",
    ARROW_LEFT_KEY = "ArrowLeft",
    ARROW_RIGHT_KEY = "ArrowRight",
    TOUCHEVENT_COMPAT_WAIT = 500,
    SWIPE_THRESHOLD = 40,
    Default$a = {
      interval: 5e3,
      keyboard: !0,
      slide: !1,
      pause: "hover",
      wrap: !0,
      touch: !0
    },
    DefaultType$a = {
      interval: "(number|boolean)",
      keyboard: "boolean",
      slide: "(boolean|string)",
      pause: "(string|boolean)",
      wrap: "boolean",
      touch: "boolean"
    },
    ORDER_NEXT = "next",
    ORDER_PREV = "prev",
    DIRECTION_LEFT = "left",
    DIRECTION_RIGHT = "right",
    KEY_TO_DIRECTION = {
      ArrowLeft: DIRECTION_RIGHT,
      ArrowRight: DIRECTION_LEFT
    },
    EVENT_SLIDE = "slide" + EVENT_KEY$a,
    EVENT_SLID = "slid" + EVENT_KEY$a,
    EVENT_KEYDOWN = "keydown" + EVENT_KEY$a,
    EVENT_MOUSEENTER = "mouseenter" + EVENT_KEY$a,
    EVENT_MOUSELEAVE = "mouseleave" + EVENT_KEY$a,
    EVENT_TOUCHSTART = "touchstart" + EVENT_KEY$a,
    EVENT_TOUCHMOVE = "touchmove" + EVENT_KEY$a,
    EVENT_TOUCHEND = "touchend" + EVENT_KEY$a,
    EVENT_POINTERDOWN = "pointerdown" + EVENT_KEY$a,
    EVENT_POINTERUP = "pointerup" + EVENT_KEY$a,
    EVENT_DRAG_START = "dragstart" + EVENT_KEY$a,
    EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}.data-api`,
    EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}.data-api`,
    CLASS_NAME_CAROUSEL = "carousel",
    CLASS_NAME_ACTIVE$2 = "active",
    CLASS_NAME_SLIDE = "slide",
    CLASS_NAME_END = "carousel-item-end",
    CLASS_NAME_START = "carousel-item-start",
    CLASS_NAME_NEXT = "carousel-item-next",
    CLASS_NAME_PREV = "carousel-item-prev",
    CLASS_NAME_POINTER_EVENT = "pointer-event",
    SELECTOR_ACTIVE$1 = ".active",
    SELECTOR_ACTIVE_ITEM = ".active.carousel-item",
    SELECTOR_ITEM = ".carousel-item",
    SELECTOR_ITEM_IMG = ".carousel-item img",
    SELECTOR_NEXT_PREV = ".carousel-item-next, .carousel-item-prev",
    SELECTOR_INDICATORS = ".carousel-indicators",
    SELECTOR_INDICATOR = "[data-bs-target]",
    SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]",
    SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]',
    POINTER_TYPE_TOUCH = "touch",
    POINTER_TYPE_PEN = "pen";
  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element), this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(config), this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element), this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0, this._pointerEvent = Boolean(window.PointerEvent), this._addEventListeners()
    }
    static get Default() {
      return Default$a
    }
    static get NAME() {
      return NAME$b
    }
    next() {
      this._slide(ORDER_NEXT)
    }
    nextWhenVisible() {
      !document.hidden && isVisible(this._element) && this.next()
    }
    prev() {
      this._slide(ORDER_PREV)
    }
    pause(event) {
      event || (this._isPaused = !0), SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element) && (triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
    }
    cycle(event) {
      event || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config && this._config.interval && !this._isPaused && (this._updateInterval(), this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
    }
    to(index) {
      this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
      const activeIndex = this._getItemIndex(this._activeElement);
      if (index > this._items.length - 1 || index < 0) return;
      if (this._isSliding) return void EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      if (activeIndex === index) return this.pause(), void this.cycle();
      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
      this._slide(order, this._items[index])
    }
    _getConfig(config) {
      return config = {
        ...Default$a,
        ...Manipulator.getDataAttributes(this._element),
        ..."object" == typeof config ? config : {}
      }, typeCheckConfig(NAME$b, config, DefaultType$a), config
    }
    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);
      if (absDeltax <= 40) return;
      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0, direction && this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT)
    }
    _addEventListeners() {
      this._config.keyboard && EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event)), "hover" === this._config.pause && (EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event)), EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event))), this._config.touch && this._touchSupported && this._addTouchEventListeners()
    }
    _addTouchEventListeners() {
      const hasPointerPenTouch = event => this._pointerEvent && ("pen" === event.pointerType || "touch" === event.pointerType),
        start = event => {
          hasPointerPenTouch(event) ? this.touchStartX = event.clientX : this._pointerEvent || (this.touchStartX = event.touches[0].clientX)
        },
        move = event => {
          this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX
        },
        end = event => {
          hasPointerPenTouch(event) && (this.touchDeltaX = event.clientX - this.touchStartX), this._handleSwipe(), "hover" === this._config.pause && (this.pause(), this.touchTimeout && clearTimeout(this.touchTimeout), this.touchTimeout = setTimeout(event => this.cycle(event), 500 + this._config.interval))
        };
      SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
        EventHandler.on(itemImg, EVENT_DRAG_START, event => event.preventDefault())
      }), this._pointerEvent ? (EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event)), EventHandler.on(this._element, EVENT_POINTERUP, event => end(event)), this._element.classList.add("pointer-event")) : (EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event)), EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event)), EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event)))
    }
    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) return;
      const direction = KEY_TO_DIRECTION[event.key];
      direction && (event.preventDefault(), this._slide(direction))
    }
    _getItemIndex(element) {
      return this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [], this._items.indexOf(element)
    }
    _getItemByOrder(order, activeElement) {
      const isNext = order === ORDER_NEXT;
      return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap)
    }
    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget),
        fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));
      return EventHandler.trigger(this._element, EVENT_SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      })
    }
    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const activeIndicator = SelectorEngine.findOne(".active", this._indicatorsElement);
        activeIndicator.classList.remove("active"), activeIndicator.removeAttribute("aria-current");
        const indicators = SelectorEngine.find("[data-bs-target]", this._indicatorsElement);
        for (let i = 0; i < indicators.length; i++)
          if (Number.parseInt(indicators[i].getAttribute("data-bs-slide-to"), 10) === this._getItemIndex(element)) {
            indicators[i].classList.add("active"), indicators[i].setAttribute("aria-current", "true");
            break
          }
      }
    }
    _updateInterval() {
      const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
      if (!element) return;
      const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
      elementInterval ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = elementInterval) : this._config.interval = this._config.defaultInterval || this._config.interval
    }
    _slide(directionOrOrder, element) {
      const order = this._directionToOrder(directionOrOrder),
        activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element),
        activeElementIndex = this._getItemIndex(activeElement),
        nextElement = element || this._getItemByOrder(order, activeElement),
        nextElementIndex = this._getItemIndex(nextElement),
        isCycling = Boolean(this._interval),
        isNext = order === ORDER_NEXT,
        directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END,
        orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV,
        eventDirectionName = this._orderToDirection(order);
      if (nextElement && nextElement.classList.contains("active")) return void(this._isSliding = !1);
      if (this._isSliding) return;
      const slideEvent = void 0;
      if (this._triggerSlideEvent(nextElement, eventDirectionName).defaultPrevented) return;
      if (!activeElement || !nextElement) return;
      this._isSliding = !0, isCycling && this.pause(), this._setActiveIndicatorElement(nextElement), this._activeElement = nextElement;
      const triggerSlidEvent = () => {
        EventHandler.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        })
      };
      if (this._element.classList.contains("slide")) {
        nextElement.classList.add(orderClassName), reflow(nextElement), activeElement.classList.add(directionalClassName), nextElement.classList.add(directionalClassName);
        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName), nextElement.classList.add("active"), activeElement.classList.remove("active", orderClassName, directionalClassName), this._isSliding = !1, setTimeout(triggerSlidEvent, 0)
        };
        this._queueCallback(completeCallBack, activeElement, !0)
      } else activeElement.classList.remove("active"), nextElement.classList.add("active"), this._isSliding = !1, triggerSlidEvent();
      isCycling && this.cycle()
    }
    _directionToOrder(direction) {
      return [DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction) ? isRTL() ? direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT : direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV : direction
    }
    _orderToDirection(order) {
      return [ORDER_NEXT, ORDER_PREV].includes(order) ? isRTL() ? order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT : order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT : order
    }
    static carouselInterface(element, config) {
      const data = Carousel.getOrCreateInstance(element, config);
      let {
        _config: _config
      } = data;
      "object" == typeof config && (_config = {
        ..._config,
        ...config
      });
      const action = "string" == typeof config ? config : _config.slide;
      if ("number" == typeof config) data.to(config);
      else if ("string" == typeof action) {
        if (void 0 === data[action]) throw new TypeError(`No method named "${action}"`);
        data[action]()
      } else _config.interval && _config.ride && (data.pause(), data.cycle())
    }
    static jQueryInterface(config) {
      return this.each((function () {
        Carousel.carouselInterface(this, config)
      }))
    }
    static dataApiClickHandler(event) {
      const target = getElementFromSelector(this);
      if (!target || !target.classList.contains("carousel")) return;
      const config = {
          ...Manipulator.getDataAttributes(target),
          ...Manipulator.getDataAttributes(this)
        },
        slideIndex = this.getAttribute("data-bs-slide-to");
      slideIndex && (config.interval = !1), Carousel.carouselInterface(target, config), slideIndex && Carousel.getInstance(target).to(slideIndex), event.preventDefault()
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler), EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
    for (let i = 0, len = carousels.length; i < len; i++) Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]))
  }), defineJQueryPlugin(Carousel);
  const NAME$a = "collapse",
    DATA_KEY$9 = "bs.collapse",
    EVENT_KEY$9 = "." + DATA_KEY$9,
    DATA_API_KEY$5 = ".data-api",
    Default$9 = {
      toggle: !0,
      parent: null
    },
    DefaultType$9 = {
      toggle: "boolean",
      parent: "(null|element)"
    },
    EVENT_SHOW$5 = "show" + EVENT_KEY$9,
    EVENT_SHOWN$5 = "shown" + EVENT_KEY$9,
    EVENT_HIDE$5 = "hide" + EVENT_KEY$9,
    EVENT_HIDDEN$5 = "hidden" + EVENT_KEY$9,
    EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}.data-api`,
    CLASS_NAME_SHOW$7 = "show",
    CLASS_NAME_COLLAPSE = "collapse",
    CLASS_NAME_COLLAPSING = "collapsing",
    CLASS_NAME_COLLAPSED = "collapsed",
    CLASS_NAME_DEEPER_CHILDREN = ":scope .collapse .collapse",
    CLASS_NAME_HORIZONTAL = "collapse-horizontal",
    WIDTH = "width",
    HEIGHT = "height",
    SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing",
    SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element), this._isTransitioning = !1, this._config = this._getConfig(config), this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i],
          selector = getSelectorFromElement(elem),
          filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);
        null !== selector && filterElement.length && (this._selector = selector, this._triggerArray.push(elem))
      }
      this._initializeChildren(), this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()), this._config.toggle && this.toggle()
    }
    static get Default() {
      return Default$9
    }
    static get NAME() {
      return NAME$a
    }
    toggle() {
      this._isShown() ? this.hide() : this.show()
    }
    show() {
      if (this._isTransitioning || this._isShown()) return;
      let actives = [],
        activesData;
      if (this._config.parent) {
        const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
        actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem))
      }
      const container = SelectorEngine.findOne(this._selector);
      if (actives.length) {
        const tempActiveData = actives.find(elem => container !== elem);
        if (activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null, activesData && activesData._isTransitioning) return
      }
      const startEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_SHOW$5).defaultPrevented) return;
      actives.forEach(elemActive => {
        container !== elemActive && Collapse.getOrCreateInstance(elemActive, {
          toggle: !1
        }).hide(), activesData || Data.set(elemActive, DATA_KEY$9, null)
      });
      const dimension = this._getDimension();
      this._element.classList.remove("collapse"), this._element.classList.add("collapsing"), this._element.style[dimension] = 0, this._addAriaAndCollapsedClass(this._triggerArray, !0), this._isTransitioning = !0;
      const complete = () => {
          this._isTransitioning = !1, this._element.classList.remove("collapsing"), this._element.classList.add("collapse", "show"), this._element.style[dimension] = "", EventHandler.trigger(this._element, EVENT_SHOWN$5)
        },
        capitalizedDimension = void 0,
        scrollSize = "scroll" + (dimension[0].toUpperCase() + dimension.slice(1));
      this._queueCallback(complete, this._element, !0), this._element.style[dimension] = this._element[scrollSize] + "px"
    }
    hide() {
      if (this._isTransitioning || !this._isShown()) return;
      const startEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_HIDE$5).defaultPrevented) return;
      const dimension = this._getDimension();
      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px", reflow(this._element), this._element.classList.add("collapsing"), this._element.classList.remove("collapse", "show");
      const triggerArrayLength = this._triggerArray.length;
      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i],
          elem = getElementFromSelector(trigger);
        elem && !this._isShown(elem) && this._addAriaAndCollapsedClass([trigger], !1)
      }
      this._isTransitioning = !0;
      const complete = () => {
        this._isTransitioning = !1, this._element.classList.remove("collapsing"), this._element.classList.add("collapse"), EventHandler.trigger(this._element, EVENT_HIDDEN$5)
      };
      this._element.style[dimension] = "", this._queueCallback(complete, this._element, !0)
    }
    _isShown(element = this._element) {
      return element.classList.contains("show")
    }
    _getConfig(config) {
      return (config = {
        ...Default$9,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      }).toggle = Boolean(config.toggle), config.parent = getElement(config.parent), typeCheckConfig(NAME$a, config, DefaultType$9), config
    }
    _getDimension() {
      return this._element.classList.contains("collapse-horizontal") ? WIDTH : HEIGHT
    }
    _initializeChildren() {
      if (!this._config.parent) return;
      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
        const selected = getElementFromSelector(element);
        selected && this._addAriaAndCollapsedClass([element], this._isShown(selected))
      })
    }
    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      triggerArray.length && triggerArray.forEach(elem => {
        isOpen ? elem.classList.remove("collapsed") : elem.classList.add("collapsed"), elem.setAttribute("aria-expanded", isOpen)
      })
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const _config = {};
        "string" == typeof config && /show|hide/.test(config) && (_config.toggle = !1);
        const data = Collapse.getOrCreateInstance(this, _config);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config]()
        }
      }))
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, (function (event) {
    ("A" === event.target.tagName || event.delegateTarget && "A" === event.delegateTarget.tagName) && event.preventDefault();
    const selector = getSelectorFromElement(this),
      selectorElements = void 0;
    SelectorEngine.find(selector).forEach(element => {
      Collapse.getOrCreateInstance(element, {
        toggle: !1
      }).toggle()
    })
  })), defineJQueryPlugin(Collapse);
  var top = "top",
    bottom = "bottom",
    right = "right",
    left = "left",
    auto = "auto",
    basePlacements = [top, bottom, right, left],
    start = "start",
    end = "end",
    clippingParents = "clippingParents",
    viewport = "viewport",
    popper = "popper",
    reference = "reference",
    variationPlacements = basePlacements.reduce((function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end])
    }), []),
    placements = [].concat(basePlacements, [auto]).reduce((function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end])
    }), []),
    beforeRead = "beforeRead",
    read = "read",
    afterRead = "afterRead",
    beforeMain = "beforeMain",
    main = "main",
    afterMain = "afterMain",
    beforeWrite = "beforeWrite",
    write = "write",
    afterWrite = "afterWrite",
    modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null
  }

  function getWindow(node) {
    if (null == node) return window;
    if ("[object Window]" !== node.toString()) {
      var ownerDocument = node.ownerDocument;
      return ownerDocument && ownerDocument.defaultView || window
    }
    return node
  }

  function isElement(node) {
    var OwnElement;
    return node instanceof getWindow(node).Element || node instanceof Element
  }

  function isHTMLElement(node) {
    var OwnElement;
    return node instanceof getWindow(node).HTMLElement || node instanceof HTMLElement
  }

  function isShadowRoot(node) {
    return "undefined" != typeof ShadowRoot && (node instanceof getWindow(node).ShadowRoot || node instanceof ShadowRoot);
    var OwnElement
  }

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach((function (name) {
      var style = state.styles[name] || {},
        attributes = state.attributes[name] || {},
        element = state.elements[name];
      isHTMLElement(element) && getNodeName(element) && (Object.assign(element.style, style), Object.keys(attributes).forEach((function (name) {
        var value = attributes[name];
        !1 === value ? element.removeAttribute(name) : element.setAttribute(name, !0 === value ? "" : value)
      })))
    }))
  }

  function effect$2(_ref2) {
    var state = _ref2.state,
      initialStyles = {
        popper: {
          position: state.options.strategy,
          left: "0",
          top: "0",
          margin: "0"
        },
        arrow: {
          position: "absolute"
        },
        reference: {}
      };
    return Object.assign(state.elements.popper.style, initialStyles.popper), state.styles = initialStyles, state.elements.arrow && Object.assign(state.elements.arrow.style, initialStyles.arrow),
      function () {
        Object.keys(state.elements).forEach((function (name) {
          var element = state.elements[name],
            attributes = state.attributes[name] || {},
            styleProperties, style = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]).reduce((function (style, property) {
              return style[property] = "", style
            }), {});
          isHTMLElement(element) && getNodeName(element) && (Object.assign(element.style, style), Object.keys(attributes).forEach((function (attribute) {
            element.removeAttribute(attribute)
          })))
        }))
      }
  }
  const applyStyles$1 = {
    name: "applyStyles",
    enabled: !0,
    phase: "write",
    fn: applyStyles,
    effect: effect$2,
    requires: ["computeStyles"]
  };

  function getBasePlacement(placement) {
    return placement.split("-")[0]
  }

  function getBoundingClientRect(element, includeScale) {
    var rect = element.getBoundingClientRect(),
      scaleX = 1,
      scaleY = 1;
    return {
      width: rect.width / 1,
      height: rect.height / 1,
      top: rect.top / 1,
      right: rect.right / 1,
      bottom: rect.bottom / 1,
      left: rect.left / 1,
      x: rect.left / 1,
      y: rect.top / 1
    }
  }

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element),
      width = element.offsetWidth,
      height = element.offsetHeight;
    return Math.abs(clientRect.width - width) <= 1 && (width = clientRect.width), Math.abs(clientRect.height - height) <= 1 && (height = clientRect.height), {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    }
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode();
    if (parent.contains(child)) return !0;
    if (rootNode && isShadowRoot(rootNode)) {
      var next = child;
      do {
        if (next && parent.isSameNode(next)) return !0;
        next = next.parentNode || next.host
      } while (next)
    }
    return !1
  }

  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element)
  }

  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0
  }

  function getDocumentElement(element) {
    return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement
  }

  function getParentNode(element) {
    return "html" === getNodeName(element) ? element : element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element)
  }

  function getTrueOffsetParent(element) {
    return isHTMLElement(element) && "fixed" !== getComputedStyle$1(element).position ? element.offsetParent : null
  }

  function getContainingBlock(element) {
    var isFirefox = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox"),
      isIE, elementCss;
    if (-1 !== navigator.userAgent.indexOf("Trident") && isHTMLElement(element) && "fixed" === getComputedStyle$1(element).position) return null;
    for (var currentNode = getParentNode(element); isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0;) {
      var css = getComputedStyle$1(currentNode);
      if ("none" !== css.transform || "none" !== css.perspective || "paint" === css.contain || -1 !== ["transform", "perspective"].indexOf(css.willChange) || isFirefox && "filter" === css.willChange || isFirefox && css.filter && "none" !== css.filter) return currentNode;
      currentNode = currentNode.parentNode
    }
    return null
  }

  function getOffsetParent(element) {
    for (var window = getWindow(element), offsetParent = getTrueOffsetParent(element); offsetParent && isTableElement(offsetParent) && "static" === getComputedStyle$1(offsetParent).position;) offsetParent = getTrueOffsetParent(offsetParent);
    return offsetParent && ("html" === getNodeName(offsetParent) || "body" === getNodeName(offsetParent) && "static" === getComputedStyle$1(offsetParent).position) ? window : offsetParent || getContainingBlock(element) || window
  }

  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y"
  }
  var max = Math.max,
    min = Math.min,
    round = Math.round;

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1))
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }, paddingObject)
  }

  function expandToHashMap(value, keys) {
    return keys.reduce((function (hashMap, key) {
      return hashMap[key] = value, hashMap
    }), {})
  }
  var toPaddingObject = function toPaddingObject(padding, state) {
    return mergePaddingObject("number" != typeof (padding = "function" == typeof padding ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding) ? padding : expandToHashMap(padding, basePlacements))
  };

  function arrow(_ref) {
    var _state$modifiersData$, state = _ref.state,
      name = _ref.name,
      options = _ref.options,
      arrowElement = state.elements.arrow,
      popperOffsets = state.modifiersData.popperOffsets,
      basePlacement = getBasePlacement(state.placement),
      axis = getMainAxisFromPlacement(basePlacement),
      isVertical, len = [left, right].indexOf(basePlacement) >= 0 ? "height" : "width";
    if (arrowElement && popperOffsets) {
      var paddingObject = toPaddingObject(options.padding, state),
        arrowRect = getLayoutRect(arrowElement),
        minProp = "y" === axis ? top : left,
        maxProp = "y" === axis ? bottom : right,
        endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len],
        startDiff = popperOffsets[axis] - state.rects.reference[axis],
        arrowOffsetParent = getOffsetParent(arrowElement),
        clientSize = arrowOffsetParent ? "y" === axis ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0,
        centerToReference = endDiff / 2 - startDiff / 2,
        min = paddingObject[minProp],
        max = clientSize - arrowRect[len] - paddingObject[maxProp],
        center = clientSize / 2 - arrowRect[len] / 2 + centerToReference,
        offset = within(min, center, max),
        axisProp = axis;
      state.modifiersData[name] = ((_state$modifiersData$ = {})[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$)
    }
  }

  function effect$1(_ref2) {
    var state = _ref2.state,
      options, _options$element = _ref2.options.element,
      arrowElement = void 0 === _options$element ? "[data-popper-arrow]" : _options$element;
    null != arrowElement && ("string" != typeof arrowElement || (arrowElement = state.elements.popper.querySelector(arrowElement))) && contains(state.elements.popper, arrowElement) && (state.elements.arrow = arrowElement)
  }
  const arrow$1 = {
    name: "arrow",
    enabled: !0,
    phase: "main",
    fn: arrow,
    effect: effect$1,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };

  function getVariation(placement) {
    return placement.split("-")[1]
  }
  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };

  function roundOffsetsByDPR(_ref) {
    var x = _ref.x,
      y = _ref.y,
      win, dpr = window.devicePixelRatio || 1;
    return {
      x: round(round(x * dpr) / dpr) || 0,
      y: round(round(y * dpr) / dpr) || 0
    }
  }

  function mapToStyles(_ref2) {
    var _Object$assign2, popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      _ref3 = !0 === roundOffsets ? roundOffsetsByDPR(offsets) : "function" == typeof roundOffsets ? roundOffsets(offsets) : offsets,
      _ref3$x = _ref3.x,
      x = void 0 === _ref3$x ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = void 0 === _ref3$y ? 0 : _ref3$y,
      hasX = offsets.hasOwnProperty("x"),
      hasY = offsets.hasOwnProperty("y"),
      sideX = left,
      sideY = top,
      win = window;
    if (adaptive) {
      var offsetParent = getOffsetParent(popper),
        heightProp = "clientHeight",
        widthProp = "clientWidth";
      offsetParent === getWindow(popper) && "static" !== getComputedStyle$1(offsetParent = getDocumentElement(popper)).position && "absolute" === position && (heightProp = "scrollHeight", widthProp = "scrollWidth"), offsetParent = offsetParent, placement !== top && (placement !== left && placement !== right || variation !== end) || (sideY = bottom, y -= offsetParent[heightProp] - popperRect.height, y *= gpuAcceleration ? 1 : -1), placement !== left && (placement !== top && placement !== bottom || variation !== end) || (sideX = right, x -= offsetParent[widthProp] - popperRect.width, x *= gpuAcceleration ? 1 : -1)
    }
    var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides),
      _Object$assign;
    return gpuAcceleration ? Object.assign({}, commonStyles, ((_Object$assign = {})[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign)) : Object.assign({}, commonStyles, ((_Object$assign2 = {})[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2))
  }

  function computeStyles(_ref4) {
    var state = _ref4.state,
      options = _ref4.options,
      _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = void 0 === _options$gpuAccelerat || _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = void 0 === _options$adaptive || _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = void 0 === _options$roundOffsets || _options$roundOffsets,
      commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration
      };
    null != state.modifiersData.popperOffsets && (state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })))), null != state.modifiersData.arrow && (state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: !1,
      roundOffsets: roundOffsets
    })))), state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-placement": state.placement
    })
  }
  const computeStyles$1 = {
    name: "computeStyles",
    enabled: !0,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {}
  };
  var passive = {
    passive: !0
  };

  function effect(_ref) {
    var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options,
      _options$scroll = options.scroll,
      scroll = void 0 === _options$scroll || _options$scroll,
      _options$resize = options.resize,
      resize = void 0 === _options$resize || _options$resize,
      window = getWindow(state.elements.popper),
      scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    return scroll && scrollParents.forEach((function (scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, passive)
      })), resize && window.addEventListener("resize", instance.update, passive),
      function () {
        scroll && scrollParents.forEach((function (scrollParent) {
          scrollParent.removeEventListener("scroll", instance.update, passive)
        })), resize && window.removeEventListener("resize", instance.update, passive)
      }
  }
  const eventListeners = {
    name: "eventListeners",
    enabled: !0,
    phase: "write",
    fn: function fn() {},
    effect: effect,
    data: {}
  };
  var hash$1 = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };

  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (function (matched) {
      return hash$1[matched]
    }))
  }
  var hash = {
    start: "end",
    end: "start"
  };

  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, (function (matched) {
      return hash[matched]
    }))
  }

  function getWindowScroll(node) {
    var win = getWindow(node),
      scrollLeft, scrollTop;
    return {
      scrollLeft: win.pageXOffset,
      scrollTop: win.pageYOffset
    }
  }

  function getWindowScrollBarX(element) {
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft
  }

  function getViewportRect(element) {
    var win = getWindow(element),
      html = getDocumentElement(element),
      visualViewport = win.visualViewport,
      width = html.clientWidth,
      height = html.clientHeight,
      x = 0,
      y = 0;
    return visualViewport && (width = visualViewport.width, height = visualViewport.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (x = visualViewport.offsetLeft, y = visualViewport.offsetTop)), {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    }
  }

  function getDocumentRect(element) {
    var _element$ownerDocumen, html = getDocumentElement(element),
      winScroll = getWindowScroll(element),
      body = null == (_element$ownerDocumen = element.ownerDocument) ? void 0 : _element$ownerDocumen.body,
      width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0),
      height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0),
      x = -winScroll.scrollLeft + getWindowScrollBarX(element),
      y = -winScroll.scrollTop;
    return "rtl" === getComputedStyle$1(body || html).direction && (x += max(html.clientWidth, body ? body.clientWidth : 0) - width), {
      width: width,
      height: height,
      x: x,
      y: y
    }
  }

  function isScrollParent(element) {
    var _getComputedStyle = getComputedStyle$1(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)
  }

  function getScrollParent(node) {
    return ["html", "body", "#document"].indexOf(getNodeName(node)) >= 0 ? node.ownerDocument.body : isHTMLElement(node) && isScrollParent(node) ? node : getScrollParent(getParentNode(node))
  }

  function listScrollParents(element, list) {
    var _element$ownerDocumen;
    void 0 === list && (list = []);
    var scrollParent = getScrollParent(element),
      isBody = scrollParent === (null == (_element$ownerDocumen = element.ownerDocument) ? void 0 : _element$ownerDocumen.body),
      win = getWindow(scrollParent),
      target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent,
      updatedList = list.concat(target);
    return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)))
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    })
  }

  function getInnerBoundingClientRect(element) {
    var rect = getBoundingClientRect(element);
    return rect.top = rect.top + element.clientTop, rect.left = rect.left + element.clientLeft, rect.bottom = rect.top + element.clientHeight, rect.right = rect.left + element.clientWidth, rect.width = element.clientWidth, rect.height = element.clientHeight, rect.x = rect.left, rect.y = rect.top, rect
  }

  function getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)))
  }

  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element)),
      canEscapeClipping, clipperElement = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0 && isHTMLElement(element) ? getOffsetParent(element) : element;
    return isElement(clipperElement) ? clippingParents.filter((function (clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && "body" !== getNodeName(clippingParent)
    })) : []
  }

  function getClippingRect(element, boundary, rootBoundary) {
    var mainClippingParents = "clippingParents" === boundary ? getClippingParents(element) : [].concat(boundary),
      clippingParents = [].concat(mainClippingParents, [rootBoundary]),
      firstClippingParent = clippingParents[0],
      clippingRect = clippingParents.reduce((function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent);
        return accRect.top = max(rect.top, accRect.top), accRect.right = min(rect.right, accRect.right), accRect.bottom = min(rect.bottom, accRect.bottom), accRect.left = max(rect.left, accRect.left), accRect
      }), getClientRectFromMixedType(element, firstClippingParent));
    return clippingRect.width = clippingRect.right - clippingRect.left, clippingRect.height = clippingRect.bottom - clippingRect.top, clippingRect.x = clippingRect.left, clippingRect.y = clippingRect.top, clippingRect
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement,
      basePlacement = placement ? getBasePlacement(placement) : null,
      variation = placement ? getVariation(placement) : null,
      commonX = reference.x + reference.width / 2 - element.width / 2,
      commonY = reference.y + reference.height / 2 - element.height / 2,
      offsets;
    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;
      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;
      default:
        offsets = {
          x: reference.x,
          y: reference.y
        }
    }
    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
    if (null != mainAxis) {
      var len = "y" === mainAxis ? "height" : "width";
      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;
        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2)
      }
    }
    return offsets
  }

  function detectOverflow(state, options) {
    void 0 === options && (options = {});
    var _options = options,
      _options$placement = _options.placement,
      placement = void 0 === _options$placement ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = void 0 === _options$boundary ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = void 0 === _options$rootBoundary ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = void 0 === _options$elementConte ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = void 0 !== _options$altBoundary && _options$altBoundary,
      _options$padding = _options.padding,
      padding = void 0 === _options$padding ? 0 : _options$padding,
      paddingObject = mergePaddingObject("number" != typeof padding ? padding : expandToHashMap(padding, basePlacements)),
      altContext = elementContext === popper ? reference : popper,
      popperRect = state.rects.popper,
      element = state.elements[altBoundary ? altContext : elementContext],
      clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary),
      referenceClientRect = getBoundingClientRect(state.elements.reference),
      popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: "absolute",
        placement: placement
      }),
      popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets)),
      elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect,
      overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      },
      offsetData = state.modifiersData.offset;
    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach((function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1,
          axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
        overflowOffsets[key] += offset[axis] * multiply
      }))
    }
    return overflowOffsets
  }

  function computeAutoPlacement(state, options) {
    void 0 === options && (options = {});
    var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = void 0 === _options$allowedAutoP ? placements : _options$allowedAutoP,
      variation = getVariation(placement),
      placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter((function (placement) {
        return getVariation(placement) === variation
      })) : basePlacements,
      allowedPlacements = placements$1.filter((function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0
      }));
    0 === allowedPlacements.length && (allowedPlacements = placements$1);
    var overflows = allowedPlacements.reduce((function (acc, placement) {
      return acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)], acc
    }), {});
    return Object.keys(overflows).sort((function (a, b) {
      return overflows[a] - overflows[b]
    }))
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) return [];
    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)]
  }

  function flip(_ref) {
    var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
    if (!state.modifiersData[name]._skip) {
      for (var _options$mainAxis = options.mainAxis, checkMainAxis = void 0 === _options$mainAxis || _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = void 0 === _options$altAxis || _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = void 0 === _options$flipVariatio || _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements, preferredPlacement = state.options.placement, basePlacement = getBasePlacement(preferredPlacement), isBasePlacement, fallbackPlacements = specifiedFallbackPlacements || (basePlacement !== preferredPlacement && flipVariations ? getExpandedFallbackPlacements(preferredPlacement) : [getOppositePlacement(preferredPlacement)]), placements = [preferredPlacement].concat(fallbackPlacements).reduce((function (acc, placement) {
          return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
            placement: placement,
            boundary: boundary,
            rootBoundary: rootBoundary,
            padding: padding,
            flipVariations: flipVariations,
            allowedAutoPlacements: allowedAutoPlacements
          }) : placement)
        }), []), referenceRect = state.rects.reference, popperRect = state.rects.popper, checksMap = new Map, makeFallbackChecks = !0, firstFittingPlacement = placements[0], i = 0; i < placements.length; i++) {
        var placement = placements[i],
          _basePlacement = getBasePlacement(placement),
          isStartVariation = getVariation(placement) === start,
          isVertical = [top, bottom].indexOf(_basePlacement) >= 0,
          len = isVertical ? "width" : "height",
          overflow = detectOverflow(state, {
            placement: placement,
            boundary: boundary,
            rootBoundary: rootBoundary,
            altBoundary: altBoundary,
            padding: padding
          }),
          mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
        referenceRect[len] > popperRect[len] && (mainVariationSide = getOppositePlacement(mainVariationSide));
        var altVariationSide = getOppositePlacement(mainVariationSide),
          checks = [];
        if (checkMainAxis && checks.push(overflow[_basePlacement] <= 0), checkAltAxis && checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0), checks.every((function (check) {
            return check
          }))) {
          firstFittingPlacement = placement, makeFallbackChecks = !1;
          break
        }
        checksMap.set(placement, checks)
      }
      if (makeFallbackChecks)
        for (var numberOfChecks, _loop = function _loop(_i) {
            var fittingPlacement = placements.find((function (placement) {
              var checks = checksMap.get(placement);
              if (checks) return checks.slice(0, _i).every((function (check) {
                return check
              }))
            }));
            if (fittingPlacement) return firstFittingPlacement = fittingPlacement, "break"
          }, _i = flipVariations ? 3 : 1; _i > 0; _i--) {
          var _ret;
          if ("break" === _loop(_i)) break
        }
      state.placement !== firstFittingPlacement && (state.modifiersData[name]._skip = !0, state.placement = firstFittingPlacement, state.reset = !0)
    }
  }
  const flip$1 = {
    name: "flip",
    enabled: !0,
    phase: "main",
    fn: flip,
    requiresIfExists: ["offset"],
    data: {
      _skip: !1
    }
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    return void 0 === preventedOffsets && (preventedOffsets = {
      x: 0,
      y: 0
    }), {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    }
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some((function (side) {
      return overflow[side] >= 0
    }))
  }

  function hide(_ref) {
    var state = _ref.state,
      name = _ref.name,
      referenceRect = state.rects.reference,
      popperRect = state.rects.popper,
      preventedOffsets = state.modifiersData.preventOverflow,
      referenceOverflow = detectOverflow(state, {
        elementContext: "reference"
      }),
      popperAltOverflow = detectOverflow(state, {
        altBoundary: !0
      }),
      referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect),
      popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets),
      isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets),
      hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    }, state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-reference-hidden": isReferenceHidden,
      "data-popper-escaped": hasPopperEscaped
    })
  }
  const hide$1 = {
    name: "hide",
    enabled: !0,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement),
      invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1,
      _ref = "function" == typeof offset ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
      skidding = _ref[0],
      distance = _ref[1];
    return skidding = skidding || 0, distance = (distance || 0) * invertDistance, [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    }
  }

  function offset(_ref2) {
    var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name,
      _options$offset = options.offset,
      offset = void 0 === _options$offset ? [0, 0] : _options$offset,
      data = placements.reduce((function (acc, placement) {
        return acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset), acc
      }), {}),
      _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;
    null != state.modifiersData.popperOffsets && (state.modifiersData.popperOffsets.x += x, state.modifiersData.popperOffsets.y += y), state.modifiersData[name] = data
  }
  const offset$1 = {
    name: "offset",
    enabled: !0,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
      name = _ref.name;
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: "absolute",
      placement: state.placement
    })
  }
  const popperOffsets$1 = {
    name: "popperOffsets",
    enabled: !0,
    phase: "read",
    fn: popperOffsets,
    data: {}
  };

  function getAltAxis(axis) {
    return "x" === axis ? "y" : "x"
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
      options = _ref.options,
      name = _ref.name,
      _options$mainAxis = options.mainAxis,
      checkMainAxis = void 0 === _options$mainAxis || _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = void 0 !== _options$altAxis && _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = void 0 === _options$tether || _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = void 0 === _options$tetherOffset ? 0 : _options$tetherOffset,
      overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      }),
      basePlacement = getBasePlacement(state.placement),
      variation = getVariation(state.placement),
      isBasePlacement = !variation,
      mainAxis = getMainAxisFromPlacement(basePlacement),
      altAxis = getAltAxis(mainAxis),
      popperOffsets = state.modifiersData.popperOffsets,
      referenceRect = state.rects.reference,
      popperRect = state.rects.popper,
      tetherOffsetValue = "function" == typeof tetherOffset ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset,
      data = {
        x: 0,
        y: 0
      };
    if (popperOffsets) {
      if (checkMainAxis || checkAltAxis) {
        var mainSide = "y" === mainAxis ? top : left,
          altSide = "y" === mainAxis ? bottom : right,
          len = "y" === mainAxis ? "height" : "width",
          offset = popperOffsets[mainAxis],
          min$1 = popperOffsets[mainAxis] + overflow[mainSide],
          max$1 = popperOffsets[mainAxis] - overflow[altSide],
          additive = tether ? -popperRect[len] / 2 : 0,
          minLen = variation === start ? referenceRect[len] : popperRect[len],
          maxLen = variation === start ? -popperRect[len] : -referenceRect[len],
          arrowElement = state.elements.arrow,
          arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
            width: 0,
            height: 0
          },
          arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
          arrowPaddingMin = arrowPaddingObject[mainSide],
          arrowPaddingMax = arrowPaddingObject[altSide],
          arrowLen = within(0, referenceRect[len], arrowRect[len]),
          minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue,
          maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue,
          arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow),
          clientOffset = arrowOffsetParent ? "y" === mainAxis ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0,
          offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0,
          tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset,
          tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;
        if (checkMainAxis) {
          var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
          popperOffsets[mainAxis] = preventedOffset, data[mainAxis] = preventedOffset - offset
        }
        if (checkAltAxis) {
          var _mainSide = "x" === mainAxis ? top : left,
            _altSide = "x" === mainAxis ? bottom : right,
            _offset = popperOffsets[altAxis],
            _min = _offset + overflow[_mainSide],
            _max = _offset - overflow[_altSide],
            _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);
          popperOffsets[altAxis] = _preventedOffset, data[altAxis] = _preventedOffset - _offset
        }
      }
      state.modifiersData[name] = data
    }
  }
  const preventOverflow$1 = {
    name: "preventOverflow",
    enabled: !0,
    phase: "main",
    fn: preventOverflow,
    requiresIfExists: ["offset"]
  };

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    }
  }

  function getNodeScroll(node) {
    return node !== getWindow(node) && isHTMLElement(node) ? getHTMLElementScroll(node) : getWindowScroll(node)
  }

  function isElementScaled(element) {
    var rect = element.getBoundingClientRect(),
      scaleX = rect.width / element.offsetWidth || 1,
      scaleY = rect.height / element.offsetHeight || 1;
    return 1 !== scaleX || 1 !== scaleY
  }

  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    void 0 === isFixed && (isFixed = !1);
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent),
      rect = getBoundingClientRect(elementOrVirtualElement),
      scroll = {
        scrollLeft: 0,
        scrollTop: 0
      },
      offsets = {
        x: 0,
        y: 0
      };
    return (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) && (("body" !== getNodeName(offsetParent) || isScrollParent(documentElement)) && (scroll = getNodeScroll(offsetParent)), isHTMLElement(offsetParent) ? ((offsets = getBoundingClientRect(offsetParent)).x += offsetParent.clientLeft, offsets.y += offsetParent.clientTop) : documentElement && (offsets.x = getWindowScrollBarX(documentElement))), {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    }
  }

  function order(modifiers) {
    var map = new Map,
      visited = new Set,
      result = [];

    function sort(modifier) {
      var requires;
      visited.add(modifier.name), [].concat(modifier.requires || [], modifier.requiresIfExists || []).forEach((function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);
          depModifier && sort(depModifier)
        }
      })), result.push(modifier)
    }
    return modifiers.forEach((function (modifier) {
      map.set(modifier.name, modifier)
    })), modifiers.forEach((function (modifier) {
      visited.has(modifier.name) || sort(modifier)
    })), result
  }

  function orderModifiers(modifiers) {
    var orderedModifiers = order(modifiers);
    return modifierPhases.reduce((function (acc, phase) {
      return acc.concat(orderedModifiers.filter((function (modifier) {
        return modifier.phase === phase
      })))
    }), [])
  }

  function debounce(fn) {
    var pending;
    return function () {
      return pending || (pending = new Promise((function (resolve) {
        Promise.resolve().then((function () {
          pending = void 0, resolve(fn())
        }))
      }))), pending
    }
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce((function (merged, current) {
      var existing = merged[current.name];
      return merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current, merged
    }), {});
    return Object.keys(merged).map((function (key) {
      return merged[key]
    }))
  }
  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
    return !args.some((function (element) {
      return !(element && "function" == typeof element.getBoundingClientRect)
    }))
  }

  function popperGenerator(generatorOptions) {
    void 0 === generatorOptions && (generatorOptions = {});
    var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = void 0 === _generatorOptions$def ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = void 0 === _generatorOptions$def2 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      void 0 === options && (options = defaultOptions);
      var state = {
          placement: "bottom",
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        },
        effectCleanupFns = [],
        isDestroyed = !1,
        instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = "function" == typeof setOptionsAction ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects(), state.options = Object.assign({}, defaultOptions, state.options, options), state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            };
            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
            return state.orderedModifiers = orderedModifiers.filter((function (m) {
              return m.enabled
            })), runModifierEffects(), instance.update()
          },
          forceUpdate: function forceUpdate() {
            if (!isDestroyed) {
              var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper;
              if (areValidElements(reference, popper)) {
                state.rects = {
                  reference: getCompositeRect(reference, getOffsetParent(popper), "fixed" === state.options.strategy),
                  popper: getLayoutRect(popper)
                }, state.reset = !1, state.placement = state.options.placement, state.orderedModifiers.forEach((function (modifier) {
                  return state.modifiersData[modifier.name] = Object.assign({}, modifier.data)
                }));
                for (var index = 0; index < state.orderedModifiers.length; index++)
                  if (!0 !== state.reset) {
                    var _state$orderedModifie = state.orderedModifiers[index],
                      fn = _state$orderedModifie.fn,
                      _state$orderedModifie2 = _state$orderedModifie.options,
                      _options = void 0 === _state$orderedModifie2 ? {} : _state$orderedModifie2,
                      name = _state$orderedModifie.name;
                    "function" == typeof fn && (state = fn({
                      state: state,
                      options: _options,
                      name: name,
                      instance: instance
                    }) || state)
                  } else state.reset = !1, index = -1
              }
            }
          },
          update: debounce((function () {
            return new Promise((function (resolve) {
              instance.forceUpdate(), resolve(state)
            }))
          })),
          destroy: function destroy() {
            cleanupModifierEffects(), isDestroyed = !0
          }
        };
      if (!areValidElements(reference, popper)) return instance;

      function runModifierEffects() {
        state.orderedModifiers.forEach((function (_ref3) {
          var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = void 0 === _ref3$options ? {} : _ref3$options,
            effect = _ref3.effect;
          if ("function" == typeof effect) {
            var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              }),
              noopFn = function noopFn() {};
            effectCleanupFns.push(cleanupFn || noopFn)
          }
        }))
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach((function (fn) {
          return fn()
        })), effectCleanupFns = []
      }
      return instance.setOptions(options).then((function (state) {
        !isDestroyed && options.onFirstUpdate && options.onFirstUpdate(state)
      })), instance
    }
  }
  var createPopper$2 = popperGenerator(),
    defaultModifiers$1, createPopper$1 = popperGenerator({
      defaultModifiers: [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1]
    }),
    defaultModifiers, createPopper = popperGenerator({
      defaultModifiers: [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1]
    });
  const Popper = Object.freeze({
      __proto__: null,
      popperGenerator: popperGenerator,
      detectOverflow: detectOverflow,
      createPopperBase: createPopper$2,
      createPopper: createPopper,
      createPopperLite: createPopper$1,
      top: top,
      bottom: bottom,
      right: right,
      left: left,
      auto: auto,
      basePlacements: basePlacements,
      start: start,
      end: end,
      clippingParents: clippingParents,
      viewport: viewport,
      popper: popper,
      reference: reference,
      variationPlacements: variationPlacements,
      placements: placements,
      beforeRead: beforeRead,
      read: read,
      afterRead: afterRead,
      beforeMain: beforeMain,
      main: main,
      afterMain: afterMain,
      beforeWrite: beforeWrite,
      write: write,
      afterWrite: afterWrite,
      modifierPhases: modifierPhases,
      applyStyles: applyStyles$1,
      arrow: arrow$1,
      computeStyles: computeStyles$1,
      eventListeners: eventListeners,
      flip: flip$1,
      hide: hide$1,
      offset: offset$1,
      popperOffsets: popperOffsets$1,
      preventOverflow: preventOverflow$1
    }),
    NAME$9 = "dropdown",
    DATA_KEY$8 = void 0,
    EVENT_KEY$8 = ".bs.dropdown",
    DATA_API_KEY$4 = ".data-api",
    ESCAPE_KEY$2 = "Escape",
    SPACE_KEY = "Space",
    TAB_KEY$1 = "Tab",
    ARROW_UP_KEY = "ArrowUp",
    ARROW_DOWN_KEY = "ArrowDown",
    RIGHT_MOUSE_BUTTON = 2,
    REGEXP_KEYDOWN = new RegExp("ArrowUp|ArrowDown|Escape"),
    EVENT_HIDE$4 = "hide" + EVENT_KEY$8,
    EVENT_HIDDEN$4 = "hidden" + EVENT_KEY$8,
    EVENT_SHOW$4 = "show" + EVENT_KEY$8,
    EVENT_SHOWN$4 = "shown" + EVENT_KEY$8,
    EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}.data-api`,
    EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}.data-api`,
    EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}.data-api`,
    CLASS_NAME_SHOW$6 = "show",
    CLASS_NAME_DROPUP = "dropup",
    CLASS_NAME_DROPEND = "dropend",
    CLASS_NAME_DROPSTART = "dropstart",
    CLASS_NAME_NAVBAR = "navbar",
    SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]',
    SELECTOR_MENU = ".dropdown-menu",
    SELECTOR_NAVBAR_NAV = ".navbar-nav",
    SELECTOR_VISIBLE_ITEMS = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",
    PLACEMENT_TOP = isRTL() ? "top-end" : "top-start",
    PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end",
    PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start",
    PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end",
    PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start",
    PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start",
    Default$8 = {
      offset: [0, 2],
      boundary: "clippingParents",
      reference: "toggle",
      display: "dynamic",
      popperConfig: null,
      autoClose: !0
    },
    DefaultType$8 = {
      offset: "(array|string|function)",
      boundary: "(string|element)",
      reference: "(string|element|object)",
      display: "string",
      popperConfig: "(null|object|function)",
      autoClose: "(boolean|string)"
    };
  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element), this._popper = null, this._config = this._getConfig(config), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar()
    }
    static get Default() {
      return Default$8
    }
    static get DefaultType() {
      return DefaultType$8
    }
    static get NAME() {
      return NAME$9
    }
    toggle() {
      return this._isShown() ? this.hide() : this.show()
    }
    show() {
      if (isDisabled(this._element) || this._isShown(this._menu)) return;
      const relatedTarget = {
          relatedTarget: this._element
        },
        showEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget).defaultPrevented) return;
      const parent = Dropdown.getParentFromElement(this._element);
      this._inNavbar ? Manipulator.setDataAttribute(this._menu, "popper", "none") : this._createPopper(parent), "ontouchstart" in document.documentElement && !parent.closest(".navbar-nav") && [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, "mouseover", noop)), this._element.focus(), this._element.setAttribute("aria-expanded", !0), this._menu.classList.add("show"), this._element.classList.add("show"), EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget)
    }
    hide() {
      if (isDisabled(this._element) || !this._isShown(this._menu)) return;
      const relatedTarget = {
        relatedTarget: this._element
      };
      this._completeHide(relatedTarget)
    }
    dispose() {
      this._popper && this._popper.destroy(), super.dispose()
    }
    update() {
      this._inNavbar = this._detectNavbar(), this._popper && this._popper.update()
    }
    _completeHide(relatedTarget) {
      const hideEvent = void 0;
      EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget).defaultPrevented || ("ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, "mouseover", noop)), this._popper && this._popper.destroy(), this._menu.classList.remove("show"), this._element.classList.remove("show"), this._element.setAttribute("aria-expanded", "false"), Manipulator.removeDataAttribute(this._menu, "popper"), EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget))
    }
    _getConfig(config) {
      if (config = {
          ...this.constructor.Default,
          ...Manipulator.getDataAttributes(this._element),
          ...config
        }, typeCheckConfig(NAME$9, config, this.constructor.DefaultType), "object" == typeof config.reference && !isElement$1(config.reference) && "function" != typeof config.reference.getBoundingClientRect) throw new TypeError(NAME$9.toUpperCase() + ': Option "reference" provided type "object" without a required "getBoundingClientRect" method.');
      return config
    }
    _createPopper(parent) {
      if (void 0 === Popper) throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
      let referenceElement = this._element;
      "parent" === this._config.reference ? referenceElement = parent : isElement$1(this._config.reference) ? referenceElement = getElement(this._config.reference) : "object" == typeof this._config.reference && (referenceElement = this._config.reference);
      const popperConfig = this._getPopperConfig(),
        isDisplayStatic = popperConfig.modifiers.find(modifier => "applyStyles" === modifier.name && !1 === modifier.enabled);
      this._popper = createPopper(referenceElement, this._menu, popperConfig), isDisplayStatic && Manipulator.setDataAttribute(this._menu, "popper", "static")
    }
    _isShown(element = this._element) {
      return element.classList.contains("show")
    }
    _getMenuElement() {
      return SelectorEngine.next(this._element, SELECTOR_MENU)[0]
    }
    _getPlacement() {
      const parentDropdown = this._element.parentNode;
      if (parentDropdown.classList.contains("dropend")) return PLACEMENT_RIGHT;
      if (parentDropdown.classList.contains("dropstart")) return PLACEMENT_LEFT;
      const isEnd = "end" === getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();
      return parentDropdown.classList.contains("dropup") ? isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP : isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM
    }
    _detectNavbar() {
      return null !== this._element.closest(".navbar")
    }
    _getOffset() {
      const {
        offset: offset
      } = this._config;
      return "string" == typeof offset ? offset.split(",").map(val => Number.parseInt(val, 10)) : "function" == typeof offset ? popperData => offset(popperData, this._element) : offset
    }
    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        }]
      };
      return "static" === this._config.display && (defaultBsPopperConfig.modifiers = [{
        name: "applyStyles",
        enabled: !1
      }]), {
        ...defaultBsPopperConfig,
        ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
      }
    }
    _selectMenuItem({
      key: key,
      target: target
    }) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);
      items.length && getNextActiveElement(items, target, "ArrowDown" === key, !items.includes(target)).focus()
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Dropdown.getOrCreateInstance(this, config);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config]()
        }
      }))
    }
    static clearMenus(event) {
      if (event && (2 === event.button || "keyup" === event.type && "Tab" !== event.key)) return;
      const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);
      for (let i = 0, len = toggles.length; i < len; i++) {
        const context = Dropdown.getInstance(toggles[i]);
        if (!context || !1 === context._config.autoClose) continue;
        if (!context._isShown()) continue;
        const relatedTarget = {
          relatedTarget: context._element
        };
        if (event) {
          const composedPath = event.composedPath(),
            isMenuTarget = composedPath.includes(context._menu);
          if (composedPath.includes(context._element) || "inside" === context._config.autoClose && !isMenuTarget || "outside" === context._config.autoClose && isMenuTarget) continue;
          if (context._menu.contains(event.target) && ("keyup" === event.type && "Tab" === event.key || /input|select|option|textarea|form/i.test(event.target.tagName))) continue;
          "click" === event.type && (relatedTarget.clickEvent = event)
        }
        context._completeHide(relatedTarget)
      }
    }
    static getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode
    }
    static dataApiKeydownHandler(event) {
      if (/input|textarea/i.test(event.target.tagName) ? "Space" === event.key || "Escape" !== event.key && ("ArrowDown" !== event.key && "ArrowUp" !== event.key || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) return;
      const isActive = this.classList.contains("show");
      if (!isActive && "Escape" === event.key) return;
      if (event.preventDefault(), event.stopPropagation(), isDisabled(this)) return;
      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0],
        instance = Dropdown.getOrCreateInstance(getToggleButton);
      if ("Escape" !== event.key) return "ArrowUp" === event.key || "ArrowDown" === event.key ? (isActive || instance.show(), void instance._selectMenuItem(event)) : void(isActive && "Space" !== event.key || Dropdown.clearMenus());
      instance.hide()
    }
  }
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler), EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler), EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus), EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus), EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, (function (event) {
    event.preventDefault(), Dropdown.getOrCreateInstance(this).toggle()
  })), defineJQueryPlugin(Dropdown);
  const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
    SELECTOR_STICKY_CONTENT = ".sticky-top";
  class ScrollBarHelper {
    constructor() {
      this._element = document.body
    }
    getWidth() {
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth)
    }
    hide() {
      const width = this.getWidth();
      this._disableOverFlow(), this._setElementAttributes(this._element, "paddingRight", calculatedValue => calculatedValue + width), this._setElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight", calculatedValue => calculatedValue + width), this._setElementAttributes(".sticky-top", "marginRight", calculatedValue => calculatedValue - width)
    }
    _disableOverFlow() {
      this._saveInitialAttribute(this._element, "overflow"), this._element.style.overflow = "hidden"
    }
    _setElementAttributes(selector, styleProp, callback) {
      const scrollbarWidth = this.getWidth(),
        manipulationCallBack = element => {
          if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) return;
          this._saveInitialAttribute(element, styleProp);
          const calculatedValue = window.getComputedStyle(element)[styleProp];
          element.style[styleProp] = callback(Number.parseFloat(calculatedValue)) + "px"
        };
      this._applyManipulationCallback(selector, manipulationCallBack)
    }
    reset() {
      this._resetElementAttributes(this._element, "overflow"), this._resetElementAttributes(this._element, "paddingRight"), this._resetElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight"), this._resetElementAttributes(".sticky-top", "marginRight")
    }
    _saveInitialAttribute(element, styleProp) {
      const actualValue = element.style[styleProp];
      actualValue && Manipulator.setDataAttribute(element, styleProp, actualValue)
    }
    _resetElementAttributes(selector, styleProp) {
      const manipulationCallBack = element => {
        const value = Manipulator.getDataAttribute(element, styleProp);
        void 0 === value ? element.style.removeProperty(styleProp) : (Manipulator.removeDataAttribute(element, styleProp), element.style[styleProp] = value)
      };
      this._applyManipulationCallback(selector, manipulationCallBack)
    }
    _applyManipulationCallback(selector, callBack) {
      isElement$1(selector) ? callBack(selector) : SelectorEngine.find(selector, this._element).forEach(callBack)
    }
    isOverflowing() {
      return this.getWidth() > 0
    }
  }
  const Default$7 = {
      className: "modal-backdrop",
      isVisible: !0,
      isAnimated: !1,
      rootElement: "body",
      clickCallback: null
    },
    DefaultType$7 = {
      className: "string",
      isVisible: "boolean",
      isAnimated: "boolean",
      rootElement: "(element|string)",
      clickCallback: "(function|null)"
    },
    NAME$8 = "backdrop",
    CLASS_NAME_FADE$4 = "fade",
    CLASS_NAME_SHOW$5 = "show",
    EVENT_MOUSEDOWN = "mousedown.bs." + NAME$8;
  class Backdrop {
    constructor(config) {
      this._config = this._getConfig(config), this._isAppended = !1, this._element = null
    }
    show(callback) {
      this._config.isVisible ? (this._append(), this._config.isAnimated && reflow(this._getElement()), this._getElement().classList.add("show"), this._emulateAnimation(() => {
        execute(callback)
      })) : execute(callback)
    }
    hide(callback) {
      this._config.isVisible ? (this._getElement().classList.remove("show"), this._emulateAnimation(() => {
        this.dispose(), execute(callback)
      })) : execute(callback)
    }
    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement("div");
        backdrop.className = this._config.className, this._config.isAnimated && backdrop.classList.add("fade"), this._element = backdrop
      }
      return this._element
    }
    _getConfig(config) {
      return (config = {
        ...Default$7,
        ..."object" == typeof config ? config : {}
      }).rootElement = getElement(config.rootElement), typeCheckConfig(NAME$8, config, DefaultType$7), config
    }
    _append() {
      this._isAppended || (this._config.rootElement.append(this._getElement()), EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback)
      }), this._isAppended = !0)
    }
    dispose() {
      this._isAppended && (EventHandler.off(this._element, EVENT_MOUSEDOWN), this._element.remove(), this._isAppended = !1)
    }
    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated)
    }
  }
  const Default$6 = {
      trapElement: null,
      autofocus: !0
    },
    DefaultType$6 = {
      trapElement: "element",
      autofocus: "boolean"
    },
    NAME$7 = "focustrap",
    DATA_KEY$7 = void 0,
    EVENT_KEY$7 = ".bs.focustrap",
    EVENT_FOCUSIN$1 = "focusin" + EVENT_KEY$7,
    EVENT_KEYDOWN_TAB = "keydown.tab" + EVENT_KEY$7,
    TAB_KEY = "Tab",
    TAB_NAV_FORWARD = "forward",
    TAB_NAV_BACKWARD = "backward";
  class FocusTrap {
    constructor(config) {
      this._config = this._getConfig(config), this._isActive = !1, this._lastTabNavDirection = null
    }
    activate() {
      const {
        trapElement: trapElement,
        autofocus: autofocus
      } = this._config;
      this._isActive || (autofocus && trapElement.focus(), EventHandler.off(document, EVENT_KEY$7), EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event)), EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event)), this._isActive = !0)
    }
    deactivate() {
      this._isActive && (this._isActive = !1, EventHandler.off(document, EVENT_KEY$7))
    }
    _handleFocusin(event) {
      const {
        target: target
      } = event, {
        trapElement: trapElement
      } = this._config;
      if (target === document || target === trapElement || trapElement.contains(target)) return;
      const elements = SelectorEngine.focusableChildren(trapElement);
      0 === elements.length ? trapElement.focus() : "backward" === this._lastTabNavDirection ? elements[elements.length - 1].focus() : elements[0].focus()
    }
    _handleKeydown(event) {
      "Tab" === event.key && (this._lastTabNavDirection = event.shiftKey ? "backward" : "forward")
    }
    _getConfig(config) {
      return config = {
        ...Default$6,
        ..."object" == typeof config ? config : {}
      }, typeCheckConfig(NAME$7, config, DefaultType$6), config
    }
  }
  const NAME$6 = "modal",
    DATA_KEY$6 = "bs.modal",
    EVENT_KEY$6 = ".bs.modal",
    DATA_API_KEY$3 = ".data-api",
    ESCAPE_KEY$1 = "Escape",
    Default$5 = {
      backdrop: !0,
      keyboard: !0,
      focus: !0
    },
    DefaultType$5 = {
      backdrop: "(boolean|string)",
      keyboard: "boolean",
      focus: "boolean"
    },
    EVENT_HIDE$3 = "hide.bs.modal",
    EVENT_HIDE_PREVENTED = "hidePrevented.bs.modal",
    EVENT_HIDDEN$3 = "hidden.bs.modal",
    EVENT_SHOW$3 = "show.bs.modal",
    EVENT_SHOWN$3 = "shown.bs.modal",
    EVENT_RESIZE = "resize.bs.modal",
    EVENT_CLICK_DISMISS = "click.dismiss.bs.modal",
    EVENT_KEYDOWN_DISMISS$1 = "keydown.dismiss.bs.modal",
    EVENT_MOUSEUP_DISMISS = "mouseup.dismiss.bs.modal",
    EVENT_MOUSEDOWN_DISMISS = "mousedown.dismiss.bs.modal",
    EVENT_CLICK_DATA_API$2 = "click.bs.modal.data-api",
    CLASS_NAME_OPEN = "modal-open",
    CLASS_NAME_FADE$3 = "fade",
    CLASS_NAME_SHOW$4 = "show",
    CLASS_NAME_STATIC = "modal-static",
    OPEN_SELECTOR$1 = ".modal.show",
    SELECTOR_DIALOG = ".modal-dialog",
    SELECTOR_MODAL_BODY = ".modal-body",
    SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element), this._config = this._getConfig(config), this._dialog = SelectorEngine.findOne(".modal-dialog", this._element), this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._isShown = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollBar = new ScrollBarHelper
    }
    static get Default() {
      return Default$5
    }
    static get NAME() {
      return NAME$6
    }
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget)
    }
    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) return;
      const showEvent = void 0;
      EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget: relatedTarget
      }).defaultPrevented || (this._isShown = !0, this._isAnimated() && (this._isTransitioning = !0), this._scrollBar.hide(), document.body.classList.add("modal-open"), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
          event.target === this._element && (this._ignoreBackdropClick = !0)
        })
      }), this._showBackdrop(() => this._showElement(relatedTarget)))
    }
    hide() {
      if (!this._isShown || this._isTransitioning) return;
      const hideEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_HIDE$3).defaultPrevented) return;
      this._isShown = !1;
      const isAnimated = this._isAnimated();
      isAnimated && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), this._focustrap.deactivate(), this._element.classList.remove("show"), EventHandler.off(this._element, EVENT_CLICK_DISMISS), EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS), this._queueCallback(() => this._hideModal(), this._element, isAnimated)
    }
    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, ".bs.modal")), this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose()
    }
    handleUpdate() {
      this._adjustDialog()
    }
    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        isAnimated: this._isAnimated()
      })
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      })
    }
    _getConfig(config) {
      return config = {
        ...Default$5,
        ...Manipulator.getDataAttributes(this._element),
        ..."object" == typeof config ? config : {}
      }, typeCheckConfig(NAME$6, config, DefaultType$5), config
    }
    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated(),
        modalBody = SelectorEngine.findOne(".modal-body", this._dialog);
      this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.append(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.scrollTop = 0, modalBody && (modalBody.scrollTop = 0), isAnimated && reflow(this._element), this._element.classList.add("show");
      const transitionComplete = () => {
        this._config.focus && this._focustrap.activate(), this._isTransitioning = !1, EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget: relatedTarget
        })
      };
      this._queueCallback(transitionComplete, this._dialog, isAnimated)
    }
    _setEscapeEvent() {
      this._isShown ? EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
        this._config.keyboard && "Escape" === event.key ? (event.preventDefault(), this.hide()) : this._config.keyboard || "Escape" !== event.key || this._triggerBackdropTransition()
      }) : EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1)
    }
    _setResizeEvent() {
      this._isShown ? EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog()) : EventHandler.off(window, EVENT_RESIZE)
    }
    _hideModal() {
      this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = !1, this._backdrop.hide(() => {
        document.body.classList.remove("modal-open"), this._resetAdjustments(), this._scrollBar.reset(), EventHandler.trigger(this._element, EVENT_HIDDEN$3)
      })
    }
    _showBackdrop(callback) {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
        this._ignoreBackdropClick ? this._ignoreBackdropClick = !1 : event.target === event.currentTarget && (!0 === this._config.backdrop ? this.hide() : "static" === this._config.backdrop && this._triggerBackdropTransition())
      }), this._backdrop.show(callback)
    }
    _isAnimated() {
      return this._element.classList.contains("fade")
    }
    _triggerBackdropTransition() {
      const hideEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED).defaultPrevented) return;
      const {
        classList: classList,
        scrollHeight: scrollHeight,
        style: style
      } = this._element, isModalOverflowing = scrollHeight > document.documentElement.clientHeight;
      !isModalOverflowing && "hidden" === style.overflowY || classList.contains("modal-static") || (isModalOverflowing || (style.overflowY = "hidden"), classList.add("modal-static"), this._queueCallback(() => {
        classList.remove("modal-static"), isModalOverflowing || this._queueCallback(() => {
          style.overflowY = ""
        }, this._dialog)
      }, this._dialog), this._element.focus())
    }
    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight,
        scrollbarWidth = this._scrollBar.getWidth(),
        isBodyOverflowing = scrollbarWidth > 0;
      (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) && (this._element.style.paddingLeft = scrollbarWidth + "px"), (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) && (this._element.style.paddingRight = scrollbarWidth + "px")
    }
    _resetAdjustments() {
      this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
    }
    static jQueryInterface(config, relatedTarget) {
      return this.each((function () {
        const data = Modal.getOrCreateInstance(this, config);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config](relatedTarget)
        }
      }))
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, (function (event) {
    const target = getElementFromSelector(this);
    ["A", "AREA"].includes(this.tagName) && event.preventDefault(), EventHandler.one(target, EVENT_SHOW$3, showEvent => {
      showEvent.defaultPrevented || EventHandler.one(target, EVENT_HIDDEN$3, () => {
        isVisible(this) && this.focus()
      })
    });
    const allReadyOpen = SelectorEngine.findOne(".modal.show");
    allReadyOpen && Modal.getInstance(allReadyOpen).hide();
    const data = void 0;
    Modal.getOrCreateInstance(target).toggle(this)
  })), enableDismissTrigger(Modal), defineJQueryPlugin(Modal);
  const NAME$5 = "offcanvas",
    DATA_KEY$5 = void 0,
    EVENT_KEY$5 = ".bs.offcanvas",
    DATA_API_KEY$2 = ".data-api",
    EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}.data-api`,
    ESCAPE_KEY = "Escape",
    Default$4 = {
      backdrop: !0,
      keyboard: !0,
      scroll: !1
    },
    DefaultType$4 = {
      backdrop: "boolean",
      keyboard: "boolean",
      scroll: "boolean"
    },
    CLASS_NAME_SHOW$3 = "show",
    CLASS_NAME_BACKDROP = "offcanvas-backdrop",
    OPEN_SELECTOR = ".offcanvas.show",
    EVENT_SHOW$2 = "show" + EVENT_KEY$5,
    EVENT_SHOWN$2 = "shown" + EVENT_KEY$5,
    EVENT_HIDE$2 = "hide" + EVENT_KEY$5,
    EVENT_HIDDEN$2 = "hidden" + EVENT_KEY$5,
    EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}.data-api`,
    EVENT_KEYDOWN_DISMISS = "keydown.dismiss" + EVENT_KEY$5,
    SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element), this._config = this._getConfig(config), this._isShown = !1, this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._addEventListeners()
    }
    static get NAME() {
      return NAME$5
    }
    static get Default() {
      return Default$4
    }
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget)
    }
    show(relatedTarget) {
      if (this._isShown) return;
      const showEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_SHOW$2, {
          relatedTarget: relatedTarget
        }).defaultPrevented) return;
      this._isShown = !0, this._element.style.visibility = "visible", this._backdrop.show(), this._config.scroll || (new ScrollBarHelper).hide(), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.classList.add("show");
      const completeCallBack = () => {
        this._config.scroll || this._focustrap.activate(), EventHandler.trigger(this._element, EVENT_SHOWN$2, {
          relatedTarget: relatedTarget
        })
      };
      this._queueCallback(completeCallBack, this._element, !0)
    }
    hide() {
      if (!this._isShown) return;
      const hideEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_HIDE$2).defaultPrevented) return;
      this._focustrap.deactivate(), this._element.blur(), this._isShown = !1, this._element.classList.remove("show"), this._backdrop.hide();
      const completeCallback = () => {
        this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._element.style.visibility = "hidden", this._config.scroll || (new ScrollBarHelper).reset(), EventHandler.trigger(this._element, EVENT_HIDDEN$2)
      };
      this._queueCallback(completeCallback, this._element, !0)
    }
    dispose() {
      this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose()
    }
    _getConfig(config) {
      return config = {
        ...Default$4,
        ...Manipulator.getDataAttributes(this._element),
        ..."object" == typeof config ? config : {}
      }, typeCheckConfig(NAME$5, config, DefaultType$4), config
    }
    _initializeBackDrop() {
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible: this._config.backdrop,
        isAnimated: !0,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
      })
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      })
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        this._config.keyboard && "Escape" === event.key && this.hide()
      })
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Offcanvas.getOrCreateInstance(this, config);
        if ("string" == typeof config) {
          if (void 0 === data[config] || config.startsWith("_") || "constructor" === config) throw new TypeError(`No method named "${config}"`);
          data[config](this)
        }
      }))
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, (function (event) {
    const target = getElementFromSelector(this);
    if (["A", "AREA"].includes(this.tagName) && event.preventDefault(), isDisabled(this)) return;
    EventHandler.one(target, EVENT_HIDDEN$2, () => {
      isVisible(this) && this.focus()
    });
    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
    allReadyOpen && allReadyOpen !== target && Offcanvas.getInstance(allReadyOpen).hide();
    const data = void 0;
    Offcanvas.getOrCreateInstance(target).toggle(this)
  })), EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show())), enableDismissTrigger(Offcanvas), defineJQueryPlugin(Offcanvas);
  const uriAttributes = new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]),
    ARIA_ATTRIBUTE_PATTERN = void 0,
    SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i,
    DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,
    allowedAttribute = (attribute, allowedAttributeList) => {
      const attributeName = attribute.nodeName.toLowerCase();
      if (allowedAttributeList.includes(attributeName)) return !uriAttributes.has(attributeName) || Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
      const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp);
      for (let i = 0, len = regExp.length; i < len; i++)
        if (regExp[i].test(attributeName)) return !0;
      return !1
    },
    DefaultAllowlist = {
      "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
      a: ["target", "href", "title", "rel"],
      area: [],
      b: [],
      br: [],
      col: [],
      code: [],
      div: [],
      em: [],
      hr: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      i: [],
      img: ["src", "srcset", "alt", "title", "width", "height"],
      li: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      small: [],
      span: [],
      sub: [],
      sup: [],
      strong: [],
      u: [],
      ul: []
    };

  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) return unsafeHtml;
    if (sanitizeFn && "function" == typeof sanitizeFn) return sanitizeFn(unsafeHtml);
    const domParser = void 0,
      createdDocument = (new window.DOMParser).parseFromString(unsafeHtml, "text/html"),
      elements = [].concat(...createdDocument.body.querySelectorAll("*"));
    for (let i = 0, len = elements.length; i < len; i++) {
      const element = elements[i],
        elementName = element.nodeName.toLowerCase();
      if (!Object.keys(allowList).includes(elementName)) {
        element.remove();
        continue
      }
      const attributeList = [].concat(...element.attributes),
        allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
      attributeList.forEach(attribute => {
        allowedAttribute(attribute, allowedAttributes) || element.removeAttribute(attribute.nodeName)
      })
    }
    return createdDocument.body.innerHTML
  }
  const NAME$4 = "tooltip",
    DATA_KEY$4 = void 0,
    EVENT_KEY$4 = ".bs.tooltip",
    CLASS_PREFIX$1 = "bs-tooltip",
    DISALLOWED_ATTRIBUTES = new Set(["sanitize", "allowList", "sanitizeFn"]),
    DefaultType$3 = {
      animation: "boolean",
      template: "string",
      title: "(string|element|function)",
      trigger: "string",
      delay: "(number|object)",
      html: "boolean",
      selector: "(string|boolean)",
      placement: "(string|function)",
      offset: "(array|string|function)",
      container: "(string|element|boolean)",
      fallbackPlacements: "array",
      boundary: "(string|element)",
      customClass: "(string|function)",
      sanitize: "boolean",
      sanitizeFn: "(null|function)",
      allowList: "object",
      popperConfig: "(null|object|function)"
    },
    AttachmentMap = {
      AUTO: "auto",
      TOP: "top",
      RIGHT: isRTL() ? "left" : "right",
      BOTTOM: "bottom",
      LEFT: isRTL() ? "right" : "left"
    },
    Default$3 = {
      animation: !0,
      template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger: "hover focus",
      title: "",
      delay: 0,
      html: !1,
      selector: !1,
      placement: "top",
      offset: [0, 0],
      container: !1,
      fallbackPlacements: ["top", "right", "bottom", "left"],
      boundary: "clippingParents",
      customClass: "",
      sanitize: !0,
      sanitizeFn: null,
      allowList: DefaultAllowlist,
      popperConfig: null
    },
    Event$2 = {
      HIDE: "hide" + EVENT_KEY$4,
      HIDDEN: "hidden" + EVENT_KEY$4,
      SHOW: "show" + EVENT_KEY$4,
      SHOWN: "shown" + EVENT_KEY$4,
      INSERTED: "inserted" + EVENT_KEY$4,
      CLICK: "click" + EVENT_KEY$4,
      FOCUSIN: "focusin" + EVENT_KEY$4,
      FOCUSOUT: "focusout" + EVENT_KEY$4,
      MOUSEENTER: "mouseenter" + EVENT_KEY$4,
      MOUSELEAVE: "mouseleave" + EVENT_KEY$4
    },
    CLASS_NAME_FADE$2 = "fade",
    CLASS_NAME_MODAL = "modal",
    CLASS_NAME_SHOW$2 = "show",
    HOVER_STATE_SHOW = "show",
    HOVER_STATE_OUT = "out",
    SELECTOR_TOOLTIP_INNER = ".tooltip-inner",
    SELECTOR_MODAL = ".modal",
    EVENT_MODAL_HIDE = "hide.bs.modal",
    TRIGGER_HOVER = "hover",
    TRIGGER_FOCUS = "focus",
    TRIGGER_CLICK = "click",
    TRIGGER_MANUAL = "manual";
  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (void 0 === Popper) throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
      super(element), this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this._config = this._getConfig(config), this.tip = null, this._setListeners()
    }
    static get Default() {
      return Default$3
    }
    static get NAME() {
      return NAME$4
    }
    static get Event() {
      return Event$2
    }
    static get DefaultType() {
      return DefaultType$3
    }
    enable() {
      this._isEnabled = !0
    }
    disable() {
      this._isEnabled = !1
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled
    }
    toggle(event) {
      if (this._isEnabled)
        if (event) {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger.click = !context._activeTrigger.click, context._isWithActiveTrigger() ? context._enter(null, context) : context._leave(null, context)
        } else {
          if (this.getTipElement().classList.contains("show")) return void this._leave(null, this);
          this._enter(null, this)
        }
    }
    dispose() {
      clearTimeout(this._timeout), EventHandler.off(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this.tip && this.tip.remove(), this._disposePopper(), super.dispose()
    }
    show() {
      if ("none" === this._element.style.display) throw new Error("Please use show on visible elements");
      if (!this.isWithContent() || !this._isEnabled) return;
      const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW),
        shadowRoot = findShadowRoot(this._element),
        isInTheDom = null === shadowRoot ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);
      if (showEvent.defaultPrevented || !isInTheDom) return;
      "tooltip" === this.constructor.NAME && this.tip && this.getTitle() !== this.tip.querySelector(".tooltip-inner").innerHTML && (this._disposePopper(), this.tip.remove(), this.tip = null);
      const tip = this.getTipElement(),
        tipId = getUID(this.constructor.NAME);
      tip.setAttribute("id", tipId), this._element.setAttribute("aria-describedby", tipId), this._config.animation && tip.classList.add("fade");
      const placement = "function" == typeof this._config.placement ? this._config.placement.call(this, tip, this._element) : this._config.placement,
        attachment = this._getAttachment(placement);
      this._addAttachmentClass(attachment);
      const {
        container: container
      } = this._config;
      Data.set(tip, this.constructor.DATA_KEY, this), this._element.ownerDocument.documentElement.contains(this.tip) || (container.append(tip), EventHandler.trigger(this._element, this.constructor.Event.INSERTED)), this._popper ? this._popper.update() : this._popper = createPopper(this._element, tip, this._getPopperConfig(attachment)), tip.classList.add("show");
      const customClass = this._resolvePossibleFunction(this._config.customClass);
      customClass && tip.classList.add(...customClass.split(" ")), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach(element => {
        EventHandler.on(element, "mouseover", noop)
      });
      const complete = () => {
          const prevHoverState = this._hoverState;
          this._hoverState = null, EventHandler.trigger(this._element, this.constructor.Event.SHOWN), "out" === prevHoverState && this._leave(null, this)
        },
        isAnimated = this.tip.classList.contains("fade");
      this._queueCallback(complete, this.tip, isAnimated)
    }
    hide() {
      if (!this._popper) return;
      const tip = this.getTipElement(),
        complete = () => {
          this._isWithActiveTrigger() || ("show" !== this._hoverState && tip.remove(), this._cleanTipClass(), this._element.removeAttribute("aria-describedby"), EventHandler.trigger(this._element, this.constructor.Event.HIDDEN), this._disposePopper())
        },
        hideEvent = void 0;
      if (EventHandler.trigger(this._element, this.constructor.Event.HIDE).defaultPrevented) return;
      tip.classList.remove("show"), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach(element => EventHandler.off(element, "mouseover", noop)), this._activeTrigger.click = !1, this._activeTrigger.focus = !1, this._activeTrigger.hover = !1;
      const isAnimated = this.tip.classList.contains("fade");
      this._queueCallback(complete, this.tip, isAnimated), this._hoverState = ""
    }
    update() {
      null !== this._popper && this._popper.update()
    }
    isWithContent() {
      return Boolean(this.getTitle())
    }
    getTipElement() {
      if (this.tip) return this.tip;
      const element = document.createElement("div");
      element.innerHTML = this._config.template;
      const tip = element.children[0];
      return this.setContent(tip), tip.classList.remove("fade", "show"), this.tip = tip, this.tip
    }
    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), ".tooltip-inner")
    }
    _sanitizeAndSetContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);
      content || !templateElement ? this.setElementContent(templateElement, content) : templateElement.remove()
    }
    setElementContent(element, content) {
      if (null !== element) return isElement$1(content) ? (content = getElement(content), void(this._config.html ? content.parentNode !== element && (element.innerHTML = "", element.append(content)) : element.textContent = content.textContent)) : void(this._config.html ? (this._config.sanitize && (content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn)), element.innerHTML = content) : element.textContent = content)
    }
    getTitle() {
      const title = this._element.getAttribute("data-bs-original-title") || this._config.title;
      return this._resolvePossibleFunction(title)
    }
    updateAttachment(attachment) {
      return "right" === attachment ? "end" : "left" === attachment ? "start" : attachment
    }
    _initializeOnDelegatedTarget(event, context) {
      return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig())
    }
    _getOffset() {
      const {
        offset: offset
      } = this._config;
      return "string" == typeof offset ? offset.split(",").map(val => Number.parseInt(val, 10)) : "function" == typeof offset ? popperData => offset(popperData, this._element) : offset
    }
    _resolvePossibleFunction(content) {
      return "function" == typeof content ? content.call(this._element) : content
    }
    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: "flip",
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        }, {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: "arrow",
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: "onChange",
          enabled: !0,
          phase: "afterWrite",
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          data.options.placement !== data.placement && this._handlePopperPlacementChange(data)
        }
      };
      return {
        ...defaultBsPopperConfig,
        ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
      }
    }
    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`)
    }
    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()]
    }
    _setListeners() {
      const triggers = void 0;
      this._config.trigger.split(" ").forEach(trigger => {
        if ("click" === trigger) EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
        else if ("manual" !== trigger) {
          const eventIn = "hover" === trigger ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN,
            eventOut = "hover" === trigger ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event)), EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event))
        }
      }), this._hideModalHandler = () => {
        this._element && this.hide()
      }, EventHandler.on(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this._config.selector ? this._config = {
        ...this._config,
        trigger: "manual",
        selector: ""
      } : this._fixTitle()
    }
    _fixTitle() {
      const title = this._element.getAttribute("title"),
        originalTitleType = typeof this._element.getAttribute("data-bs-original-title");
      (title || "string" !== originalTitleType) && (this._element.setAttribute("data-bs-original-title", title || ""), !title || this._element.getAttribute("aria-label") || this._element.textContent || this._element.setAttribute("aria-label", title), this._element.setAttribute("title", ""))
    }
    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context), event && (context._activeTrigger["focusin" === event.type ? "focus" : "hover"] = !0), context.getTipElement().classList.contains("show") || "show" === context._hoverState ? context._hoverState = "show" : (clearTimeout(context._timeout), context._hoverState = "show", context._config.delay && context._config.delay.show ? context._timeout = setTimeout(() => {
        "show" === context._hoverState && context.show()
      }, context._config.delay.show) : context.show())
    }
    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context), event && (context._activeTrigger["focusout" === event.type ? "focus" : "hover"] = context._element.contains(event.relatedTarget)), context._isWithActiveTrigger() || (clearTimeout(context._timeout), context._hoverState = "out", context._config.delay && context._config.delay.hide ? context._timeout = setTimeout(() => {
        "out" === context._hoverState && context.hide()
      }, context._config.delay.hide) : context.hide())
    }
    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger)
        if (this._activeTrigger[trigger]) return !0;
      return !1
    }
    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      return Object.keys(dataAttributes).forEach(dataAttr => {
        DISALLOWED_ATTRIBUTES.has(dataAttr) && delete dataAttributes[dataAttr]
      }), (config = {
        ...this.constructor.Default,
        ...dataAttributes,
        ..."object" == typeof config && config ? config : {}
      }).container = !1 === config.container ? document.body : getElement(config.container), "number" == typeof config.delay && (config.delay = {
        show: config.delay,
        hide: config.delay
      }), "number" == typeof config.title && (config.title = config.title.toString()), "number" == typeof config.content && (config.content = config.content.toString()), typeCheckConfig(NAME$4, config, this.constructor.DefaultType), config.sanitize && (config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn)), config
    }
    _getDelegateConfig() {
      const config = {};
      for (const key in this._config) this.constructor.Default[key] !== this._config[key] && (config[key] = this._config[key]);
      return config
    }
    _cleanTipClass() {
      const tip = this.getTipElement(),
        basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, "g"),
        tabClass = tip.getAttribute("class").match(basicClassPrefixRegex);
      null !== tabClass && tabClass.length > 0 && tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass))
    }
    _getBasicClassPrefix() {
      return "bs-tooltip"
    }
    _handlePopperPlacementChange(popperData) {
      const {
        state: state
      } = popperData;
      state && (this.tip = state.elements.popper, this._cleanTipClass(), this._addAttachmentClass(this._getAttachment(state.placement)))
    }
    _disposePopper() {
      this._popper && (this._popper.destroy(), this._popper = null)
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Tooltip.getOrCreateInstance(this, config);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config]()
        }
      }))
    }
  }
  defineJQueryPlugin(Tooltip);
  const NAME$3 = "popover",
    DATA_KEY$3 = void 0,
    EVENT_KEY$3 = ".bs.popover",
    CLASS_PREFIX = "bs-popover",
    Default$2 = {
      ...Tooltip.Default,
      placement: "right",
      offset: [0, 8],
      trigger: "click",
      content: "",
      template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
    },
    DefaultType$2 = {
      ...Tooltip.DefaultType,
      content: "(string|element|function)"
    },
    Event$1 = {
      HIDE: "hide" + EVENT_KEY$3,
      HIDDEN: "hidden" + EVENT_KEY$3,
      SHOW: "show" + EVENT_KEY$3,
      SHOWN: "shown" + EVENT_KEY$3,
      INSERTED: "inserted" + EVENT_KEY$3,
      CLICK: "click" + EVENT_KEY$3,
      FOCUSIN: "focusin" + EVENT_KEY$3,
      FOCUSOUT: "focusout" + EVENT_KEY$3,
      MOUSEENTER: "mouseenter" + EVENT_KEY$3,
      MOUSELEAVE: "mouseleave" + EVENT_KEY$3
    },
    SELECTOR_TITLE = ".popover-header",
    SELECTOR_CONTENT = ".popover-body";
  class Popover extends Tooltip {
    static get Default() {
      return Default$2
    }
    static get NAME() {
      return NAME$3
    }
    static get Event() {
      return Event$1
    }
    static get DefaultType() {
      return DefaultType$2
    }
    isWithContent() {
      return this.getTitle() || this._getContent()
    }
    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE), this._sanitizeAndSetContent(tip, this._getContent(), ".popover-body")
    }
    _getContent() {
      return this._resolvePossibleFunction(this._config.content)
    }
    _getBasicClassPrefix() {
      return "bs-popover"
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Popover.getOrCreateInstance(this, config);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config]()
        }
      }))
    }
  }
  defineJQueryPlugin(Popover);
  const NAME$2 = "scrollspy",
    DATA_KEY$2 = void 0,
    EVENT_KEY$2 = ".bs.scrollspy",
    DATA_API_KEY$1 = ".data-api",
    Default$1 = {
      offset: 10,
      method: "auto",
      target: ""
    },
    DefaultType$1 = {
      offset: "number",
      method: "string",
      target: "(string|element)"
    },
    EVENT_ACTIVATE = "activate" + EVENT_KEY$2,
    EVENT_SCROLL = "scroll" + EVENT_KEY$2,
    EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}.data-api`,
    CLASS_NAME_DROPDOWN_ITEM = "dropdown-item",
    CLASS_NAME_ACTIVE$1 = "active",
    SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]',
    SELECTOR_NAV_LIST_GROUP$1 = ".nav, .list-group",
    SELECTOR_NAV_LINKS = ".nav-link",
    SELECTOR_NAV_ITEMS = ".nav-item",
    SELECTOR_LIST_ITEMS = ".list-group-item",
    SELECTOR_LINK_ITEMS = ".nav-link, .list-group-item, .dropdown-item",
    SELECTOR_DROPDOWN$1 = ".dropdown",
    SELECTOR_DROPDOWN_TOGGLE$1 = ".dropdown-toggle",
    METHOD_OFFSET = "offset",
    METHOD_POSITION = "position";
  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element), this._scrollElement = "BODY" === this._element.tagName ? window : this._element, this._config = this._getConfig(config), this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process()), this.refresh(), this._process()
    }
    static get Default() {
      return Default$1
    }
    static get NAME() {
      return NAME$2
    }
    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? "offset" : "position",
        offsetMethod = "auto" === this._config.method ? autoMethod : this._config.method,
        offsetBase = "position" === offsetMethod ? this._getScrollTop() : 0;
      this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight();
      const targets = void 0;
      SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).map(element => {
        const targetSelector = getSelectorFromElement(element),
          target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;
        if (target) {
          const targetBCR = target.getBoundingClientRect();
          if (targetBCR.width || targetBCR.height) return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector]
        }
        return null
      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]), this._targets.push(item[1])
      })
    }
    dispose() {
      EventHandler.off(this._scrollElement, EVENT_KEY$2), super.dispose()
    }
    _getConfig(config) {
      return (config = {
        ...Default$1,
        ...Manipulator.getDataAttributes(this._element),
        ..."object" == typeof config && config ? config : {}
      }).target = getElement(config.target) || document.documentElement, typeCheckConfig(NAME$2, config, DefaultType$1), config
    }
    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
    }
    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    }
    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
    }
    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset,
        scrollHeight = this._getScrollHeight(),
        maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();
      if (this._scrollHeight !== scrollHeight && this.refresh(), scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];
        this._activeTarget !== target && this._activate(target)
      } else {
        if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) return this._activeTarget = null, void this._clear();
        for (let i = this._offsets.length; i--;) {
          const isActiveTarget = void 0;
          this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (void 0 === this._offsets[i + 1] || scrollTop < this._offsets[i + 1]) && this._activate(this._targets[i])
        }
      }
    }
    _activate(target) {
      this._activeTarget = target, this._clear();
      const queries = SELECTOR_LINK_ITEMS.split(",").map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`),
        link = SelectorEngine.findOne(queries.join(","), this._config.target);
      link.classList.add("active"), link.classList.contains("dropdown-item") ? SelectorEngine.findOne(".dropdown-toggle", link.closest(".dropdown")).classList.add("active") : SelectorEngine.parents(link, ".nav, .list-group").forEach(listGroup => {
        SelectorEngine.prev(listGroup, ".nav-link, .list-group-item").forEach(item => item.classList.add("active")), SelectorEngine.prev(listGroup, ".nav-item").forEach(navItem => {
          SelectorEngine.children(navItem, ".nav-link").forEach(item => item.classList.add("active"))
        })
      }), EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      })
    }
    _clear() {
      SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains("active")).forEach(node => node.classList.remove("active"))
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = ScrollSpy.getOrCreateInstance(this, config);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config]()
        }
      }))
    }
  }
  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy))
  }), defineJQueryPlugin(ScrollSpy);
  const NAME$1 = "tab",
    DATA_KEY$1 = "bs.tab",
    EVENT_KEY$1 = ".bs.tab",
    DATA_API_KEY = ".data-api",
    EVENT_HIDE$1 = "hide.bs.tab",
    EVENT_HIDDEN$1 = "hidden.bs.tab",
    EVENT_SHOW$1 = "show.bs.tab",
    EVENT_SHOWN$1 = "shown.bs.tab",
    EVENT_CLICK_DATA_API = "click.bs.tab.data-api",
    CLASS_NAME_DROPDOWN_MENU = "dropdown-menu",
    CLASS_NAME_ACTIVE = "active",
    CLASS_NAME_FADE$1 = "fade",
    CLASS_NAME_SHOW$1 = "show",
    SELECTOR_DROPDOWN = ".dropdown",
    SELECTOR_NAV_LIST_GROUP = ".nav, .list-group",
    SELECTOR_ACTIVE = ".active",
    SELECTOR_ACTIVE_UL = ":scope > li > .active",
    SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',
    SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle",
    SELECTOR_DROPDOWN_ACTIVE_CHILD = ":scope > .dropdown-menu .active";
  class Tab extends BaseComponent {
    static get NAME() {
      return "tab"
    }
    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains("active")) return;
      let previous;
      const target = getElementFromSelector(this._element),
        listElement = this._element.closest(".nav, .list-group");
      if (listElement) {
        const itemSelector = "UL" === listElement.nodeName || "OL" === listElement.nodeName ? SELECTOR_ACTIVE_UL : ".active";
        previous = SelectorEngine.find(itemSelector, listElement), previous = previous[previous.length - 1]
      }
      const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
          relatedTarget: this._element
        }) : null,
        showEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_SHOW$1, {
          relatedTarget: previous
        }).defaultPrevented || null !== hideEvent && hideEvent.defaultPrevented) return;
      this._activate(this._element, listElement);
      const complete = () => {
        EventHandler.trigger(previous, EVENT_HIDDEN$1, {
          relatedTarget: this._element
        }), EventHandler.trigger(this._element, EVENT_SHOWN$1, {
          relatedTarget: previous
        })
      };
      target ? this._activate(target, target.parentNode, complete) : complete()
    }
    _activate(element, container, callback) {
      const activeElements = void 0,
        active = (!container || "UL" !== container.nodeName && "OL" !== container.nodeName ? SelectorEngine.children(container, ".active") : SelectorEngine.find(SELECTOR_ACTIVE_UL, container))[0],
        isTransitioning = callback && active && active.classList.contains("fade"),
        complete = () => this._transitionComplete(element, active, callback);
      active && isTransitioning ? (active.classList.remove("show"), this._queueCallback(complete, element, !0)) : complete()
    }
    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove("active");
        const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);
        dropdownChild && dropdownChild.classList.remove("active"), "tab" === active.getAttribute("role") && active.setAttribute("aria-selected", !1)
      }
      element.classList.add("active"), "tab" === element.getAttribute("role") && element.setAttribute("aria-selected", !0), reflow(element), element.classList.contains("fade") && element.classList.add("show");
      let parent = element.parentNode;
      if (parent && "LI" === parent.nodeName && (parent = parent.parentNode), parent && parent.classList.contains("dropdown-menu")) {
        const dropdownElement = element.closest(".dropdown");
        dropdownElement && SelectorEngine.find(".dropdown-toggle", dropdownElement).forEach(dropdown => dropdown.classList.add("active")), element.setAttribute("aria-expanded", !0)
      }
      callback && callback()
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Tab.getOrCreateInstance(this);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config]()
        }
      }))
    }
  }
  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, (function (event) {
    if (["A", "AREA"].includes(this.tagName) && event.preventDefault(), isDisabled(this)) return;
    const data = void 0;
    Tab.getOrCreateInstance(this).show()
  })), defineJQueryPlugin(Tab);
  const NAME = "toast",
    DATA_KEY = void 0,
    EVENT_KEY = ".bs.toast",
    EVENT_MOUSEOVER = "mouseover" + EVENT_KEY,
    EVENT_MOUSEOUT = "mouseout" + EVENT_KEY,
    EVENT_FOCUSIN = "focusin" + EVENT_KEY,
    EVENT_FOCUSOUT = "focusout" + EVENT_KEY,
    EVENT_HIDE = "hide" + EVENT_KEY,
    EVENT_HIDDEN = "hidden" + EVENT_KEY,
    EVENT_SHOW = "show" + EVENT_KEY,
    EVENT_SHOWN = "shown" + EVENT_KEY,
    CLASS_NAME_FADE = "fade",
    CLASS_NAME_HIDE = "hide",
    CLASS_NAME_SHOW = "show",
    CLASS_NAME_SHOWING = "showing",
    DefaultType = {
      animation: "boolean",
      autohide: "boolean",
      delay: "number"
    },
    Default = {
      animation: !0,
      autohide: !0,
      delay: 5e3
    };
  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element), this._config = this._getConfig(config), this._timeout = null, this._hasMouseInteraction = !1, this._hasKeyboardInteraction = !1, this._setListeners()
    }
    static get DefaultType() {
      return DefaultType
    }
    static get Default() {
      return Default
    }
    static get NAME() {
      return NAME
    }
    show() {
      const showEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_SHOW).defaultPrevented) return;
      this._clearTimeout(), this._config.animation && this._element.classList.add("fade");
      const complete = () => {
        this._element.classList.remove("showing"), EventHandler.trigger(this._element, EVENT_SHOWN), this._maybeScheduleHide()
      };
      this._element.classList.remove("hide"), reflow(this._element), this._element.classList.add("show"), this._element.classList.add("showing"), this._queueCallback(complete, this._element, this._config.animation)
    }
    hide() {
      if (!this._element.classList.contains("show")) return;
      const hideEvent = void 0;
      if (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented) return;
      const complete = () => {
        this._element.classList.add("hide"), this._element.classList.remove("showing"), this._element.classList.remove("show"), EventHandler.trigger(this._element, EVENT_HIDDEN)
      };
      this._element.classList.add("showing"), this._queueCallback(complete, this._element, this._config.animation)
    }
    dispose() {
      this._clearTimeout(), this._element.classList.contains("show") && this._element.classList.remove("show"), super.dispose()
    }
    _getConfig(config) {
      return config = {
        ...Default,
        ...Manipulator.getDataAttributes(this._element),
        ..."object" == typeof config && config ? config : {}
      }, typeCheckConfig(NAME, config, this.constructor.DefaultType), config
    }
    _maybeScheduleHide() {
      this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout(() => {
        this.hide()
      }, this._config.delay)))
    }
    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case "mouseover":
        case "mouseout":
          this._hasMouseInteraction = isInteracting;
          break;
        case "focusin":
        case "focusout":
          this._hasKeyboardInteraction = isInteracting
      }
      if (isInteracting) return void this._clearTimeout();
      const nextElement = event.relatedTarget;
      this._element === nextElement || this._element.contains(nextElement) || this._maybeScheduleHide()
    }
    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, !0)), EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, !1)), EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, !0)), EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, !1))
    }
    _clearTimeout() {
      clearTimeout(this._timeout), this._timeout = null
    }
    static jQueryInterface(config) {
      return this.each((function () {
        const data = Toast.getOrCreateInstance(this, config);
        if ("string" == typeof config) {
          if (void 0 === data[config]) throw new TypeError(`No method named "${config}"`);
          data[config](this)
        }
      }))
    }
  }
  enableDismissTrigger(Toast), defineJQueryPlugin(Toast);
  const index_umd = void 0;
  return {
    Alert: Alert,
    Button: Button,
    Carousel: Carousel,
    Collapse: Collapse,
    Dropdown: Dropdown,
    Modal: Modal,
    Offcanvas: Offcanvas,
    Popover: Popover,
    ScrollSpy: ScrollSpy,
    Tab: Tab,
    Toast: Toast,
    Tooltip: Tooltip
  }
}));