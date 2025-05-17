import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class Studio {
    containerDom: HTMLElement


    pointer: THREE.Vector2 = new THREE.Vector2()

    private _renderer: THREE.WebGLRenderer
    private _scene: THREE.Scene
    private _camera: THREE.PerspectiveCamera
    private _controls: OrbitControls
    //private _hemiLight: THREE.HemisphereLight
    //private _dirLight: THREE.DirectionalLight

    private _meshesForClick: THREE.Mesh[] = []
    private _raycaster: THREE.Raycaster = new THREE.Raycaster()
    private _cbsOnMouseOver: ((val: { Id: number, typeItem: string } | null) => void)[] = []
    private _currentMeshIdMouseOver: { Id: number, typeItem: string } | null = null

    constructor () {
        // this.containerDom = document.createElement('div')
        // // this.containerDom.style.margin = '0'
        // // this.containerDom.style.padding = '0'
        // // this.containerDom.style.width = '100vw'
        // // this.containerDom.style.height = '100vh'

        // this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .001, 100000)
        // this.camera.position.set(0, 0, 500)
        // this.camera.lookAt(0, 0, 0)

        // this.scene = new THREE.Scene()

        // this._hemiLight = new THREE.HemisphereLight(0x48534a, 0xffffff, 6)
        // this._hemiLight.position.set( 0, 20, 0 )
        // this.scene.add(this._hemiLight)

        // this._dirLight = new THREE.DirectionalLight(0xffffff, 8)
        // this._dirLight.position.set(-3, 10, 2)
        // this.scene.add(this._dirLight)

        // this._renderer = new THREE.WebGLRenderer({ antialias: true })
        // this._renderer.setPixelRatio(window.devicePixelRatio)
        // this._renderer.setSize(window.innerWidth, window.innerHeight)
        // this.containerDom.appendChild(this._renderer.domElement)

        // window.addEventListener('resize', this._onWindowResize.bind(this))
        // this._onWindowResize()

        // window.addEventListener('pointermove', this._checkMousePointer.bind(this))
        // window.addEventListener('pointerdown', this._onPointeDown.bind(this))

        // this.render()

        this.containerDom = document.createElement('div')
        this._renderer = new THREE.WebGLRenderer({ antialias: true })
        this._renderer.setClearColor(0x333333)
        this._renderer.setPixelRatio( window.devicePixelRatio)
        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.containerDom.appendChild(this._renderer.domElement)
    
        this._scene = new THREE.Scene()
        this._scene.fog = new THREE.Fog(0x000000, 300, 3000)
    
        const lightA = new THREE.AmbientLight( 0xccccff, 2)
        this._scene.add( lightA )
    
        const dirLight = new THREE.DirectionalLight( 0xffffaa, 4)
        dirLight.position.set(0, 300, 200)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 500
        dirLight.shadow.camera.bottom = -500
        dirLight.shadow.camera.left = -500
        dirLight.shadow.camera.right = 500
        dirLight.shadow.camera.near = 0.1
        dirLight.shadow.camera.far = 1000
        this._scene.add(dirLight)
    
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000, 1, 1),
            new THREE.ShadowMaterial( { color: 0x000011, opacity: .2, side: THREE.DoubleSide })
        )
        ground.rotation.x = - Math.PI / 2
        ground.position.y = -1
        ground.receiveShadow = true
        this._scene.add(ground)
       
        this._camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 20000)
        this._camera.position.set(100, 200, 300)
        this._controls = new OrbitControls(this._camera, this._renderer.domElement)
        this._controls.target.set(0, 0, 0)
        this._controls.update()

    }

    setDomParent (elem: HTMLElement) {
        elem.appendChild(this.containerDom)
        this._onWindowResize()
    }

    removeDomParent () {
        this.containerDom.parentNode?.removeChild(this.containerDom)
    }

    render () {
        // this._checkRaycaster()
        this._renderer.render(this._scene, this._camera)
        this._controls.update()
    }

    private _onWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight
        this._camera.updateProjectionMatrix()
        this._renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private _onPointeDown (e: PointerEvent) {
        this._checkMousePointer(e)
        this._checkRaycaster()
    }

    private _checkMousePointer (e: PointerEvent) {
        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1
    } 

    // private _checkRaycaster () {
    //     this._raycaster.setFromCamera(this.pointer, this.camera)
    //     const intersects = this._raycaster.intersectObjects(this._meshesForClick, true)
    //     const result = intersects[0] 
    //         ? { Id: intersects[0].object.userData.Id, typeItem: intersects[0].object.userData.typeItem }
    //         : null

    //     if (!result && this._currentMeshIdMouseOver !== null) {
    //         this._currentMeshIdMouseOver = result
    //         this._cbsOnMouseOver.forEach(cb => cb(result))
    //     }

    //     if (result && this._currentMeshIdMouseOver && result.Id !== this._currentMeshIdMouseOver.Id) {
    //         this._currentMeshIdMouseOver = result
    //         this._cbsOnMouseOver.forEach(cb => cb(result))
    //     }

    //     if (result && !this._currentMeshIdMouseOver) {
    //         this._currentMeshIdMouseOver = result
    //         this._cbsOnMouseOver.forEach(cb => cb(result))
    //     }
    // }

    add (m: THREE.Object3D) {
        this._scene.add(m)
    }

    remove (m: THREE.Object3D) {
        this._scene.remove(m)
    }

    addAxisHelper () {
        const axesHelper = new THREE.AxesHelper(15)
        this._scene.add(axesHelper)
    }

    cameraLookAt (x: number, y: number, z: number) {
        this._camera.lookAt(x, y, z)
    }

    setMeshForMouseOver (e: THREE.Mesh | THREE.Mesh[]) {
        if (Array.isArray(e)) {
            this._meshesForClick.push(...e)
        } else {
            this._meshesForClick.push(e)
        } 
    }

    setCbOnMouseOver (cb: (val: { Id: number, typeItem: string } | null) => void): void {
        this._cbsOnMouseOver.push(cb)
    }
}