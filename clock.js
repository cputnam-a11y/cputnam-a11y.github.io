import dayjs from "https://esm.sh/dayjs";
import UTC from "https://esm.sh/dayjs-plugin-utc";
dayjs.extend(UTC);
class Clock extends HTMLElement {
  #tickFlag = true;
  static observedAttributes = ['offset', 'format']
  constructor() {
    super()
  }
  connectedCallback() {
    this.render()
  }
  render() {
    if (!this.#tickFlag) {
      this.#tickFlag = true;
      return;
    }
    this.textContent = 
      dayjs().utc()
      .utcOffset(Number(this.getAttribute('offset')) || 0)
      .format(this.getAttribute("format") || "hh mm ss a")
    requestAnimationFrame(this.render.bind(this))
  }
  disconnectedCallback() {
    this.#tickFlag = false;
  }
}
export const define = () => customElements.define('custom-clock', Clock);
