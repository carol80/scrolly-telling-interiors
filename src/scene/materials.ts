import * as THREE from 'three';

const makeCanvasTexture = (
  size: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  repeat: [number, number] = [1, 1],
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

export const woodTexture = (repeat: [number, number] = [3, 3]) =>
  makeCanvasTexture(
    512,
    (ctx, size) => {
      const planks = 8;
      const plankH = size / planks;
      for (let i = 0; i < planks; i++) {
        const tone = 0.9 + Math.random() * 0.2;
        const r = Math.round(200 * tone);
        const g = Math.round(162 * tone);
        const b = Math.round(122 * tone);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, i * plankH, size, plankH);
        ctx.strokeStyle = 'rgba(96,64,38,0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, i * plankH);
        ctx.lineTo(size, i * plankH);
        ctx.stroke();
        for (let grain = 0; grain < 14; grain++) {
          const y = i * plankH + Math.random() * plankH;
          ctx.strokeStyle = `rgba(120,84,52,${0.06 + Math.random() * 0.1})`;
          ctx.lineWidth = 0.8 + Math.random();
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.bezierCurveTo(size * 0.3, y + 3, size * 0.6, y - 3, size, y);
          ctx.stroke();
        }
      }
    },
    repeat,
  );

export const plasterTexture = (base = [241, 236, 226]) =>
  makeCanvasTexture(
    256,
    (ctx, size) => {
      ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 2600; i++) {
        const alpha = Math.random() * 0.05;
        const light = Math.random() > 0.5;
        ctx.fillStyle = light
          ? `rgba(255,255,255,${alpha})`
          : `rgba(120,105,88,${alpha})`;
        ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
      }
    },
    [2, 2],
  );

export const stoneTexture = () =>
  makeCanvasTexture(
    256,
    (ctx, size) => {
      ctx.fillStyle = '#e9e4da';
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 1400; i++) {
        const alpha = 0.03 + Math.random() * 0.08;
        ctx.fillStyle =
          Math.random() > 0.5 ? `rgba(120,112,100,${alpha})` : `rgba(255,255,255,${alpha})`;
        const r = 0.6 + Math.random() * 1.6;
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let v = 0; v < 5; v++) {
        ctx.strokeStyle = `rgba(150,140,126,${0.08 + Math.random() * 0.07})`;
        ctx.lineWidth = 0.8 + Math.random();
        ctx.beginPath();
        const x = Math.random() * size;
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + 40, size * 0.4, x - 40, size * 0.7, x + 12, size);
        ctx.stroke();
      }
    },
    [1, 1],
  );

export const rugTexture = () =>
  makeCanvasTexture(
    256,
    (ctx, size) => {
      ctx.fillStyle = '#d8cbb4';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(140,120,96,0.35)';
      ctx.lineWidth = 10;
      ctx.strokeRect(14, 14, size - 28, size - 28);
      for (let i = 0; i < 2400; i++) {
        ctx.fillStyle = `rgba(150,128,100,${Math.random() * 0.12})`;
        ctx.fillRect(Math.random() * size, Math.random() * size, 1.6, 1.6);
      }
    },
    [1, 1],
  );

export const palette = {
  wallCream: '#efe9dd',
  wallClay: '#dcc5ae',
  oak: '#b98a5e',
  oakDark: '#8f6a48',
  oakLight: '#cfab80',
  linen: '#f2ecdf',
  charcoal: '#2a2724',
  terracotta: '#b8674a',
  sage: '#9aa88f',
  sageDark: '#74826a',
  fabric: '#d9cfbf',
  stone: '#e9e4da',
  brass: '#c9a27a',
  green: '#6d7f5e',
  skyDay: '#e8f0f4',
  skyDusk: '#f0a45e',
  skyNight: '#333b4d',
};
