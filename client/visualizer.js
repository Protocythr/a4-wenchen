// ==================================================
// VISUALIZER
// ==================================================
//
// Responsible for:
//
// - Creating the visual elements
// - Storing the bars
// - Updating the bars based on audio data
//
// Three.js APIs used:
//
// Mesh
// → Objects
//
// BoxGeometry
// → Geometries
//
// MeshBasicMaterial
// → Materials
//
// Color
// → Math
//
// ==================================================
import * as THREE from "/node_modules/three/build/three.module.js";

export class Visualizer {

    constructor(scene) {
    }


    // ==================================================
    // UPDATE
    // ==================================================
    //
    // update(frequencyData)
    //
    // Receives:
    // Uint8Array
    //
    // Example:
    //
    // [12, 34, 87, 120, 240, ...]
    //
    // Does:
    //
    // - Loops through the visualizer bars
    // - Gets a frequency value for each bar
    // - Converts the frequency value into a height
    // - Changes the bar's scale
    // - Changes the bar's position so it stays
    //   centered vertically
    //
    // Three.js documentation to read:
    //
    // Objects → Mesh
    // → position
    // → scale
    //
    // Core → Object3D
    // → position
    // → scale
    //
    // Returns:
    // Nothing
    // ==================================================

    update(frequencyData) {

    }

}
