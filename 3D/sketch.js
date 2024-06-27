document.addEventListener('DOMContentLoaded', (event) => {
    let scene, camera, renderer, controls;
    let surface, gradientDescent;
    let gui;

    const params = {
        learningRate: 0.1,
        iterations: 100,
        restart: () => {
            gradientDescent.restart();
        }
    };

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
        camera.position.set(2, 2, 2);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(800, 600);
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        createSurface();
        createGradientDescent();
        createGUI();

        animate();
    }

    function createSurface() {
        const geometry = new THREE.ParametricBufferGeometry((u, v, dest) => {
            const x = (u - 0.5) * 4;
            const z = (v - 0.5) * 4;
            const y = Math.sin(x * Math.PI) * Math.cos(z * Math.PI);
            dest.set(x, y, z);
        }, 50, 50);

        const material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
        });

        surface = new THREE.Mesh(geometry, material);
        scene.add(surface);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 5, 0);
        scene.add(light);
    }

    function createGradientDescent() {
        gradientDescent = {
            position: new THREE.Vector3(Math.random() * 4 - 2, 0, Math.random() * 4 - 2),
            history: [],
            line: new THREE.Line(
                new THREE.BufferGeometry(),
                new THREE.LineBasicMaterial({ color: 0xff0000 })
            ),
            marker: new THREE.Mesh(
                new THREE.SphereGeometry(0.05),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            ),
            step: function() {
                const [x, z] = [this.position.x, this.position.z];
                const y = Math.sin(x * Math.PI) * Math.cos(z * Math.PI);
                const gradX = Math.PI * Math.cos(x * Math.PI) * Math.cos(z * Math.PI);
                const gradZ = -Math.PI * Math.sin(x * Math.PI) * Math.sin(z * Math.PI);

                this.position.x -= params.learningRate * gradX;
                this.position.z -= params.learningRate * gradZ;
                this.position.y = Math.sin(this.position.x * Math.PI) * Math.cos(this.position.z * Math.PI);

                this.history.push(this.position.clone());
                this.updateLine();
                this.updateMarker();
            },
            updateLine: function() {
                this.line.geometry.setFromPoints(this.history);
            },
            updateMarker: function() {
                this.marker.position.copy(this.position);
            },
            restart: function() {
                this.position.set(Math.random() * 4 - 2, 0, Math.random() * 4 - 2);
                this.history = [this.position.clone()];
                this.updateLine();
                this.updateMarker();
            }
        };

        scene.add(gradientDescent.line);
        scene.add(gradientDescent.marker);
        gradientDescent.restart();
    }

    function createGUI() {
        gui = new dat.GUI();
        gui.add(params, 'learningRate', 0.01, 0.5);
        gui.add(params, 'iterations', 10, 500).step(1);
        gui.add(params, 'restart');
    }

    function animate() {
        requestAnimationFrame(animate);

        if (gradientDescent.history.length < params.iterations) {
            gradientDescent.step();
        }

        controls.update();
        renderer.render(scene, camera);
    }

    init();

    document.getElementById('reset-btn').addEventListener('click', () => {
        params.restart();
    });
});