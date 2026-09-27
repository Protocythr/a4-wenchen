import * as THREE from "/node_modules/three/build/three.module.js";


export class AudioManager {

    constructor(camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);

        this.resumePlaying = this.resumeAudio.bind(this);

        this.sound = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        const self = this;

        self.audioLoader.load('./audio/test.mp3', (buffer) => {
            self.sound.setBuffer(buffer);
            self.sound.setLoop(true);
            self.sound.setVolume(0.5);
            self.sound.play();

            // Create analyser AFTER the buffer is loaded because stuff is cooked otherwise
            self.analyser = new THREE.AudioAnalyser(self.sound, 128);
        });

        // Default Smoothing state can change later through user gui
        self.smoothB  = 0;
        self.smoothM  = 0;
        self.smoothH = 0;
        self.smoothing   = 0.15;
    }

    load(file) {
        const myUrl = URL.createObjectURL(file);
        this.audioLoader.load( myUrl, ( buffer ) => {
            if (this.sound.isPlaying) {
                this.sound.stop();
                this.sound.setBuffer(null);   // optional but clean
            }

            this.sound.setBuffer( buffer );
            this.sound.setLoop(true);
            this.sound.setVolume(0.5);
            this.sound.play();

            this.analyser = new THREE.AudioAnalyser(this.sound, 128);
        });
    }

    averageAudioSnippetRange(arr, start, end) {
        if (!arr || !arr.length) return 0; // literally nothing there return
        end = Math.min(end, arr.length);
        if (end <= start) return 0; // there is no length break

        let sum = 0;
        for (let i = start; i < end; i++) {
            const v = arr[i];
            if (Number.isFinite(v)) sum += v;
        }
        return sum / (end - start);
    }

    getAllBands() {
        if (!this.analyser) {
            return { bass: 0, mids: 0, highs: 0 };
        }

        const data = this.analyser.getFrequencyData();
        if (!data || !data.length) {
            return { bass: 0, mids: 0, highs: 0 };
        }

        return {
            bass:  this.averageAudioSnippetRange(data, 0,    4) / 255,
            mids:  this.averageAudioSnippetRange(data, 4,   32) / 255,
            highs: this.averageAudioSnippetRange(data, 32, 128) / 255,
        };
    }

    getSmoothedBands() {
        const raw = this.getAllBands();

        let bass;
        let mids;
        let highs;

        if (Number.isFinite(raw.bass)){
            bass = raw.bass;
        }else{
            bass = 0;
        }
        if (Number.isFinite(raw.mids)){
            mids = raw.mids;
        }else{
            mids = 0;
        }
        if (Number.isFinite(raw.highs)){
            highs = raw.highs;
        }else{
            highs = 0;
        }

        this.smoothB  += (bass  - this.smoothB)  * this.smoothing;
        this.smoothM  += (mids  - this.smoothM)  * this.smoothing;
        this.smoothH += (highs - this.smoothH) * this.smoothing;

        return {
            bass:  this.smoothB,
            mids:  this.smoothM,
            highs: this.smoothH,
        };
    }

    resumeAudio() {
        const ctx = this.listener.context;
        if (ctx.state === 'suspended') {
            ctx.resume().then(() => console.log('AudioContext resumed'));
        }
        document.removeEventListener('click',      this.resumePlaying);
        document.removeEventListener('keydown',    this.resumePlaying);
        document.removeEventListener('touchstart', this.resumePlaying);
    }

    changeSoundVolume(volume) {
        this.sound.setVolume(volume);
    }
}
