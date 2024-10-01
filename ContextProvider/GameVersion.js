class GameVersion {
    constructor(initialVersion) {
        this.version$ = new rxjs.BehaviorSubject(initialVersion)
    }
    get options() { return GameVersions }
    set option(version) {this.version$.next(version)}    
}
