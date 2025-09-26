// Planet objects with their name, distance from Lumoria, and size
const lumoriaPlanets = [
    { name: "Mercuria", distance: 0.4, size: 4879 },
    { name: "Earthia", distance: 1, size: 12742 },
    { name: "Venusia", distance: 0.7, size: 12104 },
    { name: "Marsia", distance: 1.5, size: 6779 }
];



// Takes an array of planets and the current index for the planet being evaluated
// and returns the number of planets that cast a shadow on the current planet
function getShadowCount(planets, currentIndex) {
    // Slice the array up to the current index, filter the planets that are larger than the current planet, and return the length of the resulting array
    return planets.slice(0, currentIndex)
        .filter(planet => planet.size > planets[currentIndex].size)
        .length;
}

// Takes the current index and the number of shadows cast on the planet
// and returns the light intensity of the planet
function getLightIntensity(i, shadowCount) {
    /** 
     * RULES
     * - If a smaller planet is behind a larger planet (relative to the Lumorian Sun), it will be in the shadow and will receive no light (`None`).
     * - If a larger planet is behind a smaller planet (relative to the Lumorian Sun), it will have `Partial` light.
     * - If a planet is in the shadow of multiple planets, it will be marked as `None (Multiple Shadows)`.
     * - If two planets are of similar size and are near each other in alignment, they might partially eclipse each other, but for simplicity, you can consider them both to receive full light.
     **/
    if (i === 0) return 'Full';
    if (shadowCount === 1) return 'None';
    if (shadowCount > 1) return 'None (Multiple Shadows)';
    return 'Partial';
}

// Calculates the light intensity of each planet by seeing how many shadows are cast on it from other planets
function calculateLightIntensity(planets) {
    // Map over the array of planets, calculate the shadow count for each planet, 
    // and return an object with the planet name and its light intensity
    return planets.map((planet, i) => {
        const shadowCount = getShadowCount(planets, i);
        let lightIntensity = getLightIntensity(i, shadowCount);
        return { name: planet.name, light: lightIntensity };
    });
}

// Sort the array of planets by distance
const sortedPlanets = lumoriaPlanets.sort((a, b) => a.distance - b.distance);

// Log the light intensity of each planet to the console

// --- 1. SVG Visual Representation ---
function generateAlignmentSVG(planets, options = {}) {
    const width = options.width || 800;
    const height = options.height || 300;
    const starX = width / 8;
    const starY = height / 2;
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<circle cx="${starX}" cy="${starY}" r="30" fill="gold" />`;
    planets.forEach((p, i) => {
        const angle = (i / planets.length) * Math.PI * 2;
        const orbitRadius = 80 + i * 60;
        const px = starX + Math.cos(angle) * orbitRadius;
        const py = starY + Math.sin(angle) * orbitRadius;
        svg += `<circle cx="${px}" cy="${py}" r="${p.size/1000}" fill="${p.color||'#8ecae6'}" />`;
        svg += `<text x="${px + 10}" y="${py}" font-size="14">${p.name}</text>`;
    });
    svg += `</svg>`;
    return svg;
}

// --- 2. Animation: Shadow Change ---
function animateShadows(planets, star, steps = 30) {
    let frames = [];
    for (let t = 0; t < steps; t++) {
        const phase = t / steps;
        let frame = planets.map((p, i) => {
            // Simulate planet position change
            const angle = phase * Math.PI * 2 + (i / planets.length) * Math.PI * 2;
            const px = star.x + Math.cos(angle) * (80 + i * 60);
            const py = star.y + Math.sin(angle) * (80 + i * 60);
            // Calculate shadow length (scientifically improved)
            const shadow = calculateShadowLength(p, star, px, py);
            return { name: p.name, px, py, shadow };
        });
        frames.push(frame);
    }
    return frames;
}

// --- 3. Scientific Shadow Calculation ---
function calculateShadowLength(planet, star, px, py) {
    // Use real geometry: shadow = (planet.radius^2) / (distance * tan(star.angle))
    const dx = px - star.x;
    const dy = py - star.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Assume star angle = arctan(star.radius / distance)
    const angle = Math.atan(star.radius / distance);
    // Penumbra/umbra calculation
    const planetRadius = planet.size / 2;
    const shadowLength = (planetRadius * planetRadius) / (distance * Math.tan(angle));
    return Math.abs(shadowLength);
}

// --- 4. Detailed Report Generation ---
function generateCelestialReport(planets, starSystem) {
    let report = `Celestial Alignment Report\n`;
    report += `Star System: ${starSystem.name}\n`;
    report += `Stars: ${starSystem.stars.map(s => s.name).join(", ")}\n`;
    planets.forEach(p => {
        report += `Planet: ${p.name}\n`;
        report += `  Orbit Distance: ${p.distance}\n`;
        report += `  Size: ${p.size}\n`;
        report += `  Shadow Length: ${calculateShadowLength(p, starSystem.stars[0], starSystem.stars[0].x + p.distance * 100, starSystem.stars[0].y).toFixed(2)}\n`;
    });
    return report;
}

// --- 5. Unit Tests for Light Intensity ---
function calculateLightIntensityPhysical(planet, star, px, py) {
    // Inverse square law: intensity = star.luminosity / (4 * pi * distance^2)
    const dx = px - star.x;
    const dy = py - star.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return star.luminosity / (4 * Math.PI * distance * distance);
}

function runLightIntensityTests() {
    const star = { x: 0, y: 0, luminosity: 1000 };
    const planet = { x: 100, y: 0 };
    const px = 100, py = 0;
    const intensity = calculateLightIntensityPhysical(planet, star, px, py);
    if (Math.abs(intensity - (1000 / (4 * Math.PI * 10000))) < 1e-6) {
        console.log("Test 1 passed");
    } else {
        console.error("Test 1 failed");
    }
    // Edge case: very close
    const px2 = 1, py2 = 0;
    const intensity2 = calculateLightIntensityPhysical(planet, star, px2, py2);
    if (intensity2 > intensity) {
        console.log("Test 2 passed");
    } else {
        console.error("Test 2 failed");
    }
}

// --- 6. Multi-Star System Support ---
function createStarSystem(name, stars, planets) {
    return { name, stars, planets };
}

// Example usage:
const lumoriaStar = { name: "Lumoria", x: 100, y: 150, radius: 30, luminosity: 1200 };
const altStar = { name: "Altaris", x: 700, y: 150, radius: 20, luminosity: 800 };
const planets = [
    { name: "Mercuria", distance: 0.4, size: 4879, color: "#8ecae6" },
    { name: "Venusia", distance: 0.7, size: 12104, color: "#ffb703" },
    { name: "Earthia", distance: 1, size: 12742, color: "#219ebc" },
    { name: "Marsia", distance: 1.5, size: 6779, color: "#fb8500" }
];
const starSystem = createStarSystem("Lumoria System", [lumoriaStar, altStar], planets);

console.log("--- SVG Alignment ---\n" + generateAlignmentSVG(planets));
console.log("--- Shadow Animation Frames ---");
console.log(animateShadows(planets, lumoriaStar, 5));
console.log("--- Celestial Report ---\n" + generateCelestialReport(planets, starSystem));
console.log("--- Running Light Intensity Unit Tests ---");
runLightIntensityTests();
