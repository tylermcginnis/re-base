///<reference types="firebase" />
interface FirebaseConfiguration {
    apiKey: string
    authDomain: string
    databaseURL: string
    storageBucket?: string
    messagingSenderId?: string
}
interface SyncStateOptions {
    context: Object
    state: string
    asArray?: boolean
    isNullable?: boolean
    keepKeys?: boolean
    queries?: Object
    then?: () => void
    onFailure?: () => void
}
interface BindToStateOptions {
    context: Object
    state: string
    asArray?: boolean
    queries?: Object
    then?: () => void
    onFailure?: () => void
}

interface ListenToOptions {
    context: Object
    asArray?: boolean
    then: (result : any) => void
    onFailure?: (error : any) => void
    queries?: Object
}

interface FetchOptions {
    context: Object
    asArray?: boolean
    then?: (result : any) => void
    onFailure?: () => void
    queries?: Object
}

interface PostOptions {
    data: any
    then?: (result : any) => void
}
interface PushOptions {
    data: any
    then?: (result : any) => void
}

interface UpdateOptions {
    data: any
    then?: (result : any) => void
}

interface RebaseBinding {}

interface Rebase {

    delete(callback?: () => void): void

    syncState(endpoint: string, options : SyncStateOptions) : RebaseBinding

    bindToState(endpoint: string, options : BindToStateOptions) : RebaseBinding

    listenTo(endpoint: string, options : ListenToOptions) : RebaseBinding

    fetch(endpoint: string, options : FetchOptions) : firebase.Promise<any>

    post(endpoint: string, options: PostOptions) : firebase.Promise<any>

    push(endpoint: string, options: PushOptions) : firebase.database.ThenableReference

    update(endpoint: string, options: UpdateOptions) : firebase.Promise<any>

    remove(endpoint: string, callback?: (result) => void) : firebase.Promise<any>

    removeBinding(ref : RebaseBinding): void

    reset(): void

    authWithPassword(auth : { email: string, password: string }, authHandler: (error : Object | null, user: Object) => void): void

    authWithOAuthPopup(provider : string, authHandler: (error : Object | null, user: Object) => void, settings?: {scope: Array<any> | string})

    authWithOAuthRedirect(provider : string, authHandler: (error : Object | null) => void, settings?: {scope: Array<any> | string})

    authGetOAuthRedirectResult(handler: (error : Object | null, user: Object) => void)

    authWithCustomToken(token : string, handler: (error : Object | null, user: Object) => void)

    unauth()

    onAuth(handler: (user: Object) => void) : Function

    createUser(auth : { email: string, password: string }, userHandler: (user) => void)

    resetPassword({email : string}, errorHandler: (error) => void)

    name: string,
    storage : firebase.storage.Storage,
    database: firebase.database.Database,
    auth: firebase.auth.Auth,
    messaging: firebase.messaging.Messaging,
    app: firebase.app.App,
    initializedApp: firebase.app.App
}

declare module 're-base' {

    /**
     * Accepts a firebase configuration object as the first argument
     * and an optional 'name' for the app as the second
     * @param {FirebaseConfiguration} configuration: .
     * @param {string} name: OPTIONAL, defaults to `[DEFAULT]`.
     * @since 2.8
     * @return Rebase
     */
    export function createClass(configuration: FirebaseConfiguration, name?: string): Rebase
}