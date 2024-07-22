const hookSym = Symbol('refHook')
const hookListSym = Symbol('refList')
const valueSym = Symbol('refValue')
const refProto = {
    [hookSym]: function (callback) {
      if (this[hookListSym].includes(callback)) {
        const index = this[hookListSym].indexOf(callback)
        this[hookListSym].splice(index, 1)
      } else {
   this[hookListSym].push(callback)
      }
    }
}
Object.defineProperty(refProto, 'value', {
  get() {
    return this[valueSym]
  },
  set(value) {
    if (value == this[valueSym])
      return;
    this[valueSym] = value
    this[hookListSym].forEach(cb => cb())
  }
})
const ref = (v) => {
  const o = Object.create(refProto, {
    [valueSym]: {
      value:v,
      writable:true
    },
    [hookListSym]: {
      value: []
    }
  })
  return o
}
const isRef = (o) => refProto.isPrototypeOf(o)
