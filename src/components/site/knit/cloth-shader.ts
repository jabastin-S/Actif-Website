import type * as ThreeModule from "three";

/**
 * The cloth on the GPU. Each vertex of the dense render grid carries a fixed texture coordinate
 * (u, v) and finds its place on the simulated cloth from it: bicubic Catmull-Rom interpolation of
 * the 4 x 4 particles around it (read from a small float texture updated each frame). The normal
 * comes from the derivatives of the same interpolation, so shading follows the actual surface;
 * fold occlusion (the particles' curvature, w) is interpolated alongside. The shadow pass uses the
 * same placement, so the folds shadow one another where they really are.
 */

export interface ClothUniforms {
  clothParticles: { value: ThreeModule.DataTexture };
  clothGrid: { value: ThreeModule.Vector2 };
  /** darkening per unit of curvature in a fold valley */
  clothOcclusion: { value: number };
}

const PARS = /* glsl */ `
uniform highp sampler2D clothParticles;
uniform ivec2 clothGrid;
uniform float clothOcclusion;

vec4 clothParticle(ivec2 cell) {
  return texelFetch(clothParticles, clamp(cell, ivec2(0), clothGrid - 1), 0);
}

vec4 catmullRom(float t) {
  float t2 = t * t;
  float t3 = t2 * t;
  return 0.5 * vec4(-t3 + 2.0 * t2 - t, 3.0 * t3 - 5.0 * t2 + 2.0, -3.0 * t3 + 4.0 * t2 + t, t3 - t2);
}

vec4 catmullRomSlope(float t) {
  float t2 = t * t;
  return 0.5 * vec4(-3.0 * t2 + 4.0 * t - 1.0, 9.0 * t2 - 10.0 * t, -9.0 * t2 + 8.0 * t + 1.0, 3.0 * t2 - 2.0 * t);
}
`;

/** Defines clothPosition (and, for shading, clothNormal and clothCurvature) from `uv`. */
function sample(shading: boolean) {
  return /* glsl */ `
  vec2 clothAt = uv * vec2(clothGrid - 1);
  ivec2 clothCell = min(ivec2(floor(clothAt)), clothGrid - 2);
  vec2 clothT = clothAt - vec2(clothCell);
  vec4 clothWu = catmullRom(clothT.x);
  vec4 clothWv = catmullRom(clothT.y);
  ${shading ? "vec4 clothDu = catmullRomSlope(clothT.x);\n  vec4 clothDv = catmullRomSlope(clothT.y);" : ""}
  vec3 clothPosition = vec3(0.0);
  ${shading ? "vec3 clothAcross = vec3(0.0);\n  vec3 clothDown = vec3(0.0);\n  float clothCurvature = 0.0;" : ""}
  for (int j = 0; j < 4; j++) {
    vec3 row = vec3(0.0);
    ${shading ? "vec3 rowSlope = vec3(0.0);\n    float rowCurvature = 0.0;" : ""}
    for (int i = 0; i < 4; i++) {
      vec4 particle = clothParticle(clothCell + ivec2(i - 1, j - 1));
      row += particle.xyz * clothWu[i];
      ${shading ? "rowSlope += particle.xyz * clothDu[i];\n      rowCurvature += particle.w * clothWu[i];" : ""}
    }
    clothPosition += row * clothWv[j];
    ${shading ? "clothAcross += rowSlope * clothWv[j];\n    clothDown += row * clothDv[j];\n    clothCurvature += rowCurvature * clothWv[j];" : ""}
  }
  ${shading ? "vec3 clothNormal = normalize(cross(clothDown, clothAcross)); // faces the front of the cloth" : ""}
`;
}

/** Make a material (MeshPhysicalMaterial or MeshDepthMaterial) draw the simulated cloth. */
export function drawAsCloth(
  material: ThreeModule.Material,
  uniforms: ClothUniforms,
  shading: boolean,
) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    let vertex = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>\n${PARS}${shading ? "varying float vClothLight;\n" : ""}`,
    );
    if (shading) {
      vertex = vertex
        .replace(
          "#include <beginnormal_vertex>",
          `${sample(true)}
  vClothLight = 1.0 - min(0.22, max(0.0, clothCurvature) * clothOcclusion);
  vec3 objectNormal = clothNormal;`,
        )
        .replace(
          "#include <begin_vertex>",
          "vec3 transformed = clothPosition;",
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying float vClothLight;",
        )
        .replace(
          "#include <color_fragment>",
          "#include <color_fragment>\n  diffuseColor.rgb *= vClothLight;",
        );
    } else {
      vertex = vertex.replace(
        "#include <begin_vertex>",
        `${sample(false)}\n  vec3 transformed = clothPosition;`,
      );
    }
    shader.vertexShader = vertex;
  };
  material.customProgramCacheKey = () =>
    shading ? "cloth-shading" : "cloth-depth";
  material.needsUpdate = true;
}
