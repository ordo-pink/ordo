import { Nullable, ThunkFn } from "@ordo-pink/common-types"
import { Children, Component, ComponentType, createElement, PropsWithChildren } from "react"

type LoadState = {
  loading: boolean
  loaded: Nullable<ComponentType>
  error: Nullable<Error>
  promise: Promise<ComponentType>
}

type LoadMapState = {
  loading: boolean
  loaded: Record<string, Nullable<ComponentType>>
  error: Nullable<Error>
  promise: Promise<ComponentType[]>
}

type LoadableComponentState = {
  error: Nullable<Error>
  pastDelay: boolean
  timedOut: boolean
  loading: boolean
  loaded: Nullable<ComponentType>
}

const ALL_INITIALIZERS: ThunkFn<Promise<ComponentType>>[] = []
const READY_INITIALIZERS: ThunkFn<Promise<ComponentType>>[] = []

function isWebpackReady() {
  return true
}

function load(loader: ThunkFn<Promise<ComponentType>>) {
  const promise = loader()

  const state: LoadState = {
    loading: true,
    loaded: null,
    error: null,
    promise: promise
      .then((loaded) => {
        state.loading = false
        state.loaded = loaded
        return loaded
      })
      .catch((err) => {
        state.loading = false
        state.error = err
        throw err
      }),
  }

  return state
}

function loadMap(obj: Record<string, ThunkFn<Promise<ComponentType>>>) {
  const state: LoadMapState = {
    loading: false,
    loaded: {},
    error: null,
    promise: Promise.reject("Not ready"),
  }

  const promises: Promise<ComponentType>[] = []

  try {
    Object.keys(obj).forEach((key) => {
      const result = load(obj[key])

      if (!result.loading) {
        state.loaded[key] = result.loaded
        state.error = result.error
      } else {
        state.loading = true
      }

      promises.push(result.promise)

      result.promise &&
        result.promise
          .then((res) => {
            state.loaded[key] = res
          })
          .catch((err) => {
            state.error = err
          })
    })
  } catch (err) {
    state.error = err as Error
  }

  state.promise = Promise.all(promises)
    .then((res) => {
      state.loading = false
      return res
    })
    .catch((err) => {
      state.loading = false
      throw err
    })

  return state
}

function resolve(obj: any) {
  return obj && obj.default
}

function render(loaded: Promise<ComponentType>, props: any) {
  return createElement(resolve(loaded), props)
}

function createLoadableComponent(
  loadFn: any,
  options = {
    loader: null,
    loading: null,
    delay: 200,
    timeout: null,
    render: render,
    webpack: null,
    modules: [],
  },
) {
  if (!options.loading) {
    throw new Error("react-loadable requires a `loading` component")
  }

  const opts = Object.assign(
    {
      loader: null,
      loading: null,
      delay: 200,
      timeout: null,
      render: render,
      webpack: null,
      modules: [],
    },
    options,
  )

  let res: any = null

  function init() {
    if (!res) {
      res = loadFn(opts.loader)
    }

    return res.promise
  }

  ALL_INITIALIZERS.push(init)

  READY_INITIALIZERS.push(() => {
    return init()
  })

  return class LoadableComponent extends Component<any, LoadableComponentState> {
    private _mounted!: boolean
    private _delay!: ReturnType<typeof setTimeout>
    private _timeout!: ReturnType<typeof setTimeout>
    context: any

    constructor(props: any) {
      super(props)
      init()

      this.state = {
        error: res.error,
        pastDelay: false,
        timedOut: false,
        loading: res.loading,
        loaded: res.loaded,
      }
    }

    static preload() {
      return init()
    }

    UNSAFE_componentWillMount() {
      this._loadModule()
    }

    componentDidMount() {
      this._mounted = true
    }

    _loadModule() {
      if (this.context.loadable && Array.isArray(opts.modules)) {
        opts.modules.forEach((moduleName) => {
          this.context.loadable.report(moduleName)
        })
      }

      if (!res.loading) {
        return
      }

      const setStateWithMountCheck = (newState: LoadableComponentState) => {
        if (!this._mounted) {
          return
        }

        this.setState(newState)
      }

      if (typeof opts.delay === "number") {
        if (opts.delay === 0) {
          this.setState({ pastDelay: true })
        } else {
          this._delay = setTimeout(() => {
            setStateWithMountCheck({ pastDelay: true } as LoadableComponentState)
          }, opts.delay)
        }
      }

      if (typeof opts.timeout === "number") {
        this._timeout = setTimeout(() => {
          setStateWithMountCheck({ timedOut: true } as LoadableComponentState)
        }, opts.timeout)
      }

      const update = () => {
        setStateWithMountCheck({
          error: res.error,
          loaded: res.loaded,
          loading: res.loading,
        } as LoadableComponentState)

        this._clearTimeouts()
      }

      res.promise
        .then(() => {
          update()
          return null
        })
        .catch(() => {
          update()
          return null
        })
    }

    componentWillUnmount() {
      this._mounted = false
      this._clearTimeouts()
    }

    _clearTimeouts() {
      clearTimeout(this._delay)
      clearTimeout(this._timeout)
    }

    retry = () => {
      this.setState({ error: null, loading: true, timedOut: false })
      res = loadFn(opts.loader)
      this._loadModule()
    }

    render() {
      if (this.state.loading || this.state.error) {
        return createElement(opts.loading as any, {
          isLoading: this.state.loading,
          pastDelay: this.state.pastDelay,
          timedOut: this.state.timedOut,
          error: this.state.error,
          retry: this.retry,
        })
      } else if (this.state.loaded) {
        return opts.render(this.state.loaded as any, this.props)
      } else {
        return null
      }
    }
  }
}

export default function Loadable(opts: any) {
  return createLoadableComponent(load, opts)
}

function LoadableMap(opts: any) {
  if (typeof opts.render !== "function") {
    throw new Error("LoadableMap requires a `render(loaded, props)` function")
  }

  return createLoadableComponent(loadMap, opts)
}

Loadable.Map = LoadableMap

class Capture extends Component<
  PropsWithChildren<{
    report: any
  }>
> {
  getChildContext() {
    return {
      loadable: {
        report: this.props.report,
      },
    }
  }

  render() {
    return Children.only(this.props.children)
  }
}

Loadable.Capture = Capture

function flushInitializers(initializers: typeof ALL_INITIALIZERS): Promise<ComponentType[]> {
  const promises = [] as Promise<ComponentType>[]

  while (initializers.length) {
    const init = initializers.pop()

    if (!init) continue

    promises.push(init())
  }

  return Promise.all(promises).then(() => {
    if (initializers.length) {
      return flushInitializers(initializers)
    }
  }) as Promise<ComponentType[]>
}

Loadable.preloadAll = () => {
  return new Promise((resolve, reject) => {
    flushInitializers(ALL_INITIALIZERS).then(resolve, reject)
  })
}

Loadable.preloadReady = () => {
  return new Promise((resolve, reject) => {
    // We always will resolve, errors should be handled within loading UIs.
    flushInitializers(READY_INITIALIZERS).then(resolve, resolve)
  })
}
