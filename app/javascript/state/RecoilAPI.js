export const RecoilAPIv2 = (() => {
  const _defaultSetter =  (stack) => {
    return () => {
      throw "Implementation for '" + stack + "' is not set";
    }
  }
  let stackSetter = _defaultSetter('stack');
  const setStackSetter = (setter) => {
    stackSetter = setter || _defaultSetter('stack')
  }

  return {
    stackSetter: stackSetter,
    setStackSetter: setStackSetter
  }
})();

export const RecoilAPI = RecoilAPIv2

// this over-engineer solution has been left here so I can write a blog post about it at some stage in the future
export const RecoilAPIv1 ={
  _setSetter: (setterType) => {
    return (setter) => {
      if(setter === null) {
        this[setterType + 'Setter'] = this._defaultSetter(setterType)
      } else {
        this[setterType + 'Setter'] = setter
        while(this._pendingSettings[setterType].length > 0) {
          let [fn, ...args] = this._pendingSettings[setterType].unshift()
          setter(...args)(fn)
        }
      }
    }
  },
  _defaultSetter: (setterType) => {
    return (...args) => {
      return (fn) => {
        this._pendingSettings[setterType].push(fn, ...args)
      }
    }
  },
  _pendingSettings: {
    stack: []
  }
}
RecoilAPIv1.stackSetter =    RecoilAPIv1._defaultSetter('stack');
RecoilAPIv1.setStackSetter = RecoilAPIv1._setSetter('stack');

