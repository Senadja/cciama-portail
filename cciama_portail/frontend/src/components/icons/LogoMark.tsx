interface LogoMarkProps {
  type: string;
  color?: string;
  size?: number;
}

const marks: Record<string, (c: string) => React.ReactElement> = {
  diamond: (c) => <svg viewBox="0 0 40 40"><polygon points="20,2 38,20 20,38 2,20" fill={c}/><polygon points="20,8 32,20 20,32 8,20" fill="white" opacity="0.25"/></svg>,
  wave: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><path d="M6 22c4-6 8 2 14-4s8 2 14-4" fill="none" stroke="white" strokeWidth="2.5" opacity="0.5"/></svg>,
  bolt: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><polygon points="22,6 14,22 20,22 18,34 28,18 22,18" fill="white" opacity="0.7"/></svg>,
  shield: (c) => <svg viewBox="0 0 40 40"><path d="M20 4 L36 12 L36 24 C36 32 20 38 20 38 C20 38 4 32 4 24 L4 12 Z" fill={c}/><path d="M14 20l4 4 8-8" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/></svg>,
  grain: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><ellipse cx="20" cy="16" rx="6" ry="10" fill="white" opacity="0.4"/><line x1="20" y1="26" x2="20" y2="36" stroke="white" strokeWidth="2" opacity="0.4"/></svg>,
  path: (c) => <svg viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="6" fill={c}/><path d="M8 28 L16 16 L24 22 L32 10" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/></svg>,
  signal: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><circle cx="20" cy="20" r="4" fill="white" opacity="0.7"/><path d="M12 12a12 12 0 0 1 16 0" fill="none" stroke="white" strokeWidth="2" opacity="0.4"/><path d="M8 8a18 18 0 0 1 24 0" fill="none" stroke="white" strokeWidth="2" opacity="0.25"/></svg>,
  book: (c) => <svg viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="6" fill={c}/><rect x="10" y="8" width="20" height="24" rx="2" fill="white" opacity="0.3"/><line x1="20" y1="8" x2="20" y2="32" stroke="white" strokeWidth="1.5" opacity="0.5"/></svg>,
  growth: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><polyline points="8,28 16,18 22,22 32,10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/><polygon points="28,10 32,10 32,14" fill="white" opacity="0.7"/></svg>,
  sun: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><circle cx="20" cy="20" r="7" fill="white" opacity="0.6"/>{[0,45,90,135,180,225,270,315].map(a=><line key={a} x1="20" y1="8" x2="20" y2="5" stroke="white" strokeWidth="2" opacity="0.4" transform={`rotate(${a},20,20)`}/>)}</svg>,
  globe: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/><ellipse cx="20" cy="20" rx="6" ry="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/><line x1="8" y1="20" x2="32" y2="20" stroke="white" strokeWidth="1.5" opacity="0.3"/></svg>,
  olive: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><circle cx="20" cy="20" r="6" fill="white" opacity="0.5"/><path d="M14 28c-2-8 2-14 6-14" fill="none" stroke="white" strokeWidth="1.8" opacity="0.4"/><path d="M26 28c2-8-2-14-6-14" fill="none" stroke="white" strokeWidth="1.8" opacity="0.4"/></svg>,
  tower: (c) => <svg viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="6" fill={c}/><rect x="14" y="8" width="12" height="24" rx="1" fill="white" opacity="0.3"/><rect x="17" y="12" width="6" height="4" rx="1" fill="white" opacity="0.5"/></svg>,
  scale: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><line x1="20" y1="10" x2="20" y2="30" stroke="white" strokeWidth="2" opacity="0.5"/><line x1="10" y1="14" x2="30" y2="14" stroke="white" strokeWidth="2" opacity="0.5"/><circle cx="10" cy="18" r="3" fill="white" opacity="0.3"/><circle cx="30" cy="18" r="3" fill="white" opacity="0.3"/></svg>,
  stars: (c) => <svg viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="6" fill={c}/>{[{x:20,y:10},{x:12,y:16},{x:28,y:16},{x:14,y:26},{x:26,y:26}].map((s,i)=><circle key={i} cx={s.x} cy={s.y} r="2.5" fill="white" opacity="0.6"/>)}</svg>,
  tricolor: (c) => <svg viewBox="0 0 40 40"><rect x="2" y="2" width="12" height="36" rx="2" fill="#0055A4"/><rect x="14" y="2" width="12" height="36" fill="white"/><rect x="26" y="2" width="12" height="36" rx="2" fill={c}/></svg>,
  acacia: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><line x1="20" y1="30" x2="20" y2="14" stroke="white" strokeWidth="2" opacity="0.5"/><circle cx="20" cy="12" r="8" fill="white" opacity="0.2"/></svg>,
  gear: (c) => <svg viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="6" fill={c}/><circle cx="20" cy="20" r="6" fill="none" stroke="white" strokeWidth="2" opacity="0.5"/><circle cx="20" cy="20" r="3" fill="white" opacity="0.4"/></svg>,
  hands: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><path d="M10 24c4-8 8-8 10-2s6 6 10-2" fill="none" stroke="white" strokeWidth="2" opacity="0.5"/></svg>,
  cross: (c) => <svg viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="6" fill={c}/><rect x="17" y="8" width="6" height="24" fill="white" opacity="0.6"/><rect x="8" y="17" width="24" height="6" fill="white" opacity="0.6"/></svg>,
  circle: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><circle cx="20" cy="20" r="10" fill="none" stroke="white" strokeWidth="2.5" opacity="0.4"/></svg>,
  rod: (c) => <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={c}/><line x1="20" y1="6" x2="20" y2="34" stroke="white" strokeWidth="2" opacity="0.5"/><path d="M16 10c0 6 8 6 8 12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/></svg>,
};

export function LogoMark({ type, color = '#0E2A5E', size = 40 }: LogoMarkProps) {
  const render = marks[type];
  if (!render) return <div style={{ width: size, height: size, background: color, borderRadius: 6 }} />;
  return (
    <div className="logo-mark" style={{ width: size, height: size }}>
      {render(color)}
    </div>
  );
}
