"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type BackgroundProps = {
  primarySrc?: string;
  secondarySrc?: string;
  className?: string;
  priority?: boolean;
};

const DEFAULT_PRIMARY = "/background/concrete_wall_003_diff_2k.webp";
const DEFAULT_SECONDARY = "/background/concrete_wall_003_diff_2k.webp";

const BACKGROUND_VERTEX = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// 🎨 Combined shader: keeps scrolling motion from new version + texture mixing and richer tone from the old version
const BACKGROUND_FRAGMENT = `
  precision mediump float;

  uniform sampler2D uTexture0;
  uniform sampler2D uTexture1;
  uniform float uScroll;
  uniform vec2 uResolution;
  uniform float uAspect0;
  uniform float uAspect1;

  varying vec2 vUv;

  void main() {
    // normalized scroll and subtle layered motion
    float scroll = uScroll / uResolution.y;
    vec2 uv = vUv;
    uv.y += scroll * 0.5;

    // sample both textures (adds the color richness back)
    vec4 tex0 = texture2D(uTexture0, uv * vec2(1.0, 1.0));
    vec4 tex1 = texture2D(uTexture1, uv * vec2(1.0, 1.0));

    // blend them smoothly for depth + warm tone
    vec4 color = mix(tex0, tex1, 0.5);

    // apply soft lighting and color grading
    color.rgb *= vec3(0.95, 0.9, 0.85); // warmer tone
    color.rgb = pow(color.rgb, vec3(1.05)); // gentle contrast boost

    gl_FragColor = color;
  }
`;

export default function Background({
  primarySrc = DEFAULT_PRIMARY,
  secondarySrc = DEFAULT_SECONDARY,
  className,
}: BackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const containerClassName = useMemo(
    () =>
      ["pointer-events-none fixed inset-0 overflow-hidden", className]
        .filter(Boolean)
        .join(" "),
    [className]
  );

  const textureSources = useMemo(() => {
    const base = [primarySrc, secondarySrc].filter(Boolean) as string[];

    if (base.length === 0) {
      base.push(DEFAULT_PRIMARY);
    }
    if (base.length === 1) {
      base.push(base[0]);
    }

    return base.slice(0, 2);
  }, [primarySrc, secondarySrc]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const placeholder = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 255]),
      1,
      1
    );
    placeholder.needsUpdate = true;

    const uniforms = {
      uScroll: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTexture0: { value: placeholder as THREE.Texture },
      uTexture1: { value: placeholder as THREE.Texture },
      uAspect0: { value: 1 },
      uAspect1: { value: 1 },
    };

    const material = new THREE.ShaderMaterial({
      fragmentShader: BACKGROUND_FRAGMENT,
      vertexShader: BACKGROUND_VERTEX,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    const loadedTextures: THREE.Texture[] = [];
    let disposed = false;

    const loadTextures = async () => {
      try {
        const textures = await Promise.all(
          textureSources.map((src) => loader.loadAsync(src))
        );

        if (disposed) {
          textures.forEach((texture) => texture.dispose());
          return;
        }

        textures.forEach((texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
        });

        uniforms.uTexture0.value = textures[0];
        uniforms.uTexture1.value = textures[1];

        loadedTextures.push(...textures);
      } catch (error) {
        console.error("[Background] Failed to load textures", error);
      }
    };

    loadTextures();

    let animationFrame: number | null = null;
    let targetScroll =
      window.scrollY ??
      window.pageYOffset ??
      document.documentElement.scrollTop ??
      0;

    const animate = () => {
      if (disposed) return;

      const current = uniforms.uScroll.value;
      const next = current + (targetScroll - current) * 0.7;
      uniforms.uScroll.value = -next;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      targetScroll =
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      disposed = true;
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      loadedTextures.forEach((t) => t.dispose());
      placeholder.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [textureSources]);

  return (
    <div
      className={containerClassName}
      aria-hidden
      style={{
        backgroundColor: "var(--background)",
        mixBlendMode: "multiply",
        opacity: 0.3, // softer blend for visible colors
      }}
    >
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
