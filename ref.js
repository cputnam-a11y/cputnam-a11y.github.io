const hookSym = Symbol('refHook')
const hookListSym = Symbol('refList')
const valueSym = Symbol('refValue')
// define the reg proto
const refProto = {
    // the hookSym is a function that we call to register/deregister our mutation callback
    [hookSym]: function (callback) {
      // if added prior, remove
      if (this[hookListSym].includes(callback)) {
        const index = this[hookListSym].indexOf(callback)
        this[hookListSym].splice(index, 1)
      } else {
          // else add
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
                value: v,
                writable: true
              },
              [hookListSym]: {
                value: []
              }
            })
  return o
}
const isRef = (o) => refProto.isPrototypeOf(o)
const toTextNode = (textRef) => {
  const textNodeRef = ref(document.createTextNode(textRef.value))
  textRef[hookSym](() => {
    textNodeRef.value = document.createTextNode(textRef.value)
  })
  return textNodeRef
}
