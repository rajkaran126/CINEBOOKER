import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { MatIconModule } from '@angular/material/icon';

// Pre-computed colour pairs: [solid hex, rgba with alpha]
const PALETTE: { hex: string; glow: string }[] = [
  { hex: '#00D4FF', glow: 'rgba(0,212,255,'   },
  { hex: '#7B2FFF', glow: 'rgba(123,47,255,'  },
  { hex: '#FF006E', glow: 'rgba(255,0,110,'   },
  { hex: '#00FFC8', glow: 'rgba(0,255,200,'   },
  { hex: '#0066FF', glow: 'rgba(0,102,255,'   },
  { hex: '#FFD600', glow: 'rgba(255,214,0,'   },
];

interface Node3D {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  r: number;
  ci: number;   // colour index into PALETTE
  pulse: number;
}

interface Signal {
  ax: number; ay: number; bx: number; by: number;
  t: number; speed: number; ci: number; alpha: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MatIconModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private W = 0; private H = 0;
  private t = 0;

  private nodes: Node3D[] = [];
  private signals: Signal[] = [];

  private mouse = { x: 0, y: 0 };
  private cam   = { x: 0, y: 0 };

  private readonly N    = 90;
  private readonly DIST = 200;
  private readonly FOV  = 600;
  private readonly DEP  = 900;

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('bg3d') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    this.spawn();
    window.addEventListener('resize',    this.onResize);
    window.addEventListener('mousemove', this.onMouse);
    this.loop();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize',    this.onResize);
    window.removeEventListener('mousemove', this.onMouse);
  }

  private onResize = () => { this.resize(); this.spawn(); };
  private onMouse  = (e: MouseEvent) => {
    this.mouse.x = (e.clientX / this.W - 0.5) * 160;
    this.mouse.y = (e.clientY / this.H - 0.5) * 100;
  };

  private resize(): void {
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this.cam = { x: 0, y: 0 };
  }

  private spawn(): void {
    this.nodes = Array.from({ length: this.N }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;   // fast enough to see easily
      return {
        x:  (Math.random() - 0.5) * this.W * 1.5,
        y:  (Math.random() - 0.5) * this.H * 1.5,
        z:  (Math.random() - 0.5) * this.DEP,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.8,
        vz: (Math.random() - 0.5) * 1.5,
        r:   2 + Math.random() * 2,
        ci:  Math.floor(Math.random() * PALETTE.length),
        pulse: Math.random() * Math.PI * 2,
      };
    });
    this.signals = [];
  }

  // perspective project with parallax
  private proj(x: number, y: number, z: number): { sx: number; sy: number; s: number } {
    const z2 = z + this.FOV;
    if (z2 <= 0) return { sx: -9999, sy: -9999, s: 0 };
    const s = this.FOV / z2;
    return { sx: (x + this.cam.x) * s + this.W / 2,
             sy: (y + this.cam.y) * s + this.H / 2, s };
  }

  private loop(): void {
    try { this.frame(); } catch(e) { console.error(e); }
    this.animId = requestAnimationFrame(() => this.loop());
  }

  private frame(): void {
    const { ctx, W, H } = this;
    this.t += 0.014;

    // Smooth parallax camera
    this.cam.x += (this.mouse.x - this.cam.x) * 0.04;
    this.cam.y += (this.mouse.y - this.cam.y) * 0.04;

    // Clear — solid dark background
    ctx.fillStyle = '#020A14';
    ctx.fillRect(0, 0, W, H);

    // Slow global rotation angle (whole cloud revolves)
    const ga  = this.t * 0.10;
    const cosG = Math.cos(ga), sinG = Math.sin(ga);

    // Update nodes
    const BX = W * 0.9, BY = H * 0.9, BZ = this.DEP * 0.5;
    for (const n of this.nodes) {
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      n.pulse += 0.04;
      if (Math.abs(n.x) > BX) { n.vx *= -1; n.x = Math.sign(n.x) * BX; }
      if (Math.abs(n.y) > BY) { n.vy *= -1; n.y = Math.sign(n.y) * BY; }
      if (Math.abs(n.z) > BZ) { n.vz *= -1; n.z = Math.sign(n.z) * BZ; }
    }

    // Project all nodes (with global rotation applied)
    const pts = this.nodes.map(n => {
      const rx = n.x * cosG - n.z * sinG;
      const rz = n.x * sinG + n.z * cosG;
      return { n, ...this.proj(rx, n.y, rz) };
    });

    // Sort back-to-front
    pts.sort((a, b) => b.s - a.s);

    const D2 = this.DIST * this.DIST;

    // Draw edges
    for (let i = 0; i < pts.length; i++) {
      const pi = pts[i];
      if (pi.s <= 0) continue;
      for (let j = i + 1; j < pts.length; j++) {
        const pj = pts[j];
        if (pj.s <= 0) continue;
        const dx = pi.sx - pj.sx, dy = pi.sy - pj.sy;
        if (dx * dx + dy * dy > D2) continue;

        const dist  = Math.sqrt(dx * dx + dy * dy);
        const alpha = (1 - dist / this.DIST) * 0.6 * Math.min(pi.s, pj.s) * 2.5;
        const ca = PALETTE[pi.n.ci], cb = PALETTE[pj.n.ci];

        ctx.save();
        ctx.globalAlpha = Math.min(alpha, 0.85);
        const grad = ctx.createLinearGradient(pi.sx, pi.sy, pj.sx, pj.sy);
        grad.addColorStop(0, ca.hex);
        grad.addColorStop(1, cb.hex);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = Math.min(pi.s, pj.s) * 1.5;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = ca.hex;
        ctx.beginPath();
        ctx.moveTo(pi.sx, pi.sy);
        ctx.lineTo(pj.sx, pj.sy);
        ctx.stroke();
        ctx.restore();

        // Spawn signal pulse
        if (Math.random() < 0.004) {
          this.signals.push({
            ax: pi.sx, ay: pi.sy, bx: pj.sx, by: pj.sy,
            t: 0, speed: 0.02 + Math.random() * 0.03,
            ci: pi.n.ci, alpha: Math.min(alpha * 2, 1)
          });
        }
      }
    }

    // Draw signals
    this.signals = this.signals.filter(s => s.t <= 1);
    for (const s of this.signals) {
      const x = s.ax + (s.bx - s.ax) * s.t;
      const y = s.ay + (s.by - s.ay) * s.t;
      const fade = 1 - Math.abs(s.t - 0.5) * 2;
      ctx.save();
      ctx.globalAlpha = s.alpha * Math.max(fade, 0);
      ctx.fillStyle   = PALETTE[s.ci].hex;
      ctx.shadowBlur  = 22;
      ctx.shadowColor = PALETTE[s.ci].hex;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      s.t += s.speed;
    }

    // Draw nodes
    for (const { n, sx, sy, s } of pts) {
      if (s <= 0 || sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) continue;
      const { hex, glow } = PALETTE[n.ci];
      const twinkle = 0.65 + 0.35 * Math.sin(n.pulse);
      const r  = n.r * s * 2.2 * twinkle;
      const al = Math.min(s * 1.8, 1) * twinkle;

      // Outer halo — simple solid fill at low alpha, no string ops
      ctx.save();
      ctx.globalAlpha = al * 0.25;
      ctx.fillStyle   = hex;
      ctx.shadowBlur  = r * 6;
      ctx.shadowColor = hex;
      ctx.beginPath();
      ctx.arc(sx, sy, r * 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Core dot
      ctx.save();
      ctx.globalAlpha = al;
      ctx.fillStyle   = hex;
      ctx.shadowBlur  = 20;
      ctx.shadowColor = hex;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(r, 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Vignette
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.15, W/2, H/2, H*0.85);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(2,10,20,0.75)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }
}
