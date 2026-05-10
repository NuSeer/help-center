// Each template is a complete HTML/CSS design.
// Groq only generates the content JSON — the visuals are hand-crafted here.
// Placeholders: {{BRAND_NAME}}, {{HEADLINE}}, {{SUBHEADLINE}}, {{CTA_TEXT}},
//   {{STAT_1_NUM}}, {{STAT_1_LABEL}}, {{STAT_2_NUM}}, {{STAT_2_LABEL}}, {{STAT_3_NUM}}, {{STAT_3_LABEL}},
//   {{FEAT_1_ICON}}, {{FEAT_1_TITLE}}, {{FEAT_1_DESC}},
//   {{FEAT_2_ICON}}, {{FEAT_2_TITLE}}, {{FEAT_2_DESC}},
//   {{FEAT_3_ICON}}, {{FEAT_3_TITLE}}, {{FEAT_3_DESC}},
//   {{QUOTE}}, {{FOOTER_TAGLINE}}

const TEMPLATES = [

  // ─────────────────────────────────────────────
  // 1. NEON CYBERPUNK
  // ─────────────────────────────────────────────
  {
    name: 'Neon Cyberpunk', emoji: '⚡',
    keywords: ['gaming', 'crypto', 'cyber', 'web3', 'nft', 'tech', 'ai'],
    examples: ['Blockchain gaming platform', 'Crypto trading bot service', 'Web3 NFT marketplace'],
    theme: { bg:'#050510', text:'#f0f0ff', sub:'rgba(240,240,255,0.5)', acc:'#00F5FF', border:'1px solid rgba(0,245,255,0.15)', cardBg:'rgba(255,255,255,0.03)', headFont:"'Barlow Condensed',sans-serif", bodyFont:"'Space Mono',monospace", headWeight:'900', headCase:'uppercase', radius:'0', btnBg:'#FF2D78', btnText:'#050510' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Space+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#050510;color:#f0f0ff;font-family:'Space Mono',monospace;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,245,255,.03) 2px,rgba(0,245,255,.03) 4px);pointer-events:none;z-index:9999}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 60px;background:rgba(5,5,16,.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,245,255,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#00F5FF;text-shadow:0 0 20px #00F5FF,0 0 40px #00F5FF;letter-spacing:.1em}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(240,240,255,.5);text-decoration:none;font-size:11px;letter-spacing:.15em;text-transform:uppercase;transition:color .2s,text-shadow .2s}
.nav-links a:hover{color:#00F5FF;text-shadow:0 0 10px #00F5FF}
.hero{min-height:100vh;padding:140px 60px 80px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,245,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,.05) 1px,transparent 1px);background-size:60px 60px}
.hero-tag{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#FF2D78;text-shadow:0 0 10px #FF2D78;margin-bottom:20px}
h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(60px,10vw,130px);font-weight:900;line-height:.9;text-transform:uppercase;color:#f0f0ff;animation:fadeUp .8s ease forwards;max-width:900px;margin-bottom:28px}
h1 em{color:#00F5FF;font-style:normal;text-shadow:0 0 30px #00F5FF,0 0 60px rgba(0,245,255,.4)}
.sub{font-size:14px;color:rgba(240,240,255,.55);line-height:1.8;max-width:460px;margin-bottom:44px}
.btns{display:flex;gap:14px;flex-wrap:wrap}
.btn{padding:14px 36px;border:2px solid #FF2D78;background:transparent;color:#FF2D78;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .2s;animation:pulseBorder 2s ease-in-out infinite}
.btn:hover{background:#FF2D78;color:#050510;box-shadow:0 0 30px rgba(255,45,120,.5)}
.btn2{padding:14px 28px;border:none;background:transparent;color:rgba(240,240,255,.4);font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:color .2s}
.btn2:hover{color:#f0f0ff}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(0,245,255,.12);border-bottom:1px solid rgba(0,245,255,.12)}
.stat{padding:48px 60px;border-right:1px solid rgba(0,245,255,.08)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Barlow Condensed',sans-serif;font-size:60px;font-weight:900;color:#00F5FF;text-shadow:0 0 20px #00F5FF;line-height:1}
.stat-l{font-size:10px;color:rgba(240,240,255,.4);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:100px 60px}
.features h2{font-family:'Barlow Condensed',sans-serif;font-size:56px;font-weight:900;text-transform:uppercase;margin-bottom:56px;color:#f0f0ff}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(0,245,255,.08)}
.card{background:#050510;padding:40px 32px;transition:background .2s}
.card:hover{background:rgba(0,245,255,.05)}
.card-ico{font-size:40px;margin-bottom:24px}
.card h3{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:700;text-transform:uppercase;color:#00F5FF;margin-bottom:12px}
.card p{font-size:12px;color:rgba(240,240,255,.5);line-height:1.8}
.quote{padding:100px 60px;text-align:center;border-top:1px solid rgba(255,45,120,.15)}
.quote q{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,56px);font-weight:700;text-transform:uppercase;color:#FF2D78;text-shadow:0 0 40px rgba(255,45,120,.4);font-style:normal}
.cta-sec{padding:100px 60px;text-align:center}
.cta-sec h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(48px,7vw,96px);font-weight:900;text-transform:uppercase;margin-bottom:36px;line-height:1}
footer{padding:40px 60px;border-top:1px solid rgba(0,245,255,.08);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;color:#00F5FF;text-shadow:0 0 10px #00F5FF}
.f-copy{font-size:11px;color:rgba(240,240,255,.3)}
@keyframes fadeUp{from{transform:translateY(30px) skewX(-3deg);opacity:0}to{transform:none;opacity:1}}
@keyframes pulseBorder{0%,100%{box-shadow:none}50%{box-shadow:0 0 20px rgba(255,45,120,.3),inset 0 0 20px rgba(255,45,120,.05)}}
@media(max-width:768px){nav{padding:16px 24px}.nav-links{display:none}.hero{padding:110px 24px 60px}h1{font-size:clamp(48px,12vw,80px)}.stats{grid-template-columns:1fr}.stat{padding:32px 24px;border-right:none;border-bottom:1px solid rgba(0,245,255,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 24px}footer{padding:32px 24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Get Access</a></div></nav>
<section class="hero"><div class="hero-tag">// System Online //</div><h1>{{HEADLINE_A}} <em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Learn More →</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Core Systems</h2><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Ready to<br><em style="color:#00F5FF;font-style:normal;text-shadow:0 0 30px #00F5FF">Begin?</em></h2><button class="btn" style="font-size:14px;padding:18px 52px">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 2. GLASSMORPHISM
  // ─────────────────────────────────────────────
  {
    name: 'Glassmorphism', emoji: '🔮',
    keywords: ['app', 'saas', 'software', 'platform', 'dashboard', 'tool'],
    examples: ['AI writing assistant app', 'Team collaboration platform', 'Project management SaaS'],
    theme: { bg:'#0d0621', text:'#f1f0ff', sub:'rgba(241,240,255,0.5)', acc:'#a78bfa', border:'1px solid rgba(255,255,255,0.1)', cardBg:'rgba(255,255,255,0.04)', headFont:"'Plus Jakarta Sans',sans-serif", bodyFont:"'Plus Jakarta Sans',sans-serif", headWeight:'800', headCase:'none', radius:'16px', btnBg:'linear-gradient(135deg,#7c3aed,#2563eb)', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#0d0621;color:#f1f0ff;font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;min-height:100vh}
.bg{position:fixed;inset:0;z-index:0;overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(80px);animation:float 8s ease-in-out infinite}
.b1{width:600px;height:600px;background:rgba(139,92,246,.35);top:-200px;left:-200px;animation-delay:0s}
.b2{width:500px;height:500px;background:rgba(59,130,246,.3);bottom:-100px;right:-100px;animation-delay:-3s}
.b3{width:400px;height:400px;background:rgba(236,72,153,.2);top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:-5s}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 48px;background:rgba(13,6,33,.6);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(241,240,255,.5);text-decoration:none;font-size:13px;font-weight:500;transition:color .2s}
.nav-links a:hover{color:#a78bfa}
.hero{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.3);border-radius:20px;font-size:12px;color:#a78bfa;font-weight:600;margin-bottom:32px;letter-spacing:.05em}
h1{font-size:clamp(44px,7vw,90px);font-weight:800;line-height:1.05;max-width:800px;margin-bottom:24px;animation:fadeUp .9s ease forwards}
h1 span{background:linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{font-size:17px;color:rgba(241,240,255,.55);line-height:1.7;max-width:520px;margin:0 auto 44px;font-weight:300}
.btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.btn{padding:14px 36px;background:linear-gradient(135deg,#7c3aed,#2563eb);border:none;border-radius:10px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:0 8px 32px rgba(124,58,237,.35)}
.btn:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(124,58,237,.5)}
.btn2{padding:14px 32px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:10px;color:rgba(241,240,255,.7);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;backdrop-filter:blur(10px);transition:all .2s}
.btn2:hover{background:rgba(255,255,255,.1);color:#f1f0ff}
.stats{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin:0 60px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;backdrop-filter:blur(20px)}
.stat{padding:40px 32px;text-align:center}
.stat-n{font-size:48px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.stat-l{font-size:12px;color:rgba(241,240,255,.4);margin-top:8px;font-weight:500}
.features{position:relative;z-index:1;padding:100px 60px}
.features h2{font-size:clamp(32px,4vw,52px);font-weight:800;text-align:center;margin-bottom:60px}
.features h2 span{background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:36px 28px;backdrop-filter:blur(20px);transition:all .3s}
.card:hover{background:rgba(167,139,250,.08);border-color:rgba(167,139,250,.3);transform:translateY(-4px);box-shadow:0 20px 60px rgba(124,58,237,.15)}
.card-ico{font-size:36px;margin-bottom:20px}
.card h3{font-size:19px;font-weight:700;margin-bottom:12px;color:#f1f0ff}
.card p{font-size:14px;color:rgba(241,240,255,.5);line-height:1.7}
.quote{position:relative;z-index:1;padding:80px 60px;text-align:center}
.quote-inner{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:56px;backdrop-filter:blur(20px)}
.quote q{font-size:clamp(20px,3vw,32px);font-weight:600;color:rgba(241,240,255,.8);font-style:normal;line-height:1.5}
.cta-sec{position:relative;z-index:1;padding:80px 60px;text-align:center}
.cta-inner{background:linear-gradient(135deg,rgba(124,58,237,.2),rgba(37,99,235,.2));border:1px solid rgba(167,139,250,.2);border-radius:24px;padding:72px;backdrop-filter:blur(20px)}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:800;margin-bottom:32px}
footer{position:relative;z-index:1;padding:40px 60px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:18px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.f-copy{font-size:12px;color:rgba(241,240,255,.3)}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes float{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-30px) scale(1.05)}66%{transform:translate(-20px,20px) scale(.95)}}
@media(max-width:768px){nav{padding:14px 20px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{margin:0 20px;grid-template-columns:1fr}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}.cta-inner,.quote-inner{padding:36px 24px}footer{padding:32px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<div class="bg"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></div>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Get Started</a></div></nav>
<section class="hero"><div class="hero-badge">✦ Now in Beta</div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">See how it works</button></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2>Everything you need to <span>build faster</span></h2><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><div class="quote-inner"><q>{{QUOTE}}</q></div></section>
<section class="cta-sec" id="cta"><div class="cta-inner"><h2>Start building<br><span style="background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">today.</span></h2><button class="btn" style="font-size:15px;padding:16px 48px">{{CTA_TEXT}} →</button></div></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 3. BOLD EDITORIAL
  // ─────────────────────────────────────────────
  {
    name: 'Bold Editorial', emoji: '🗞',
    keywords: ['agency', 'magazine', 'media', 'creative', 'studio', 'brand', 'fashion'],
    examples: ['Creative branding agency', 'Independent fashion magazine', 'Content media studio'],
    theme: { bg:'#f5f0eb', text:'#111', sub:'#555', acc:'#c0392b', border:'3px solid #111', cardBg:'#f5f0eb', headFont:"'Playfair Display',serif", bodyFont:"'Inter',sans-serif", headWeight:'900', headCase:'none', radius:'0', btnBg:'#111', btnText:'#f5f0eb' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#f5f0eb;color:#111;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 60px;background:#f5f0eb;border-bottom:3px solid #111;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#111;letter-spacing:-.02em}
.nav-links{display:flex;gap:36px}
.nav-links a{color:#111;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;position:relative}
.nav-links a::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#c0392b;transition:width .2s}
.nav-links a:hover::after{width:100%}
.hero{padding:160px 60px 0;border-bottom:3px solid #111;position:relative;overflow:hidden;background:#f5f0eb}
.hero-num{font-family:'Playfair Display',serif;font-size:320px;font-weight:900;color:rgba(17,17,17,.06);position:absolute;top:-40px;right:-20px;line-height:1;pointer-events:none;user-select:none}
.hero-tag{font-size:11px;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:#c0392b;margin-bottom:24px}
h1{font-family:'Playfair Display',serif;font-size:clamp(52px,8vw,120px);font-weight:900;line-height:.92;color:#111;max-width:820px;margin-bottom:0;animation:slideIn .7s ease forwards}
h1 em{font-style:italic;color:#c0392b}
.hero-bottom{display:grid;grid-template-columns:1fr 1fr;gap:60px;padding:60px 0;border-top:1px solid rgba(17,17,17,.15);margin-top:60px}
.sub{font-size:17px;color:#444;line-height:1.7;font-weight:300;align-self:start}
.hero-right{display:flex;flex-direction:column;justify-content:space-between}
.btn{display:inline-block;padding:16px 40px;background:#111;color:#f5f0eb;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;border:none;cursor:pointer;transition:background .2s,color .2s;margin-bottom:20px;align-self:flex-start}
.btn:hover{background:#c0392b;color:#fff}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:3px solid #111}
.stat{padding:48px 60px;border-right:3px solid #111}
.stat:last-child{border-right:none}
.stat-n{font-family:'Playfair Display',serif;font-size:64px;font-weight:900;color:#111;line-height:1}
.stat-l{font-size:12px;color:#888;letter-spacing:.15em;text-transform:uppercase;margin-top:8px;font-weight:500}
.features{padding:100px 60px;border-bottom:3px solid #111}
.feat-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px;border-bottom:1px solid #111;padding-bottom:24px}
.feat-header h2{font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,72px);font-weight:900;line-height:1}
.feat-num{font-size:11px;color:#888;letter-spacing:.2em;text-transform:uppercase}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:48px}
.card{padding-top:32px;border-top:3px solid #111}
.card-num{font-family:'Playfair Display',serif;font-size:48px;font-weight:900;color:rgba(17,17,17,.12);margin-bottom:16px;line-height:1}
.card h3{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#111;margin-bottom:14px}
.card p{font-size:14px;color:#555;line-height:1.75;font-weight:300}
.quote{padding:100px 60px;text-align:center;border-bottom:3px solid #111;background:#111}
.quote q{font-family:'Playfair Display',serif;font-size:clamp(24px,4vw,52px);font-weight:700;font-style:italic;color:#f5f0eb;line-height:1.3}
.cta-sec{padding:100px 60px;display:flex;align-items:center;justify-content:space-between;gap:40px}
.cta-sec h2{font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,80px);font-weight:900;line-height:.95;flex:1}
.cta-sec h2 em{font-style:italic;color:#c0392b}
footer{padding:40px 60px;border-top:3px solid #111;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:900}
.f-copy{font-size:12px;color:#888;font-weight:300}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}
@media(max-width:768px){nav{padding:16px 24px}.nav-links{display:none}.hero{padding:110px 24px 0}.hero-num{font-size:180px;top:0;right:-10px}.hero-bottom{grid-template-columns:1fr;gap:32px}.stats{grid-template-columns:1fr}.stat{padding:32px 24px;border-right:none;border-bottom:3px solid #111}.features{padding:60px 24px}.grid{grid-template-columns:1fr;gap:36px}.quote,.cta-sec{padding:60px 24px}.cta-sec{flex-direction:column}footer{padding:32px 24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-num">01</div><div class="hero-tag">Est. 2025 · {{BRAND_NAME}}</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><div class="hero-bottom"><p class="sub">{{SUBHEADLINE}}</p><div class="hero-right"><button class="btn">{{CTA_TEXT}}</button><div style="font-size:12px;color:#888;font-weight:300;letter-spacing:.05em">Scroll to explore ↓</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-header"><h2>What We Do</h2><span class="feat-num">Selected services</span></div><div class="grid"><div class="card"><div class="card-num">01</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-num">02</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-num">03</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Ready to<br><em>Work Together?</em></h2><button class="btn" style="font-size:15px;padding:20px 52px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 4. LUXURY MINIMAL
  // ─────────────────────────────────────────────
  {
    name: 'Luxury Minimal', emoji: '✦',
    keywords: ['luxury', 'premium', 'elegant', 'high-end', 'jewel', 'fashion', 'wellness', 'spa', 'beauty', 'architect', 'portfolio'],
    examples: ['High-end jewelry collection', 'Luxury spa & wellness retreat', 'Premium interior design studio'],
    theme: { bg:'#faf8f3', text:'#1c1917', sub:'#7c6f64', acc:'#c9a84c', border:'1px solid rgba(28,25,23,0.1)', cardBg:'rgba(201,168,76,0.04)', headFont:"'Cormorant Garamond',serif", bodyFont:"'Jost',sans-serif", headWeight:'300', headCase:'none', radius:'0', btnBg:'#1c1917', btnText:'#faf8f3' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#faf8f3;color:#1c1917;font-family:'Jost',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:24px 80px;background:rgba(250,248,243,.92);backdrop-filter:blur(10px);border-bottom:1px solid rgba(28,25,23,.1);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#1c1917;letter-spacing:.12em;text-transform:uppercase}
.nav-links{display:flex;gap:40px}
.nav-links a{color:#7c6f64;text-decoration:none;font-size:12px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#c9a84c}
.hero{padding:160px 80px 120px;display:flex;align-items:flex-end;justify-content:space-between;gap:60px;border-bottom:1px solid rgba(28,25,23,.1);min-height:90vh}
h1{font-family:'Cormorant Garamond',serif;font-size:clamp(56px,8vw,110px);font-weight:300;line-height:.95;color:#1c1917;letter-spacing:-.02em;flex:1;animation:reveal .9s ease forwards}
h1 em{font-style:italic;color:#c9a84c}
.hero-right{max-width:340px;padding-top:8px}
.hero-line{width:40px;height:1px;background:#c9a84c;margin-bottom:28px}
.sub{font-size:15px;color:#7c6f64;line-height:1.8;font-weight:300;margin-bottom:40px}
.btn{display:inline-block;padding:14px 36px;background:transparent;border:1px solid #1c1917;color:#1c1917;font-family:'Jost',sans-serif;font-size:12px;font-weight:400;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:all .25s;position:relative;overflow:hidden}
.btn::before{content:'';position:absolute;bottom:0;left:0;width:0;height:100%;background:#1c1917;z-index:-1;transition:width .25s ease}
.btn:hover{color:#faf8f3}
.btn:hover::before{width:100%}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid rgba(28,25,23,.1)}
.stat{padding:60px 80px;border-right:1px solid rgba(28,25,23,.1)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:300;color:#1c1917;line-height:1}
.stat-n span{color:#c9a84c}
.stat-l{font-size:11px;color:#a89880;letter-spacing:.2em;text-transform:uppercase;margin-top:8px;font-weight:400}
.features{padding:120px 80px;border-bottom:1px solid rgba(28,25,23,.1)}
.feat-top{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:80px}
.feat-top h2{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,4vw,64px);font-weight:300;line-height:1;letter-spacing:-.02em}
.feat-top h2 em{font-style:italic;color:#c9a84c}
.gold-line{width:60px;height:1px;background:#c9a84c;flex-shrink:0}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:48px 40px;border-left:1px solid rgba(28,25,23,.08);transition:background .2s}
.card:hover{background:rgba(201,168,76,.04)}
.card-mark{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:600;color:#c9a84c;letter-spacing:.2em;text-transform:uppercase;margin-bottom:20px}
.card h3{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:#1c1917;margin-bottom:14px;line-height:1.2}
.card p{font-size:14px;color:#7c6f64;line-height:1.8;font-weight:300}
.quote{padding:120px 80px;display:flex;align-items:center;gap:60px}
.quote-mark{font-family:'Cormorant Garamond',serif;font-size:200px;color:#c9a84c;line-height:.7;flex-shrink:0;opacity:.3}
.quote q{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,3vw,38px);font-weight:300;font-style:italic;color:#1c1917;line-height:1.5}
.cta-sec{padding:120px 80px;text-align:center;background:#1c1917}
.cta-sec h2{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,80px);font-weight:300;color:#faf8f3;line-height:1.05;margin-bottom:48px}
.cta-sec h2 em{font-style:italic;color:#c9a84c}
.btn-light{display:inline-block;padding:14px 48px;background:transparent;border:1px solid rgba(250,248,243,.4);color:#faf8f3;font-family:'Jost',sans-serif;font-size:12px;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.btn-light:hover{background:#faf8f3;color:#1c1917}
footer{padding:48px 80px;background:#1c1917;border-top:1px solid rgba(250,248,243,.08);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#faf8f3;letter-spacing:.12em;text-transform:uppercase}
.f-copy{font-size:11px;color:rgba(250,248,243,.3);letter-spacing:.08em}
@keyframes reveal{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(max-width:768px){nav{padding:18px 24px}.nav-links{display:none}.hero{padding:120px 24px 80px;flex-direction:column}.hero-right{max-width:100%}.stats{grid-template-columns:1fr}.stat{padding:40px 24px;border-right:none;border-bottom:1px solid rgba(28,25,23,.1)}.features{padding:80px 24px}.grid{grid-template-columns:1fr}.card{border-left:none;border-bottom:1px solid rgba(28,25,23,.08)}.quote{padding:80px 24px;flex-direction:column;gap:20px}.quote-mark{font-size:100px}.cta-sec{padding:80px 24px}footer{padding:40px 24px;flex-direction:column;gap:12px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Services</a><a href="#about">Philosophy</a><a href="#cta">Enquire</a></div></nav>
<section class="hero"><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><div class="hero-right"><div class="hero-line"></div><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}<span>+</span></div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}<span>+</span></div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-top"><h2>Our <em>Services</em></h2><div class="gold-line"></div></div><div class="grid"><div class="card"><div class="card-mark">✦ 01</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-mark">✦ 02</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-mark">✦ 03</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><div class="quote-mark">"</div><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Begin Your<br><em>Journey</em></h2><button class="btn-light">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 5. BRUTALIST
  // ─────────────────────────────────────────────
  {
    name: 'Brutalist', emoji: '◼',
    keywords: ['startup', 'bold', 'raw', 'punk', 'street', 'underground', 'disrupt'],
    examples: ['Disruptive fintech startup', 'Underground streetwear brand', 'Anti-design creative studio'],
    theme: { bg:'#f0ede8', text:'#000', sub:'#333', acc:'#FF3B00', border:'3px solid #000', cardBg:'#f0ede8', headFont:"'Space Grotesk',sans-serif", bodyFont:"'Space Mono',monospace", headWeight:'700', headCase:'uppercase', radius:'0', btnBg:'#000', btnText:'#f0ede8' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
:root{--acc:#FF3B00}
body{background:#f0ede8;color:#000;font-family:'Space Grotesk',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 0 0 0;background:#f0ede8;border-bottom:3px solid #000;display:flex;align-items:stretch}
.logo{font-family:'Space Mono',monospace;font-size:18px;font-weight:700;color:#000;padding:18px 32px;border-right:3px solid #000;letter-spacing:-.02em;text-transform:uppercase}
.nav-links{display:flex;gap:0;margin-left:auto}
.nav-links a{color:#000;text-decoration:none;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:18px 24px;border-left:3px solid #000;transition:background .1s,color .1s}
.nav-links a:hover{background:#000;color:#f0ede8}
.hero{padding:120px 0 0;border-bottom:3px solid #000;background:#f0ede8;overflow:hidden}
.hero-inner{padding:0 60px 0}
.hero-tag{font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);margin-bottom:24px;padding-top:20px}
h1{font-size:clamp(60px,10vw,140px);font-weight:700;line-height:.88;color:#000;text-transform:uppercase;letter-spacing:-.03em;margin-bottom:0;animation:chopIn .6s ease forwards}
h1 span{color:var(--acc)}
.hero-bottom{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:3px solid #000;margin-top:60px}
.hero-sub{padding:40px 60px;border-right:3px solid #000}
.sub{font-size:16px;color:#333;line-height:1.7;font-weight:400;margin-bottom:32px}
.btn{display:inline-block;padding:16px 36px;background:#000;color:#f0ede8;font-family:'Space Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:3px solid #000;cursor:pointer;transition:background .1s,color .1s;box-shadow:6px 6px 0 var(--acc)}
.btn:hover{background:var(--acc);color:#fff;box-shadow:6px 6px 0 #000}
.hero-marquee{padding:20px 0;overflow:hidden;background:#000;color:#f0ede8;font-family:'Space Mono',monospace;font-size:14px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
.marquee-inner{display:inline-flex;animation:marquee 20s linear infinite}
.marquee-inner span{padding:0 40px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:3px solid #000}
.stat{padding:48px 60px;border-right:3px solid #000;background:#f0ede8}
.stat:last-child{border-right:none}
.stat-n{font-size:72px;font-weight:700;color:#000;line-height:1}
.stat-n span{color:var(--acc)}
.stat-l{font-family:'Space Mono',monospace;font-size:11px;color:#666;letter-spacing:.15em;text-transform:uppercase;margin-top:8px}
.features{padding:0;border-bottom:3px solid #000}
.feat-header{padding:48px 60px;border-bottom:3px solid #000;display:flex;justify-content:space-between;align-items:center}
.feat-header h2{font-size:clamp(28px,4vw,52px);font-weight:700;text-transform:uppercase;letter-spacing:-.02em}
.feat-header span{font-family:'Space Mono',monospace;font-size:11px;color:#888;letter-spacing:.2em;text-transform:uppercase}
.grid{display:grid;grid-template-columns:repeat(3,1fr)}
.card{padding:48px 40px;border-right:3px solid #000;transition:background .1s}
.card:last-child{border-right:none}
.card:hover{background:#000;color:#f0ede8}
.card-ico{font-size:48px;margin-bottom:24px;display:block}
.card h3{font-size:24px;font-weight:700;text-transform:uppercase;margin-bottom:14px;letter-spacing:-.01em}
.card p{font-size:13px;line-height:1.7;color:inherit;opacity:.7}
.quote{padding:80px 60px;background:#000;color:#f0ede8;border-bottom:3px solid var(--acc)}
.quote q{font-size:clamp(24px,4vw,56px);font-weight:700;text-transform:uppercase;letter-spacing:-.02em;line-height:1.1;font-style:normal;color:var(--acc)}
.cta-sec{padding:80px 60px;display:flex;align-items:center;justify-content:space-between;gap:40px;border-bottom:3px solid #000}
.cta-sec h2{font-size:clamp(40px,6vw,96px);font-weight:700;text-transform:uppercase;letter-spacing:-.03em;line-height:.9;flex:1}
.cta-sec h2 span{color:var(--acc)}
footer{padding:32px 60px;background:#000;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Space Mono',monospace;font-size:16px;font-weight:700;color:#f0ede8;text-transform:uppercase;letter-spacing:.05em}
.f-copy{font-family:'Space Mono',monospace;font-size:11px;color:rgba(240,237,232,.4)}
@keyframes chopIn{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media(max-width:768px){nav{flex-wrap:wrap}.nav-links{display:none}.hero-inner{padding:0 24px}.hero-bottom{grid-template-columns:1fr}.hero-sub{padding:32px 24px;border-right:none;border-bottom:3px solid #000}.stats{grid-template-columns:1fr}.stat{padding:32px 24px;border-right:none;border-bottom:3px solid #000}.feat-header{padding:32px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:3px solid #000}.quote,.cta-sec{padding:60px 24px}.cta-sec{flex-direction:column}footer{padding:24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">What</a><a href="#about">Why</a><a href="#cta">Start</a></div></nav>
<section class="hero"><div class="hero-inner"><div class="hero-tag">// {{BRAND_NAME}} — Est. 2025 //</div><h1>{{HEADLINE_A}}<br><span>{{HEADLINE_B}}</span><br>{{HEADLINE_C}}</h1></div><div class="hero-bottom"><div class="hero-sub"><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}} →</button></div><div style="padding:40px;display:flex;align-items:center;justify-content:center;background:var(--acc)"><span style="font-size:80px">{{FEAT_1_ICON}}</span></div></div></section>
<div class="hero-marquee"><div class="marquee-inner"><span>{{BRAND_NAME}}</span><span>·</span><span>{{HEADLINE_A}} {{HEADLINE_B}}</span><span>·</span><span>{{CTA_TEXT}}</span><span>·</span><span>{{BRAND_NAME}}</span><span>·</span><span>{{HEADLINE_A}} {{HEADLINE_B}}</span><span>·</span><span>{{CTA_TEXT}}</span><span>·</span><span>{{BRAND_NAME}}</span><span>·</span><span>{{HEADLINE_A}} {{HEADLINE_B}}</span><span>·</span><span>{{CTA_TEXT}}</span><span>·</span></div></div>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}<span>+</span></div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}<span>x</span></div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-header"><h2>What We Do</h2><span>Three things. Done right.</span></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Let's <span>Build</span><br>Something.</h2><button class="btn" style="font-size:15px;padding:20px 52px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 6. RETRO TERMINAL
  // ─────────────────────────────────────────────
  {
    name: 'Retro Terminal', emoji: '💻',
    keywords: ['dev', 'developer', 'hacker', 'security', 'code', 'coding', 'cli', 'devtools', 'open source', 'api', 'infrastructure'],
    examples: ['Open source developer tools', 'API security monitoring platform', 'CLI productivity toolkit'],
    theme: { bg:'#030a06', text:'#00FF41', sub:'rgba(0,255,65,0.45)', acc:'#00FF41', border:'1px solid rgba(0,255,65,0.15)', cardBg:'rgba(0,255,65,0.02)', headFont:"'IBM Plex Mono',monospace", bodyFont:"'IBM Plex Mono',monospace", headWeight:'700', headCase:'none', radius:'0', btnBg:'transparent', btnText:'#00FF41' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@300;400;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
:root{--grn:#00FF41;--grn2:#00cc33;--dim:rgba(0,255,65,.15);--bg:#030a06}
body{background:var(--bg);color:var(--grn);font-family:'IBM Plex Mono',monospace;overflow-x:hidden}
body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,65,.02) 3px,rgba(0,255,65,.02) 4px);pointer-events:none;z-index:9999;animation:flicker 8s ease-in-out infinite}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 48px;background:rgba(3,10,6,.95);border-bottom:1px solid rgba(0,255,65,.2);display:flex;align-items:center;gap:0}
.logo{font-size:16px;font-weight:700;color:var(--grn);padding-right:24px;border-right:1px solid var(--dim);text-shadow:0 0 10px var(--grn)}
.logo::before{content:'> ';color:var(--grn2)}
.nav-links{display:flex;gap:0;margin-left:24px}
.nav-links a{color:rgba(0,255,65,.5);text-decoration:none;font-size:12px;padding:4px 16px;border-right:1px solid var(--dim);transition:color .15s,background .15s}
.nav-links a:hover{color:var(--grn);background:var(--dim)}
.nav-links a::before{content:'./'}
.spacer{flex:1}
.nav-status{font-size:11px;color:var(--grn2);padding:4px 12px;border:1px solid rgba(0,255,65,.3);background:rgba(0,255,65,.06);animation:blink 1.2s step-end infinite}
.hero{padding:140px 48px 80px;min-height:100vh;display:flex;flex-direction:column;justify-content:center;position:relative}
.prompt-line{font-size:12px;color:var(--grn2);margin-bottom:16px;letter-spacing:.05em}
.prompt-line::before{content:'root@system:~$ '}
h1{font-size:clamp(42px,7vw,96px);font-weight:700;line-height:1;color:var(--grn);text-shadow:0 0 30px rgba(0,255,65,.4),0 0 60px rgba(0,255,65,.15);margin-bottom:8px;letter-spacing:-.02em}
h1 .dim{color:rgba(0,255,65,.35)}
h1 .acc{color:#fff;text-shadow:0 0 20px #fff}
.cursor{display:inline-block;width:18px;height:1em;background:var(--grn);vertical-align:bottom;animation:blink .8s step-end infinite;margin-left:4px}
.sub{font-family:'IBM Plex Sans',sans-serif;font-size:15px;color:rgba(0,255,65,.55);line-height:1.8;max-width:560px;margin:28px 0 44px;font-weight:300}
.sub::before{content:'// ';color:rgba(0,255,65,.25)}
.btns{display:flex;gap:14px;flex-wrap:wrap}
.btn{padding:12px 32px;border:1px solid var(--grn);background:transparent;color:var(--grn);font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.08em;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.btn::before{content:'';position:absolute;inset:0;background:var(--grn);transform:translateX(-100%);transition:transform .2s ease;z-index:-1}
.btn:hover{color:var(--bg);box-shadow:0 0 20px rgba(0,255,65,.4)}
.btn:hover::before{transform:translateX(0)}
.btn2{padding:12px 28px;border:1px solid rgba(0,255,65,.2);background:transparent;color:rgba(0,255,65,.4);font-family:'IBM Plex Mono',monospace;font-size:13px;cursor:pointer;transition:all .15s}
.btn2:hover{border-color:rgba(0,255,65,.5);color:rgba(0,255,65,.7)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(0,255,65,.15);border-bottom:1px solid rgba(0,255,65,.15)}
.stat{padding:44px 48px;border-right:1px solid rgba(0,255,65,.1)}
.stat:last-child{border-right:none}
.stat-label{font-size:10px;color:rgba(0,255,65,.35);letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}
.stat-label::before{content:'# '}
.stat-n{font-size:56px;font-weight:700;color:var(--grn);text-shadow:0 0 20px rgba(0,255,65,.4);line-height:1}
.stat-sub{font-size:10px;color:rgba(0,255,65,.3);letter-spacing:.15em;text-transform:uppercase;margin-top:8px}
.features{padding:80px 48px}
.feat-header{display:flex;align-items:center;gap:16px;margin-bottom:48px}
.feat-header h2{font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--grn2)}
.feat-header h2::before{content:'## '}
.feat-line{flex:1;height:1px;background:rgba(0,255,65,.1)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(0,255,65,.08)}
.card{background:var(--bg);padding:36px 28px;transition:background .15s}
.card:hover{background:rgba(0,255,65,.04)}
.card-ico{font-size:32px;margin-bottom:20px;display:block}
.card-num{font-size:10px;color:rgba(0,255,65,.3);letter-spacing:.15em;margin-bottom:10px}
.card-num::before{content:'function_'}
.card h3{font-size:17px;font-weight:700;color:var(--grn);margin-bottom:10px}
.card p{font-family:'IBM Plex Sans',sans-serif;font-size:13px;color:rgba(0,255,65,.45);line-height:1.7;font-weight:300}
.quote{padding:80px 48px;border-top:1px solid rgba(0,255,65,.1);border-bottom:1px solid rgba(0,255,65,.1)}
.quote-prefix{font-size:11px;color:rgba(0,255,65,.3);margin-bottom:16px;letter-spacing:.1em}
.quote q{font-size:clamp(18px,3vw,34px);font-weight:700;color:var(--grn);line-height:1.4;text-shadow:0 0 20px rgba(0,255,65,.2);font-style:normal}
.cta-sec{padding:80px 48px;display:flex;align-items:center;justify-content:space-between;gap:40px}
.cta-left h2{font-size:clamp(32px,5vw,72px);font-weight:700;line-height:1;color:var(--grn);text-shadow:0 0 30px rgba(0,255,65,.3)}
.cta-left h2 em{font-style:normal;color:#fff;text-shadow:0 0 20px #fff}
footer{padding:32px 48px;border-top:1px solid rgba(0,255,65,.1);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;font-weight:700;color:var(--grn)}
.f-logo::before{content:'> '}
.f-copy{font-size:11px;color:rgba(0,255,65,.25)}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.97}94%{opacity:1}96%{opacity:.98}97%{opacity:1}}
@media(max-width:768px){nav{padding:12px 20px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 20px;border-right:none;border-bottom:1px solid rgba(0,255,65,.08)}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}.cta-sec{flex-direction:column}footer{padding:28px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">features</a><a href="#about">about</a><a href="#cta">start</a></div><div class="spacer"></div><div class="nav-status">● ONLINE</div></nav>
<section class="hero"><div class="prompt-line">initializing {{BRAND_NAME}} v1.0.0...</div><h1><span class="dim">//</span> {{HEADLINE_A}}<br><span class="acc">{{HEADLINE_B}}</span><br>{{HEADLINE_C}}<span class="cursor"></span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">$ read --docs</button></div></section>
<section class="stats"><div class="stat"><div class="stat-label">Metric 01</div><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-sub">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-label">Metric 02</div><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-sub">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-label">Metric 03</div><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-sub">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-header"><h2>Core Modules</h2><div class="feat-line"></div></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><div class="card-num">01</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><div class="card-num">02</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><div class="card-num">03</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><div class="quote-prefix">/* mission statement */</div><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><div class="cta-left"><h2>Ready to<br><em>Execute?</em></h2></div><button class="btn" style="font-size:14px;padding:18px 48px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 7. WARM SUNSET
  // ─────────────────────────────────────────────
  {
    name: 'Warm Sunset', emoji: '🌅',
    keywords: ['lifestyle', 'travel', 'food', 'restaurant', 'wellness', 'yoga', 'health', 'coach', 'community', 'social', 'creative', 'photography', 'wedding'],
    examples: ['Artisan café & coffee roastery', 'Yoga & mindfulness studio', 'Wedding photography brand'],
    theme: { bg:'#fff8f0', text:'#1a0a05', sub:'rgba(26,10,5,0.55)', acc:'#FF6B35', border:'1px solid rgba(255,107,53,0.12)', cardBg:'#fff', headFont:"'DM Serif Display',serif", bodyFont:"'DM Sans',sans-serif", headWeight:'400', headCase:'none', radius:'20px', btnBg:'linear-gradient(135deg,#FF6B35,#C9184A)', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
:root{--s1:#FF6B35;--s2:#F7931E;--s3:#FFD166;--s4:#C9184A;--s5:#590D22;--lt:#FFF8F0;--dk:#1A0A05}
body{background:var(--lt);color:var(--dk);font-family:'DM Sans',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 64px;background:rgba(255,248,240,.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,107,53,.12);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'DM Serif Display',serif;font-size:22px;color:var(--dk);letter-spacing:.02em}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(26,10,5,.5);text-decoration:none;font-size:14px;font-weight:500;transition:color .2s}
.nav-links a:hover{color:var(--s1)}
.nav-cta{padding:10px 24px;background:var(--s1);color:#fff;border:none;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s,transform .15s}
.nav-cta:hover{background:var(--s4);transform:translateY(-1px)}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 32px 80px;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 110%,rgba(255,107,53,.18) 0%,rgba(247,147,30,.1) 40%,transparent 70%);pointer-events:none}
.hero-circle{position:absolute;border-radius:50%;pointer-events:none}
.c1{width:600px;height:600px;background:radial-gradient(circle,rgba(255,209,102,.25) 0%,transparent 70%);bottom:-300px;left:-200px;animation:drift 10s ease-in-out infinite}
.c2{width:400px;height:400px;background:radial-gradient(circle,rgba(255,107,53,.2) 0%,transparent 70%);top:-100px;right:-100px;animation:drift 13s ease-in-out infinite reverse}
.hero-tag{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.25);border-radius:100px;font-size:13px;color:var(--s1);font-weight:600;margin-bottom:32px;position:relative;z-index:1}
h1{font-family:'DM Serif Display',serif;font-size:clamp(52px,8vw,110px);line-height:1;color:var(--dk);max-width:840px;margin-bottom:28px;position:relative;z-index:1;animation:riseUp .9s ease forwards}
h1 em{font-style:italic;color:var(--s1)}
.sub{font-size:18px;color:rgba(26,10,5,.55);line-height:1.7;max-width:520px;margin:0 auto 48px;font-weight:300;position:relative;z-index:1}
.btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1}
.btn{padding:16px 40px;background:linear-gradient(135deg,var(--s1),var(--s4));color:#fff;border:none;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:0 8px 32px rgba(255,107,53,.3)}
.btn:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(255,107,53,.4)}
.btn2{padding:16px 36px;background:transparent;border:1.5px solid rgba(26,10,5,.15);border-radius:100px;color:rgba(26,10,5,.6);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:var(--s1);color:var(--s1)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin:0 64px;background:#fff;border:1px solid rgba(255,107,53,.1);border-radius:20px;overflow:hidden;box-shadow:0 4px 40px rgba(255,107,53,.08)}
.stat{padding:40px 32px;text-align:center;border-right:1px solid rgba(255,107,53,.08)}
.stat:last-child{border-right:none}
.stat-n{font-family:'DM Serif Display',serif;font-size:52px;color:var(--s1);line-height:1}
.stat-l{font-size:13px;color:rgba(26,10,5,.45);margin-top:8px;font-weight:500}
.features{padding:100px 64px}
.feat-intro{text-align:center;margin-bottom:60px}
.feat-intro h2{font-family:'DM Serif Display',serif;font-size:clamp(36px,5vw,64px);line-height:1.1;margin-bottom:16px}
.feat-intro h2 em{font-style:italic;color:var(--s1)}
.feat-intro p{font-size:16px;color:rgba(26,10,5,.5);max-width:440px;margin:0 auto;font-weight:300}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:#fff;border:1px solid rgba(255,107,53,.08);border-radius:20px;padding:40px 32px;transition:all .25s;box-shadow:0 2px 20px rgba(26,10,5,.04)}
.card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(255,107,53,.12);border-color:rgba(255,107,53,.2)}
.card-ico{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,rgba(255,107,53,.12),rgba(247,147,30,.12));display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:24px}
.card h3{font-family:'DM Serif Display',serif;font-size:22px;color:var(--dk);margin-bottom:12px}
.card p{font-size:14px;color:rgba(26,10,5,.5);line-height:1.75;font-weight:300}
.quote{padding:80px 64px;text-align:center;background:linear-gradient(135deg,var(--s5),var(--s4),var(--s1));position:relative;overflow:hidden}
.quote::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(255,255,255,.06) 0%,transparent 70%)}
.quote q{font-family:'DM Serif Display',serif;font-size:clamp(22px,4vw,48px);color:#fff;line-height:1.3;font-style:italic;position:relative;z-index:1}
.cta-sec{padding:100px 64px;text-align:center}
.cta-inner{background:#fff;border:1px solid rgba(255,107,53,.12);border-radius:28px;padding:80px 40px;box-shadow:0 8px 60px rgba(255,107,53,.08)}
.cta-sec h2{font-family:'DM Serif Display',serif;font-size:clamp(36px,5vw,72px);line-height:1.05;margin-bottom:32px}
.cta-sec h2 em{font-style:italic;color:var(--s1)}
footer{padding:48px 64px;background:var(--dk);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'DM Serif Display',serif;font-size:20px;color:#fff}
.f-copy{font-size:12px;color:rgba(255,248,240,.3)}
@keyframes riseUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}
@media(max-width:768px){nav{padding:16px 24px}.nav-links,.nav-cta{display:none}.hero{padding:110px 20px 60px}.stats{margin:0 20px;grid-template-columns:1fr}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}.cta-inner{padding:48px 24px}footer{padding:40px 24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Services</a><a href="#about">Story</a><a href="#cta">Connect</a></div><button class="nav-cta">{{CTA_TEXT}}</button></nav>
<section class="hero"><div class="hero-bg"></div><div class="hero-circle c1"></div><div class="hero-circle c2"></div><div class="hero-tag">✦ Welcome to {{BRAND_NAME}}</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Learn our story</button></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><div class="feat-intro"><h2>Everything you <em>love</em></h2><p>{{SUBHEADLINE}}</p></div><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><div class="cta-inner"><h2>Start your<br><em>journey today.</em></h2><button class="btn" style="font-size:16px;padding:18px 52px">{{CTA_TEXT}} →</button></div></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 8. MEMPHIS POP
  // ─────────────────────────────────────────────
  {
    name: 'Memphis Pop', emoji: '🎉',
    keywords: ['event', 'kids', 'fun', 'party', 'music', 'festival', 'entertainment', 'game', 'toy', 'sport', 'fitness', 'gym', 'education'],
    examples: ['Youth fitness & gym brand', 'Music festival & live events', 'Kids educational platform'],
    theme: { bg:'#fafaf5', text:'#111', sub:'rgba(17,17,17,0.6)', acc:'#FF1F1F', border:'3px solid #111', cardBg:'#fff', headFont:"'Fredoka One',sans-serif", bodyFont:"'Nunito',sans-serif", headWeight:'400', headCase:'none', radius:'16px', btnBg:'#FF1F1F', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
:root{--y:#FFE600;--r:#FF1F1F;--b:#0057FF;--g:#00C896;--pk:#FF69B4;--bg:#FAFAF5;--dk:#111}
body{background:var(--bg);color:var(--dk);font-family:'Nunito',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 48px;background:var(--bg);border-bottom:3px solid var(--dk);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Fredoka One',sans-serif;font-size:26px;color:var(--dk);letter-spacing:.03em}
.logo span{color:var(--r)}
.nav-links{display:flex;gap:8px}
.nav-links a{color:var(--dk);text-decoration:none;font-size:13px;font-weight:800;padding:8px 16px;border-radius:100px;transition:background .15s,color .15s}
.nav-links a:hover{background:var(--y);color:var(--dk)}
.nav-cta{padding:10px 22px;background:var(--r);color:#fff;border:3px solid var(--dk);border-radius:100px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;cursor:pointer;box-shadow:3px 3px 0 var(--dk);transition:all .1s}
.nav-cta:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--dk)}
.hero{padding:130px 48px 80px;min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden}
.shape{position:absolute;pointer-events:none;border-radius:50%}
.s1{width:180px;height:180px;background:var(--y);top:80px;right:120px;animation:bounce 4s ease-in-out infinite}
.s2{width:120px;height:120px;background:var(--b);top:200px;right:60px;border-radius:0;transform:rotate(30deg);animation:spin 8s linear infinite}
.s3{width:100px;height:100px;background:var(--pk);bottom:120px;left:80px;animation:bounce 5s ease-in-out infinite .5s}
.s4{width:60px;height:60px;background:var(--r);bottom:200px;right:300px;border-radius:8px;animation:spin 6s linear infinite reverse}
.s5{width:240px;height:240px;background:var(--g);opacity:.3;top:60%;left:-80px;animation:bounce 7s ease-in-out infinite 1s}
.hero-content{position:relative;z-index:1;max-width:780px}
.hero-tag{display:inline-flex;align-items:center;gap:10px;padding:10px 24px;background:var(--y);border:3px solid var(--dk);border-radius:100px;font-size:14px;font-weight:800;color:var(--dk);margin-bottom:28px;box-shadow:3px 3px 0 var(--dk)}
h1{font-family:'Fredoka One',sans-serif;font-size:clamp(54px,9vw,120px);line-height:1;color:var(--dk);letter-spacing:.01em;margin-bottom:28px;animation:popIn .6s cubic-bezier(.34,1.56,.64,1) forwards}
h1 .y{color:var(--r);-webkit-text-stroke:2px var(--dk)}
h1 .b{color:var(--b);-webkit-text-stroke:2px var(--dk)}
.sub{font-size:18px;color:rgba(17,17,17,.6);line-height:1.6;max-width:500px;margin-bottom:44px;font-weight:600}
.btns{display:flex;gap:14px;flex-wrap:wrap}
.btn{padding:16px 40px;background:var(--r);color:#fff;border:3px solid var(--dk);border-radius:100px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;cursor:pointer;box-shadow:4px 4px 0 var(--dk);transition:all .1s}
.btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--dk)}
.btn2{padding:16px 36px;background:var(--y);color:var(--dk);border:3px solid var(--dk);border-radius:100px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;cursor:pointer;box-shadow:4px 4px 0 var(--dk);transition:all .1s}
.btn2:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--dk)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:0 48px 80px;margin-top:-20px}
.stat{background:#fff;border:3px solid var(--dk);border-radius:20px;padding:36px 32px;text-align:center;box-shadow:5px 5px 0 var(--dk);transition:transform .1s}
.stat:nth-child(1){background:var(--y)}
.stat:nth-child(2){background:rgba(0,87,255,.1)}
.stat:nth-child(3){background:rgba(0,200,150,.12)}
.stat:hover{transform:translate(-2px,-2px)}
.stat-n{font-family:'Fredoka One',sans-serif;font-size:58px;color:var(--dk);line-height:1}
.stat-l{font-size:14px;font-weight:800;color:rgba(17,17,17,.6);margin-top:8px}
.features{padding:60px 48px;background:var(--dk)}
.feat-title{font-family:'Fredoka One',sans-serif;font-size:clamp(36px,5vw,72px);color:#fff;text-align:center;margin-bottom:48px}
.feat-title span{color:var(--y)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:var(--bg);border:3px solid var(--bg);border-radius:20px;padding:40px 28px;transition:all .1s;box-shadow:5px 5px 0 rgba(255,230,0,.4)}
.card:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--y)}
.card-ico{font-size:48px;margin-bottom:20px;display:block}
.card h3{font-family:'Fredoka One',sans-serif;font-size:24px;color:var(--dk);margin-bottom:10px}
.card p{font-size:14px;color:rgba(17,17,17,.6);line-height:1.65;font-weight:600}
.quote{padding:80px 48px;background:var(--b);text-align:center;position:relative;overflow:hidden}
.quote::before{content:'';position:absolute;width:300px;height:300px;background:rgba(255,255,255,.08);border-radius:50%;top:-100px;right:-50px}
.quote::after{content:'';position:absolute;width:200px;height:200px;background:rgba(255,230,0,.15);border-radius:50%;bottom:-60px;left:60px}
.quote q{font-family:'Fredoka One',sans-serif;font-size:clamp(24px,4vw,52px);color:#fff;line-height:1.2;font-style:normal;position:relative;z-index:1}
.cta-sec{padding:80px 48px;text-align:center;background:var(--y);border-top:3px solid var(--dk)}
.cta-sec h2{font-family:'Fredoka One',sans-serif;font-size:clamp(40px,7vw,96px);color:var(--dk);line-height:1;margin-bottom:36px}
.cta-sec h2 span{color:var(--r)}
footer{padding:36px 48px;background:var(--dk);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Fredoka One',sans-serif;font-size:22px;color:#fff}
.f-logo span{color:var(--y)}
.f-copy{font-size:12px;color:rgba(255,255,255,.35);font-weight:600}
@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@media(max-width:768px){nav{padding:14px 20px}.nav-links{display:none}.hero{padding:110px 20px 40px}.s1,.s2,.s3,.s4{display:none}.stats{padding:0 20px 60px;grid-template-columns:1fr}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}footer{padding:28px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>!</span></div><div class="nav-links"><a href="#features">What's Inside</a><a href="#about">Our Story</a></div><button class="nav-cta">{{CTA_TEXT}} 🎉</button></nav>
<section class="hero"><div class="shape s1"></div><div class="shape s2"></div><div class="shape s3"></div><div class="shape s4"></div><div class="shape s5"></div><div class="hero-content"><div class="hero-tag">🎉 {{BRAND_NAME}} is here!</div><h1>{{HEADLINE_A}}<br><span class="y">{{HEADLINE_B}}</span><br><span class="b">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}} →</button><button class="btn2">See how it works!</button></div></div></section>
<section style="background:var(--bg);padding-top:60px"><div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></section>
<section class="features" id="features"><div class="feat-title">What makes us <span>awesome</span></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Let's <span>Do This</span><br>Together!</h2><button class="btn" style="font-size:17px;padding:20px 56px">{{CTA_TEXT}} 🚀</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>!</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 9. CINEMATIC DARK
  // ─────────────────────────────────────────────
  {
    name: 'Cinematic Dark', emoji: '🎬',
    keywords: ['film', 'cinema', 'photo', 'photographer', 'video', 'production', 'music', 'art', 'gallery', 'portfolio', 'dark', 'noir', 'nightclub', 'bar'],
    examples: ['Film production company', 'Wedding & portrait photography', 'Nightclub & venue brand'],
    theme: { bg:'#080808', text:'#f5f5f5', sub:'rgba(245,245,245,0.45)', acc:'#E8C547', border:'1px solid rgba(255,255,255,0.06)', cardBg:'#111', headFont:"'Outfit',sans-serif", bodyFont:"'Outfit',sans-serif", headWeight:'700', headCase:'uppercase', radius:'0', btnBg:'#f5f5f5', btnText:'#080808' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
:root{--bg:#080808;--mid:#111;--lt:#f5f5f5;--acc:#E8C547;--sub:rgba(245,245,245,.45)}
body{background:var(--bg);color:var(--lt);font-family:'Outfit',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:24px 72px;display:flex;align-items:center;justify-content:space-between;mix-blend-mode:difference}
.logo{font-size:18px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(255,255,255,.5);text-decoration:none;font-size:13px;font-weight:400;letter-spacing:.08em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#fff}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 72px 80px;position:relative;overflow:hidden}
.hero-noise{position:absolute;inset:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:200px}
.hero-line{position:absolute;top:50%;left:72px;right:72px;height:1px;background:rgba(255,255,255,.05);transform:scaleX(0);animation:expandLine 1.2s ease .3s forwards}
.hero-num{position:absolute;top:72px;right:72px;font-size:11px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.2)}
.hero-tag{font-size:11px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--acc);margin-bottom:28px;animation:fadeUp .8s ease .1s both}
h1{font-size:clamp(64px,10vw,140px);font-weight:900;line-height:.9;letter-spacing:-.04em;text-transform:uppercase;max-width:900px;animation:fadeUp .8s ease .2s both}
h1 .outline{-webkit-text-stroke:1px var(--lt);color:transparent}
h1 .acc{color:var(--acc)}
.hero-bottom{display:flex;justify-content:space-between;align-items:flex-end;padding-top:60px;border-top:1px solid rgba(255,255,255,.08);margin-top:60px;animation:fadeUp .8s ease .4s both}
.sub{font-size:16px;color:var(--sub);line-height:1.7;max-width:440px;font-weight:300}
.hero-right{display:flex;flex-direction:column;align-items:flex-end;gap:20px}
.btn{padding:16px 44px;background:var(--lt);color:var(--bg);border:none;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s}
.btn:hover{background:var(--acc);color:var(--bg)}
.scroll-hint{font-size:11px;color:rgba(255,255,255,.2);letter-spacing:.15em;text-transform:uppercase}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,255,255,.06)}
.stat{padding:60px 72px;border-right:1px solid rgba(255,255,255,.04)}
.stat:last-child{border-right:none}
.stat-n{font-size:64px;font-weight:200;letter-spacing:-.03em;line-height:1;color:var(--lt)}
.stat-n span{color:var(--acc)}
.stat-l{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:.2em;text-transform:uppercase;margin-top:12px;font-weight:600}
.features{padding:100px 72px;border-top:1px solid rgba(255,255,255,.04)}
.feat-eyebrow{font-size:11px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--acc);margin-bottom:16px}
.features h2{font-size:clamp(36px,5vw,72px);font-weight:700;letter-spacing:-.03em;margin-bottom:72px;max-width:600px;line-height:1.05}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.04)}
.card{background:var(--bg);padding:48px 36px;transition:background .2s}
.card:hover{background:var(--mid)}
.card-ico{font-size:36px;margin-bottom:28px;display:block}
.card-line{width:32px;height:1px;background:var(--acc);margin-bottom:24px}
.card h3{font-size:21px;font-weight:600;letter-spacing:-.02em;margin-bottom:14px;color:var(--lt)}
.card p{font-size:14px;color:var(--sub);line-height:1.75;font-weight:300}
.quote{padding:120px 72px;display:flex;align-items:center;gap:80px;border-top:1px solid rgba(255,255,255,.04)}
.q-num{font-size:120px;font-weight:900;color:rgba(255,255,255,.04);line-height:1;flex-shrink:0}
.quote q{font-size:clamp(22px,4vw,44px);font-weight:300;color:var(--lt);line-height:1.3;font-style:normal;letter-spacing:-.02em}
.quote q strong{font-weight:700;color:var(--acc)}
.cta-sec{padding:100px 72px;border-top:1px solid rgba(255,255,255,.04);display:flex;align-items:center;justify-content:space-between;gap:60px}
.cta-sec h2{font-size:clamp(40px,7vw,100px);font-weight:900;letter-spacing:-.04em;text-transform:uppercase;line-height:.9;flex:1}
.cta-sec h2 span{-webkit-text-stroke:1px var(--lt);color:transparent}
footer{padding:40px 72px;border-top:1px solid rgba(255,255,255,.04);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--lt)}
.f-copy{font-size:11px;color:rgba(255,255,255,.2);letter-spacing:.08em}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes expandLine{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(max-width:768px){nav{padding:20px 24px}.nav-links{display:none}.hero{padding:0 24px 60px}.hero-bottom{flex-direction:column;align-items:flex-start;gap:32px}.hero-right{align-items:flex-start}.stats{grid-template-columns:1fr}.stat{padding:40px 24px;border-right:none;border-bottom:1px solid rgba(255,255,255,.04)}.features,.quote,.cta-sec{padding:60px 24px}.cta-sec{flex-direction:column}.quote{flex-direction:column;gap:20px}.q-num{font-size:60px}footer{padding:32px 24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">Vision</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-noise"></div><div class="hero-line"></div><div class="hero-num">2025 / 001</div><div class="hero-tag">{{BRAND_NAME}}</div><h1>{{HEADLINE_A}}<br><span class="outline">{{HEADLINE_B}}</span><br><span class="acc">{{HEADLINE_C}}</span></h1><div class="hero-bottom"><p class="sub">{{SUBHEADLINE}}</p><div class="hero-right"><button class="btn">{{CTA_TEXT}}</button><div class="scroll-hint">Scroll to discover ↓</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}<span>+</span></div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-eyebrow">What we offer</div><h2>{{HEADLINE_A}} {{HEADLINE_B}}</h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><div class="card-line"></div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><div class="card-line"></div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><div class="card-line"></div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><div class="q-num">"</div><q><strong>{{HEADLINE_A}}</strong> — {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Let's<br><span>Create</span></h2><button class="btn" style="font-size:15px;padding:20px 56px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 11. SYNTHWAVE
  // ─────────────────────────────────────────────
  {
    name: 'Retrowave', emoji: '🌊',
    keywords: ['80s', 'retro','synth','wave','music','nightlife','dj','electronic'],
    examples: ['Synthwave music producer', 'Retro nightclub event brand', 'Electronic DJ collective'],
    theme: { bg:'#0D0015', text:'#F0E6FF', sub:'rgba(240,230,255,0.5)', acc:'#FF00FF', border:'1px solid rgba(255,0,255,0.2)', cardBg:'rgba(255,0,255,0.04)', headFont:"'Orbitron',sans-serif", bodyFont:"'Space Mono',monospace", headWeight:'700', headCase:'uppercase', radius:'0', btnBg:'#FF00FF', btnText:'#0D0015' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#0D0015;color:#F0E6FF;font-family:'Space Mono',monospace;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 48px;background:rgba(13,0,21,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,0,255,.2);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Orbitron',sans-serif;font-size:18px;font-weight:700;color:#FF00FF;text-shadow:0 0 20px #FF00FF,0 0 40px #FF00FF;letter-spacing:.1em}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(240,230,255,.5);text-decoration:none;font-size:11px;letter-spacing:.15em;text-transform:uppercase;transition:color .2s,text-shadow .2s}
.nav-links a:hover{color:#00FFFF;text-shadow:0 0 10px #00FFFF}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:120px 48px 80px;position:relative;overflow:hidden}
.grid-floor{position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(transparent,rgba(255,0,255,.08));transform:perspective(400px) rotateX(30deg);transform-origin:bottom center;background-image:linear-gradient(rgba(255,0,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,255,.15) 1px,transparent 1px);background-size:60px 60px}
.sun{position:absolute;top:15%;left:50%;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:linear-gradient(180deg,#FF6B35,#FF00FF);box-shadow:0 0 60px rgba(255,0,255,.5);overflow:hidden}
.sun::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60%;background:repeating-linear-gradient(transparent,transparent 8px,#0D0015 8px,#0D0015 10px)}
h1{font-family:'Orbitron',sans-serif;font-size:clamp(40px,7vw,96px);font-weight:900;line-height:.95;text-transform:uppercase;color:#F0E6FF;animation:fadeUp .8s ease forwards;position:relative;z-index:1;margin-bottom:24px}
h1 em{color:#FF00FF;font-style:normal;text-shadow:0 0 30px #FF00FF,0 0 60px rgba(255,0,255,.4)}
h1 span{color:#00FFFF;text-shadow:0 0 20px #00FFFF}
.sub{font-size:13px;color:rgba(240,230,255,.55);line-height:1.8;max-width:480px;margin-bottom:36px;position:relative;z-index:1}
.btns{display:flex;gap:14px;flex-wrap:wrap;position:relative;z-index:1}
.btn{padding:14px 36px;background:#FF00FF;border:none;color:#0D0015;font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 0 20px rgba(255,0,255,.5);transition:all .2s}
.btn:hover{box-shadow:0 0 40px rgba(255,0,255,.8);background:#ff33ff}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,0,255,.15);border-bottom:1px solid rgba(255,0,255,.15)}
.stat{padding:44px 48px;border-right:1px solid rgba(255,0,255,.1)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Orbitron',sans-serif;font-size:52px;font-weight:700;color:#FF00FF;text-shadow:0 0 20px #FF00FF;line-height:1}
.stat-l{font-size:10px;color:rgba(240,230,255,.4);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:80px 48px}
.features h2{font-family:'Orbitron',sans-serif;font-size:clamp(24px,3vw,44px);font-weight:700;text-transform:uppercase;margin-bottom:48px;color:#00FFFF;text-shadow:0 0 20px #00FFFF}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,0,255,.1)}
.card{background:#0D0015;padding:36px 28px;transition:background .2s}
.card:hover{background:rgba(255,0,255,.06)}
.card-ico{font-size:36px;margin-bottom:20px;display:block}
.card h3{font-family:'Orbitron',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;color:#FF00FF;margin-bottom:10px}
.card p{font-size:12px;color:rgba(240,230,255,.5);line-height:1.8}
.quote{padding:80px 48px;text-align:center;border-top:1px solid rgba(0,255,255,.15)}
.quote q{font-family:'Orbitron',sans-serif;font-size:clamp(18px,3vw,36px);font-weight:700;text-transform:uppercase;color:#00FFFF;text-shadow:0 0 30px #00FFFF;font-style:normal}
.cta-sec{padding:80px 48px;text-align:center}
.cta-sec h2{font-family:'Orbitron',sans-serif;font-size:clamp(36px,6vw,80px);font-weight:900;text-transform:uppercase;margin-bottom:36px;line-height:1;color:#F0E6FF}
footer{padding:36px 48px;border-top:1px solid rgba(255,0,255,.1);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Orbitron',sans-serif;font-size:14px;font-weight:700;color:#FF00FF;text-shadow:0 0 10px #FF00FF}
.f-copy{font-size:11px;color:rgba(240,230,255,.3)}
@keyframes fadeUp{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
@keyframes glow{0%,100%{text-shadow:0 0 20px #FF00FF}50%{text-shadow:0 0 40px #FF00FF,0 0 80px #FF00FF}}
@media(max-width:768px){nav{padding:14px 20px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 20px;border-right:none;border-bottom:1px solid rgba(255,0,255,.08)}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}footer{padding:28px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Tracks</a><a href="#about">About</a><a href="#cta">Access</a></div></nav>
<section class="hero"><div class="sun"></div><div class="grid-floor"></div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br><span>{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Core Systems</h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>{{HEADLINE_A}}<br><em style="color:#FF00FF;font-style:normal">{{HEADLINE_B}}</em></h2><button class="btn" style="font-size:13px;padding:18px 52px">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 12. EMBER
  // ─────────────────────────────────────────────
  {
    name: 'Ember', emoji: '🔥',
    keywords: ['fire','energy','power','bold','strong','impact','intense'],
    examples: ['Performance energy brand', 'Extreme sports company', 'Bold impact agency'],
    theme: { bg:'#080400', text:'#FFF5E6', sub:'rgba(255,245,230,0.55)', acc:'#FF6200', border:'1px solid rgba(255,98,0,0.2)', cardBg:'rgba(255,98,0,0.04)', headFont:"'Anton',sans-serif", bodyFont:"'Roboto',sans-serif", headWeight:'400', headCase:'uppercase', radius:'4px', btnBg:'#FF6200', btnText:'#080400' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#080400;color:#FFF5E6;font-family:'Roboto',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 48px;background:rgba(8,4,0,.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,98,0,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Anton',sans-serif;font-size:22px;color:#FF6200;letter-spacing:.05em}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(255,245,230,.5);text-decoration:none;font-size:13px;letter-spacing:.1em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#FF6200}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 48px 80px;position:relative;overflow:hidden}
.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;background:radial-gradient(circle,rgba(255,98,0,.2) 0%,rgba(255,171,0,.1) 30%,transparent 70%);pointer-events:none;animation:pulse 4s ease-in-out infinite}
h1{font-family:'Anton',sans-serif;font-size:clamp(64px,11vw,160px);line-height:.88;text-transform:uppercase;position:relative;z-index:1;animation:flameUp .7s ease forwards;margin-bottom:28px}
h1 em{color:#FF6200;font-style:normal;text-shadow:0 0 40px rgba(255,98,0,.6)}
h1 span{color:#FFAB00}
.sub{font-size:16px;color:rgba(255,245,230,.55);line-height:1.75;max-width:480px;margin-bottom:40px;font-weight:300;position:relative;z-index:1}
.btns{display:flex;gap:14px;position:relative;z-index:1}
.btn{padding:15px 40px;background:#FF6200;color:#080400;border:none;font-family:'Roboto',sans-serif;font-size:14px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:all .2s;box-shadow:0 8px 32px rgba(255,98,0,.35)}
.btn:hover{background:#FFAB00;box-shadow:0 12px 48px rgba(255,171,0,.4)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,98,0,.12);border-bottom:1px solid rgba(255,98,0,.12)}
.stat{padding:48px;border-right:1px solid rgba(255,98,0,.08)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Anton',sans-serif;font-size:64px;color:#FF6200;line-height:1}
.stat-l{font-size:11px;color:rgba(255,245,230,.4);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:80px 48px}
.features h2{font-family:'Anton',sans-serif;font-size:clamp(36px,5vw,72px);text-transform:uppercase;margin-bottom:48px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,98,0,.08)}
.card{background:#080400;padding:40px 28px;transition:background .2s}
.card:hover{background:rgba(255,98,0,.06)}
.card-ico{font-size:40px;margin-bottom:20px}
.card h3{font-family:'Anton',sans-serif;font-size:22px;text-transform:uppercase;color:#FF6200;margin-bottom:10px}
.card p{font-size:13px;color:rgba(255,245,230,.5);line-height:1.75;font-weight:300}
.quote{padding:80px 48px;text-align:center;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(255,98,0,.12),transparent)}
.quote q{font-family:'Anton',sans-serif;font-size:clamp(28px,5vw,60px);text-transform:uppercase;color:#FFF5E6;font-style:normal;line-height:1.1}
.cta-sec{padding:80px 48px;text-align:center}
.cta-sec h2{font-family:'Anton',sans-serif;font-size:clamp(48px,8vw,110px);text-transform:uppercase;line-height:.9;margin-bottom:36px}
footer{padding:36px 48px;border-top:1px solid rgba(255,98,0,.08);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Anton',sans-serif;font-size:18px;color:#FF6200}
.f-copy{font-size:11px;color:rgba(255,245,230,.3)}
@keyframes flameUp{from{transform:translateY(24px) scaleY(.95);opacity:0}to{transform:none;opacity:1}}
@keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.8}50%{transform:translate(-50%,-50%) scale(1.1);opacity:1}}
@media(max-width:768px){nav{padding:14px 20px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{grid-template-columns:1fr}.stat{padding:32px 20px;border-right:none;border-bottom:1px solid rgba(255,98,0,.08)}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}footer{padding:28px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Power</a><a href="#about">About</a><a href="#cta">Ignite</a></div></nav>
<section class="hero"><div class="hero-glow"></div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br><span>{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}} →</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Forged in Fire</h2><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Ready to<br><span style="color:#FF6200">Ignite?</span></h2><button class="btn" style="font-size:15px;padding:18px 56px">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 13. AURORA
  // ─────────────────────────────────────────────
  {
    name: 'Aurora', emoji: '🌌',
    keywords: ['nature','space','innovation','future','wonder','explore','discovery'],
    examples: ['Space exploration startup', 'Innovation research lab', 'Future-tech platform'],
    theme: { bg:'#050510', text:'#E0FFF6', sub:'rgba(224,255,246,0.5)', acc:'#00FFB3', border:'1px solid rgba(0,255,179,0.15)', cardBg:'rgba(0,255,179,0.03)', headFont:"'Manrope',sans-serif", bodyFont:"'Manrope',sans-serif", headWeight:'800', headCase:'none', radius:'12px', btnBg:'#00FFB3', btnText:'#050510' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#050510;color:#E0FFF6;font-family:'Manrope',sans-serif;overflow-x:hidden}
.aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.aurora-band{position:absolute;width:200%;height:300px;opacity:.18;animation:shift 12s ease-in-out infinite}
.a1{background:linear-gradient(90deg,transparent,#00FFB3,#7B2FFF,transparent);top:15%;animation-duration:14s}
.a2{background:linear-gradient(90deg,transparent,#7B2FFF,#00FFB3,transparent);top:30%;animation-duration:18s;animation-delay:-6s}
.a3{background:linear-gradient(90deg,transparent,#00FFB3,transparent);top:20%;animation-duration:22s;animation-delay:-10s}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 52px;background:rgba(5,5,16,.85);backdrop-filter:blur(16px);border-bottom:1px solid rgba(0,255,179,.1);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:800;background:linear-gradient(135deg,#00FFB3,#7B2FFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(224,255,246,.5);text-decoration:none;font-size:13px;font-weight:600;transition:color .2s}
.nav-links a:hover{color:#00FFB3}
.hero{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px}
h1{font-size:clamp(48px,8vw,100px);font-weight:800;line-height:1;max-width:800px;margin-bottom:24px;animation:rise .9s ease forwards}
h1 span{background:linear-gradient(135deg,#00FFB3,#7B2FFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{font-size:17px;color:rgba(224,255,246,.55);line-height:1.75;max-width:500px;margin:0 auto 40px;font-weight:300}
.btns{display:flex;gap:14px;justify-content:center}
.btn{padding:14px 40px;background:#00FFB3;color:#050510;border:none;border-radius:12px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 8px 32px rgba(0,255,179,.3)}
.btn:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(0,255,179,.5)}
.stats{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);margin:0 52px;background:rgba(0,255,179,.03);border:1px solid rgba(0,255,179,.1);border-radius:12px;overflow:hidden}
.stat{padding:44px 32px;text-align:center;border-right:1px solid rgba(0,255,179,.06)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:800;background:linear-gradient(135deg,#00FFB3,#7B2FFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.stat-l{font-size:12px;color:rgba(224,255,246,.4);margin-top:8px;font-weight:600}
.features{position:relative;z-index:1;padding:80px 52px}
.features h2{font-size:clamp(32px,4vw,52px);font-weight:800;text-align:center;margin-bottom:12px}
.features h2 span{background:linear-gradient(135deg,#00FFB3,#7B2FFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.feat-sub{text-align:center;color:rgba(224,255,246,.45);font-size:15px;margin-bottom:48px;font-weight:300}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:rgba(0,255,179,.03);border:1px solid rgba(0,255,179,.1);border-radius:12px;padding:36px 28px;transition:all .25s}
.card:hover{border-color:rgba(0,255,179,.3);transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,255,179,.1)}
.card-ico{font-size:36px;margin-bottom:20px}
.card h3{font-size:18px;font-weight:800;margin-bottom:10px}
.card p{font-size:14px;color:rgba(224,255,246,.5);line-height:1.7;font-weight:300}
.quote{position:relative;z-index:1;padding:80px 52px;text-align:center}
.quote q{font-size:clamp(20px,3vw,40px);font-weight:600;color:rgba(224,255,246,.85);font-style:normal;line-height:1.4}
.quote q strong{color:#00FFB3}
.cta-sec{position:relative;z-index:1;padding:80px 52px;text-align:center}
.cta-inner{background:rgba(0,255,179,.04);border:1px solid rgba(0,255,179,.15);border-radius:20px;padding:72px 40px}
.cta-sec h2{font-size:clamp(36px,5vw,68px);font-weight:800;margin-bottom:32px}
footer{position:relative;z-index:1;padding:36px 52px;border-top:1px solid rgba(0,255,179,.06);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:800;background:linear-gradient(135deg,#00FFB3,#7B2FFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.f-copy{font-size:12px;color:rgba(224,255,246,.3)}
@keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes shift{0%,100%{transform:translateX(-25%)}50%{transform:translateX(0%)}}
@media(max-width:768px){nav{padding:14px 20px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{margin:0 20px;grid-template-columns:1fr}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}.cta-inner{padding:48px 20px}footer{padding:28px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<div class="aurora"><div class="aurora-band a1"></div><div class="aurora-band a2"></div><div class="aurora-band a3"></div></div>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Explore</a><a href="#about">Vision</a><a href="#cta">Begin</a></div></nav>
<section class="hero"><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Built for <span>Discovery</span></h2><p class="feat-sub">{{SUBHEADLINE}}</p><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q><strong>{{BRAND_NAME}}</strong> — {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><div class="cta-inner"><h2>Start exploring<br><span style="background:linear-gradient(135deg,#00FFB3,#7B2FFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent">today.</span></h2><button class="btn" style="font-size:15px;padding:16px 52px">{{CTA_TEXT}} →</button></div></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 14. NEON PINK
  // ─────────────────────────────────────────────
  {
    name: 'Neon Pink', emoji: '💗',
    keywords: ['club','nightclub','fashion','pink','feminine','pop','trendy'],
    examples: ['Nightclub & lounge brand', 'Pop fashion label', 'Trendy beauty brand'],
    theme: { bg:'#000', text:'#fff', sub:'rgba(255,255,255,0.5)', acc:'#FF0099', border:'1px solid rgba(255,0,153,0.25)', cardBg:'rgba(255,0,153,0.04)', headFont:"'Bebas Neue',sans-serif", bodyFont:"'Inter',sans-serif", headWeight:'400', headCase:'uppercase', radius:'0', btnBg:'#FF0099', btnText:'#000' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#000;color:#fff;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 60px;background:rgba(0,0,0,.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,0,153,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Bebas Neue',sans-serif;font-size:24px;color:#FF0099;text-shadow:0 0 20px #FF0099;letter-spacing:.08em}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;letter-spacing:.15em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#FF0099}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 60px 80px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-200px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(255,0,153,.2) 0%,transparent 70%);pointer-events:none;animation:float 8s ease-in-out infinite}
h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(72px,12vw,180px);line-height:.88;text-transform:uppercase;letter-spacing:.02em;animation:appear .7s ease forwards;position:relative;z-index:1;margin-bottom:24px}
h1 em{color:#FF0099;font-style:normal;text-shadow:0 0 40px #FF0099,0 0 80px rgba(255,0,153,.4)}
.sub{font-size:15px;color:rgba(255,255,255,.5);line-height:1.8;max-width:460px;margin-bottom:40px;font-weight:300;position:relative;z-index:1}
.btn{display:inline-block;padding:14px 44px;background:#FF0099;color:#000;border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:all .2s;box-shadow:0 0 30px rgba(255,0,153,.4);position:relative;z-index:1}
.btn:hover{box-shadow:0 0 60px rgba(255,0,153,.7);background:#ff33bb}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,0,153,.12);border-bottom:1px solid rgba(255,0,153,.12)}
.stat{padding:48px 60px;border-right:1px solid rgba(255,0,153,.08)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Bebas Neue',sans-serif;font-size:72px;color:#FF0099;text-shadow:0 0 20px rgba(255,0,153,.5);line-height:1}
.stat-l{font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:80px 60px}
.features h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,6vw,96px);text-transform:uppercase;margin-bottom:48px;color:#fff}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,0,153,.12)}
.card{background:#000;padding:40px 28px;transition:background .2s}
.card:hover{background:rgba(255,0,153,.05)}
.card-ico{font-size:40px;margin-bottom:20px}
.card h3{font-family:'Bebas Neue',sans-serif;font-size:26px;text-transform:uppercase;color:#FF0099;margin-bottom:10px;letter-spacing:.05em}
.card p{font-size:13px;color:rgba(255,255,255,.45);line-height:1.75;font-weight:300}
.quote{padding:80px 60px;text-align:center;border-top:1px solid rgba(255,0,153,.1)}
.quote q{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,6vw,88px);text-transform:uppercase;color:#FF0099;text-shadow:0 0 40px rgba(255,0,153,.4);font-style:normal;letter-spacing:.02em}
.cta-sec{padding:80px 60px;text-align:center}
.cta-sec h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(56px,9vw,130px);text-transform:uppercase;line-height:.9;margin-bottom:36px;letter-spacing:.02em}
footer{padding:36px 60px;border-top:1px solid rgba(255,0,153,.08);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Bebas Neue',sans-serif;font-size:18px;color:#FF0099;text-shadow:0 0 10px #FF0099}
.f-copy{font-size:11px;color:rgba(255,255,255,.25)}
@keyframes appear{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}
@keyframes float{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,30px)}}
@media(max-width:768px){nav{padding:16px 24px}.nav-links{display:none}.hero{padding:110px 24px 60px}.stats{grid-template-columns:1fr}.stat{padding:32px 24px;border-right:none;border-bottom:1px solid rgba(255,0,153,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 24px}footer{padding:28px 24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Vibes</a><a href="#about">About</a><a href="#cta">Join</a></div></nav>
<section class="hero"><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}} →</button></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>What We Do</h2><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Start <em style="color:#FF0099;font-style:normal">Now.</em></h2><button class="btn" style="font-size:14px;padding:18px 56px">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 15. PURE MONO
  // ─────────────────────────────────────────────
  {
    name: 'Pure Mono', emoji: '⬛',
    keywords: ['minimal','minimalist','clean','pure','zero','stark','void'],
    examples: ['Ultra-minimal design studio', 'Pure software product', 'Stark creative agency'],
    theme: { bg:'#000', text:'#fff', sub:'rgba(255,255,255,0.45)', acc:'#fff', border:'1px solid rgba(255,255,255,0.1)', cardBg:'rgba(255,255,255,0.03)', headFont:"'Inter',sans-serif", bodyFont:"'Inter',sans-serif", headWeight:'800', headCase:'none', radius:'0', btnBg:'#fff', btnText:'#000' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#000;color:#fff;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 60px;background:rgba(0,0,0,.95);border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:16px;font-weight:800;letter-spacing:-.02em}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(255,255,255,.35);text-decoration:none;font-size:12px;font-weight:400;letter-spacing:.08em;transition:color .2s}
.nav-links a:hover{color:#fff}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:120px 60px 80px;border-bottom:1px solid rgba(255,255,255,.06)}
h1{font-size:clamp(64px,10vw,140px);font-weight:900;line-height:.88;letter-spacing:-.04em;margin-bottom:40px;animation:enter .8s ease forwards}
h1 .dim{font-weight:200;color:rgba(255,255,255,.2)}
.hero-row{display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.sub{font-size:16px;color:rgba(255,255,255,.4);line-height:1.75;max-width:400px;font-weight:300}
.btn{padding:14px 36px;background:#fff;color:#000;border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.06em;cursor:pointer;transition:opacity .2s;flex-shrink:0}
.btn:hover{opacity:.85}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid rgba(255,255,255,.06)}
.stat{padding:48px 60px;border-right:1px solid rgba(255,255,255,.04)}
.stat:last-child{border-right:none}
.stat-n{font-size:64px;font-weight:200;line-height:1;color:#fff}
.stat-l{font-size:11px;color:rgba(255,255,255,.25);letter-spacing:.2em;text-transform:uppercase;margin-top:8px;font-weight:400}
.features{padding:80px 60px;border-bottom:1px solid rgba(255,255,255,.04)}
.features h2{font-size:clamp(28px,3vw,44px);font-weight:800;margin-bottom:48px;letter-spacing:-.03em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.04)}
.card{background:#000;padding:36px 28px;transition:background .2s}
.card:hover{background:rgba(255,255,255,.02)}
.card-ico{font-size:32px;margin-bottom:20px}
.card h3{font-size:17px;font-weight:700;margin-bottom:10px;letter-spacing:-.02em}
.card p{font-size:13px;color:rgba(255,255,255,.35);line-height:1.75;font-weight:300}
.quote{padding:80px 60px;border-bottom:1px solid rgba(255,255,255,.04)}
.quote q{font-size:clamp(20px,3vw,44px);font-weight:200;color:rgba(255,255,255,.7);line-height:1.4;font-style:normal;letter-spacing:-.02em}
.cta-sec{padding:80px 60px;display:flex;align-items:center;justify-content:space-between;gap:40px}
.cta-sec h2{font-size:clamp(40px,7vw,100px);font-weight:900;letter-spacing:-.04em;line-height:.9;flex:1}
.cta-sec h2 .outline{-webkit-text-stroke:1px #fff;color:transparent}
footer{padding:36px 60px;border-top:1px solid rgba(255,255,255,.04);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;font-weight:800;letter-spacing:-.02em}
.f-copy{font-size:11px;color:rgba(255,255,255,.2)}
@keyframes enter{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@media(max-width:768px){nav{padding:16px 24px}.nav-links{display:none}.hero{padding:110px 24px 60px}.hero-row{flex-direction:column;align-items:flex-start;gap:24px}.stats{grid-template-columns:1fr}.stat{padding:36px 24px;border-right:none;border-bottom:1px solid rgba(255,255,255,.04)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 24px}.cta-sec{flex-direction:column}footer{padding:28px 24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><h1>{{HEADLINE_A}}<br><span class="dim">{{HEADLINE_B}}</span><br>{{HEADLINE_C}}</h1><div class="hero-row"><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>What we do.</h2><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2><span class="outline">Ready</span><br>to begin?</h2><button class="btn" style="font-size:14px;padding:18px 52px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 16. SWISS GRID
  // ─────────────────────────────────────────────
  {
    name: 'Swiss Grid', emoji: '🇨🇭',
    keywords: ['design','swiss','grid','system','rational','graphic'],
    examples: ['Graphic design studio', 'Swiss-style design agency', 'Systematic brand identity firm'],
    theme: { bg:'#FFF', text:'#000', sub:'#555', acc:'#FF0000', border:'1px solid #000', cardBg:'#FFF', headFont:"'Arial',sans-serif", bodyFont:"'Arial',sans-serif", headWeight:'900', headCase:'uppercase', radius:'0', btnBg:'#FF0000', btnText:'#FFF' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#fff;color:#000;font-family:Arial,Helvetica,sans-serif;overflow-x:hidden}
.grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px);background-size:24px 24px;pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:#fff;border-bottom:2px solid #000;display:flex;align-items:stretch;height:56px}
.logo{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;padding:0 28px;border-right:2px solid #000;display:flex;align-items:center}
.nav-links{display:flex}
.nav-links a{color:#000;text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:0 20px;border-right:1px solid rgba(0,0,0,.12);display:flex;align-items:center;transition:background .15s,color .15s}
.nav-links a:hover{background:#FF0000;color:#fff}
.hero{position:relative;z-index:1;min-height:100vh;padding:80px 60px 0;border-bottom:2px solid #000;display:grid;grid-template-columns:1fr 280px;gap:0;align-items:end}
.hero-left{padding-bottom:60px}
.hero-col-label{font-size:9px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#FF0000;margin-bottom:20px;border-left:3px solid #FF0000;padding-left:10px}
h1{font-size:clamp(60px,9vw,130px);font-weight:900;text-transform:uppercase;line-height:.88;letter-spacing:-.02em;animation:slideIn .6s ease forwards;margin-bottom:40px}
h1 span{color:#FF0000}
.hero-right{border-left:2px solid #000;padding:60px 28px;display:flex;flex-direction:column;justify-content:flex-end;gap:20px;align-self:stretch;margin-top:56px}
.sub{font-size:14px;color:#444;line-height:1.7;font-weight:400}
.btn{padding:13px 0;background:#FF0000;color:#fff;border:2px solid #FF0000;font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;transition:background .15s,color .15s;width:100%}
.btn:hover{background:#000;border-color:#000}
.stats{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);border-bottom:2px solid #000}
.stat{padding:40px 60px;border-right:2px solid #000}
.stat:last-child{border-right:none}
.stat-n{font-size:56px;font-weight:900;color:#000;line-height:1}
.stat-n span{color:#FF0000}
.stat-l{font-size:9px;font-weight:700;color:#888;letter-spacing:.25em;text-transform:uppercase;margin-top:6px}
.features{position:relative;z-index:1;padding:60px;border-bottom:2px solid #000}
.feat-hdr{display:flex;align-items:center;gap:0;margin-bottom:40px;border-bottom:2px solid #000;padding-bottom:16px}
.feat-hdr h2{font-size:clamp(28px,4vw,52px);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;flex:1}
.feat-hdr span{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#888;border:1px solid #888;padding:4px 12px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:2px solid #000}
.card{padding:36px 28px;border-right:2px solid #000}
.card:last-child{border-right:none}
.card-ico{font-size:40px;margin-bottom:16px;display:block}
.card h3{font-size:16px;font-weight:900;text-transform:uppercase;margin-bottom:8px;letter-spacing:.02em}
.card p{font-size:12px;color:#555;line-height:1.7}
.quote{position:relative;z-index:1;padding:60px;background:#FF0000;color:#fff}
.quote q{font-size:clamp(24px,4vw,56px);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;font-style:normal;line-height:1}
.cta-sec{position:relative;z-index:1;padding:60px;display:flex;align-items:center;justify-content:space-between;gap:40px;border-bottom:2px solid #000}
.cta-sec h2{font-size:clamp(36px,6vw,80px);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.9;flex:1}
footer{position:relative;z-index:1;padding:32px 60px;display:flex;justify-content:space-between;align-items:center;border-top:2px solid #000}
.f-logo{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.05em}
.f-copy{font-size:10px;color:#888;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}
@keyframes tick{0%,49%{opacity:1}50%,100%{opacity:0}}
@media(max-width:768px){nav .nav-links{display:none}.hero{grid-template-columns:1fr;padding:80px 24px 0}.hero-right{border-left:none;border-top:2px solid #000;margin-top:0}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:2px solid #000}.features,.quote,.cta-sec{padding:40px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:2px solid #000}.cta-sec{flex-direction:column}footer{padding:24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<div class="grid-bg"></div>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-left"><div class="hero-col-label">{{BRAND_NAME}} — Est. 2025</div><h1>{{HEADLINE_A}}<br><span>{{HEADLINE_B}}</span><br>{{HEADLINE_C}}</h1></div><div class="hero-right"><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}<span>+</span></div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-hdr"><h2>Services</h2><span>Selected 2025</span></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Start<br>Here.</h2><button class="btn" style="padding:16px 48px;width:auto;font-size:13px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 17. BROADSHEET
  // ─────────────────────────────────────────────
  {
    name: 'Broadsheet', emoji: '📰',
    keywords: ['news','newspaper','journal','press','media','writing','blog'],
    examples: ['Independent news publication', 'Long-form writing journal', 'Digital media press'],
    theme: { bg:'#F2EDE3', text:'#111', sub:'#555', acc:'#111', border:'1px solid #CCC', cardBg:'#F2EDE3', headFont:"'Libre Baskerville',serif", bodyFont:"'Libre Baskerville',serif", headWeight:'700', headCase:'none', radius:'0', btnBg:'#111', btnText:'#F2EDE3' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#F2EDE3;color:#111;font-family:'Libre Baskerville',serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:#F2EDE3;border-bottom:3px double #111;display:flex;flex-direction:column}
.nav-top{padding:10px 48px;text-align:center;border-bottom:1px solid #CCC;font-size:10px;color:#888;letter-spacing:.2em;text-transform:uppercase}
.nav-main{padding:12px 48px;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Libre Baskerville',serif;font-size:28px;font-weight:700;color:#111;letter-spacing:-.02em}
.nav-links{display:flex;gap:32px}
.nav-links a{color:#555;text-decoration:none;font-size:11px;font-style:italic;transition:color .2s}
.nav-links a:hover{color:#111}
.hero{padding:140px 48px 0;border-bottom:3px double #111}
.issue-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#888;margin-bottom:20px}
h1{font-size:clamp(48px,7vw,104px);font-weight:700;line-height:.9;letter-spacing:-.03em;margin-bottom:0;animation:fadeIn .8s ease forwards}
h1 em{font-style:italic}
.hero-divider{border:none;border-top:1px solid #CCC;margin:28px 0}
.hero-cols{display:grid;grid-template-columns:1fr 1fr;gap:48px;padding-bottom:48px}
.sub{font-size:16px;color:#444;line-height:1.75;font-style:italic}
.hero-right{display:flex;flex-direction:column;justify-content:space-between}
.btn{padding:12px 28px;background:#111;color:#F2EDE3;border:none;font-family:'Libre Baskerville',serif;font-size:12px;cursor:pointer;transition:background .2s;align-self:flex-start}
.btn:hover{background:#333}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:3px double #111}
.stat{padding:36px 48px;border-right:1px solid #CCC;text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:700;line-height:1}
.stat-l{font-size:10px;color:#888;letter-spacing:.15em;text-transform:uppercase;margin-top:6px;font-style:italic}
.features{padding:60px 48px;border-bottom:3px double #111}
.feat-hdr{text-align:center;margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #CCC}
.feat-hdr h2{font-size:clamp(28px,4vw,52px);font-weight:700;font-style:italic}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:36px}
.card{border-top:3px solid #111;padding-top:24px}
.card-ico{font-size:36px;margin-bottom:14px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px}
.card p{font-size:13px;color:#555;line-height:1.75;font-style:italic}
.quote{padding:60px 48px;text-align:center;background:#111;color:#F2EDE3}
.quote q{font-family:'Libre Baskerville',serif;font-size:clamp(20px,3vw,40px);font-style:italic;font-weight:400;line-height:1.4}
.cta-sec{padding:60px 48px;display:flex;align-items:center;justify-content:space-between;gap:40px;border-top:3px double #111}
.cta-sec h2{font-size:clamp(32px,5vw,72px);font-weight:700;line-height:.95;font-style:italic;flex:1}
footer{padding:32px 48px;border-top:3px double #111;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:18px;font-weight:700;font-style:italic}
.f-copy{font-size:10px;color:#888;letter-spacing:.08em}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scanline{from{background-position:0 0}to{background-position:0 100%}}
@media(max-width:768px){nav .nav-links{display:none}.hero{padding:110px 24px 0}.hero-cols{grid-template-columns:1fr}.stats{grid-template-columns:1fr}.stat{padding:24px;border-right:none;border-bottom:1px solid #CCC}.features{padding:40px 24px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:40px 24px}.cta-sec{flex-direction:column}footer{padding:24px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="nav-top">EST. 2025 · {{BRAND_NAME}} · INDEPENDENT PRESS</div><div class="nav-main"><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Subscribe</a></div></div></nav>
<section class="hero"><div class="issue-label">Volume I · Issue 1 · 2025</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><hr class="hero-divider"><div class="hero-cols"><p class="sub">{{SUBHEADLINE}}</p><div class="hero-right"><p style="font-size:13px;color:#888;font-style:italic;margin-bottom:20px">"{{QUOTE}}"</p><button class="btn">{{CTA_TEXT}}</button></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-hdr"><h2>What We Cover</h2></div><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2><em>Read</em><br>More.</h2><button class="btn" style="font-size:13px;padding:14px 36px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo"><em>{{BRAND_NAME}}</em></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 18. KRAFT PAPER
  // ─────────────────────────────────────────────
  {
    name: 'Kraft Paper', emoji: '📦',
    keywords: ['handmade','craft','artisan','natural','organic','small business','local'],
    examples: ['Handmade craft marketplace', 'Artisan bakery brand', 'Local small business'],
    theme: { bg:'#C8A882', text:'#2C1810', sub:'rgba(44,24,16,0.6)', acc:'#2C1810', border:'2px solid rgba(44,24,16,0.3)', cardBg:'rgba(200,168,130,0.5)', headFont:"'Merriweather',serif", bodyFont:"'Merriweather',serif", headWeight:'700', headCase:'none', radius:'2px', btnBg:'#2C1810', btnText:'#C8A882' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#C8A882;color:#2C1810;font-family:'Merriweather',serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");pointer-events:none;z-index:9999}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 48px;background:rgba(160,120,72,.95);backdrop-filter:blur(8px);border-bottom:2px solid rgba(44,24,16,.25);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:700;color:#2C1810;font-style:italic}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(44,24,16,.6);text-decoration:none;font-size:12px;font-style:italic;transition:color .2s}
.nav-links a:hover{color:#2C1810}
.hero{min-height:100vh;padding:120px 48px 80px;display:flex;flex-direction:column;justify-content:center;position:relative}
.torn-top{position:absolute;top:0;left:0;right:0;height:20px;background:repeating-linear-gradient(90deg,#C8A882 0,#C8A882 12px,transparent 12px,transparent 16px);clip-path:polygon(0 100%,2% 40%,4% 80%,7% 30%,9% 70%,12% 20%,15% 60%,18% 40%,21% 75%,24% 30%,27% 65%,30% 20%,33% 55%,36% 35%,39% 70%,42% 25%,45% 60%,48% 40%,51% 70%,54% 30%,57% 65%,60% 25%,63% 60%,66% 35%,69% 70%,72% 25%,75% 55%,78% 40%,81% 70%,84% 30%,87% 65%,90% 20%,93% 55%,96% 35%,98% 65%,100% 40%,100% 100%)}
.stamp{display:inline-block;border:3px solid rgba(44,24,16,.4);padding:6px 16px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(44,24,16,.6);transform:rotate(-1deg);margin-bottom:28px;font-weight:400}
h1{font-size:clamp(44px,7vw,96px);font-weight:700;line-height:1;font-style:italic;margin-bottom:24px;animation:inkIn .8s ease forwards}
h1 em{font-style:normal;text-decoration:underline;text-underline-offset:6px}
.sub{font-size:15px;color:rgba(44,24,16,.6);line-height:1.8;max-width:500px;margin-bottom:40px;font-weight:300;font-style:italic}
.btn{padding:14px 36px;background:#2C1810;color:#C8A882;border:none;font-family:'Merriweather',serif;font-size:13px;cursor:pointer;transition:all .2s}
.btn:hover{background:#4a2e1e}
.stats{display:grid;grid-template-columns:repeat(3,1fr);background:rgba(160,120,72,.4);border-top:2px solid rgba(44,24,16,.2);border-bottom:2px solid rgba(44,24,16,.2)}
.stat{padding:40px 48px;border-right:1px solid rgba(44,24,16,.15)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:700;font-style:italic;line-height:1}
.stat-l{font-size:10px;color:rgba(44,24,16,.5);letter-spacing:.15em;text-transform:uppercase;margin-top:6px;font-weight:300}
.features{padding:80px 48px}
.feat-hdr{margin-bottom:48px;border-bottom:2px solid rgba(44,24,16,.2);padding-bottom:20px}
.feat-hdr h2{font-size:clamp(28px,4vw,52px);font-weight:700;font-style:italic}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.card{background:rgba(160,120,72,.3);border:1px solid rgba(44,24,16,.15);padding:32px 24px}
.card-ico{font-size:36px;margin-bottom:16px}
.card h3{font-size:17px;font-weight:700;font-style:italic;margin-bottom:10px}
.card p{font-size:13px;color:rgba(44,24,16,.6);line-height:1.75;font-weight:300}
.quote{padding:60px 48px;text-align:center;background:rgba(44,24,16,.08);border-top:2px solid rgba(44,24,16,.2);border-bottom:2px solid rgba(44,24,16,.2)}
.quote q{font-size:clamp(18px,3vw,36px);font-style:italic;color:#2C1810;line-height:1.5}
.cta-sec{padding:80px 48px;display:flex;align-items:center;justify-content:space-between;gap:40px}
.cta-sec h2{font-size:clamp(32px,5vw,72px);font-weight:700;font-style:italic;line-height:1;flex:1}
footer{padding:32px 48px;border-top:2px solid rgba(44,24,16,.2);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:700;font-style:italic}
.f-copy{font-size:10px;color:rgba(44,24,16,.45)}
@keyframes inkIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes stamp{0%{transform:rotate(-1deg) scale(1.1);opacity:0}100%{transform:rotate(-1deg) scale(1);opacity:1}}
@media(max-width:768px){nav{padding:14px 20px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 20px;border-right:none;border-bottom:1px solid rgba(44,24,16,.12)}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}.cta-sec{flex-direction:column}footer{padding:24px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Craft</a><a href="#about">Story</a><a href="#cta">Shop</a></div></nav>
<section class="hero"><div class="torn-top"></div><div class="stamp">Handmade · Est. 2025</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}} →</button></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-hdr"><h2>Our Craft</h2></div><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Made with<br>heart.</h2><button class="btn" style="font-size:14px;padding:16px 44px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 19. PASTEL DREAM
  // ─────────────────────────────────────────────
  {
    name: 'Pastel Dream', emoji: '🌸',
    keywords: ['cute','soft','pastel','dreamy','gentle','sweet','kawaii'],
    examples: ['Cute lifestyle brand', 'Soft skincare line', 'Kawaii merchandise shop'],
    theme: { bg:'#FEFAFE', text:'#3D2645', sub:'rgba(61,38,69,0.55)', acc:'#C084FC', border:'2px solid rgba(192,132,252,0.3)', cardBg:'rgba(251,113,133,0.05)', headFont:"'Quicksand',sans-serif", bodyFont:"'Quicksand',sans-serif", headWeight:'700', headCase:'none', radius:'100px', btnBg:'linear-gradient(135deg,#C084FC,#FB7185)', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#FEFAFE;color:#3D2645;font-family:'Quicksand',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 48px;background:rgba(254,250,254,.92);backdrop-filter:blur(12px);border-bottom:2px solid rgba(192,132,252,.15);display:flex;align-items:center;justify-content:space-between;border-radius:0 0 24px 24px}
.logo{font-size:20px;font-weight:700;background:linear-gradient(135deg,#C084FC,#FB7185);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:28px}
.nav-links a{color:rgba(61,38,69,.5);text-decoration:none;font-size:13px;font-weight:600;transition:color .2s}
.nav-links a:hover{color:#C084FC}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 32px 80px;position:relative;overflow:hidden}
.blob1{position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(192,132,252,.18) 0%,transparent 70%);top:-100px;left:-100px;animation:drift 12s ease-in-out infinite;pointer-events:none}
.blob2{position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(251,113,133,.15) 0%,transparent 70%);bottom:-80px;right:-80px;animation:drift 15s ease-in-out infinite reverse;pointer-events:none}
.blob3{position:absolute;width:300px;height:300px;background:radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%);top:40%;right:10%;animation:drift 10s ease-in-out infinite .5s;pointer-events:none}
.hero-tag{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;background:rgba(192,132,252,.1);border:2px solid rgba(192,132,252,.25);border-radius:100px;font-size:13px;color:#C084FC;font-weight:700;margin-bottom:28px;position:relative;z-index:1}
h1{font-size:clamp(44px,7vw,88px);font-weight:700;line-height:1.05;max-width:700px;margin-bottom:20px;position:relative;z-index:1;animation:floatIn .9s ease forwards}
h1 span{background:linear-gradient(135deg,#C084FC,#FB7185);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{font-size:17px;color:rgba(61,38,69,.55);line-height:1.75;max-width:480px;margin:0 auto 40px;font-weight:500;position:relative;z-index:1}
.btns{display:flex;gap:14px;justify-content:center;position:relative;z-index:1}
.btn{padding:14px 36px;background:linear-gradient(135deg,#C084FC,#FB7185);color:#fff;border:none;border-radius:100px;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 8px 30px rgba(192,132,252,.3)}
.btn:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(192,132,252,.45)}
.btn2{padding:14px 32px;background:transparent;border:2px solid rgba(192,132,252,.3);border-radius:100px;color:rgba(61,38,69,.6);font-family:'Quicksand',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#C084FC;color:#C084FC}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin:0 48px;background:#fff;border:2px solid rgba(192,132,252,.2);border-radius:24px;overflow:hidden;box-shadow:0 4px 40px rgba(192,132,252,.1)}
.stat{padding:36px 24px;text-align:center;border-right:1px solid rgba(192,132,252,.1)}
.stat:last-child{border-right:none}
.stat-n{font-size:48px;font-weight:700;background:linear-gradient(135deg,#C084FC,#FB7185);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.stat-l{font-size:13px;color:rgba(61,38,69,.45);margin-top:8px;font-weight:600}
.features{padding:80px 48px}
.feat-intro{text-align:center;margin-bottom:48px}
.feat-intro h2{font-size:clamp(28px,4vw,52px);font-weight:700;margin-bottom:12px}
.feat-intro h2 span{background:linear-gradient(135deg,#C084FC,#FB7185);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.feat-intro p{font-size:15px;color:rgba(61,38,69,.5);font-weight:500}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:2px solid rgba(192,132,252,.15);border-radius:24px;padding:36px 24px;text-align:center;transition:all .2s;box-shadow:0 2px 20px rgba(192,132,252,.06)}
.card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(192,132,252,.15);border-color:rgba(192,132,252,.35)}
.card-ico{font-size:40px;margin-bottom:16px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;color:#3D2645}
.card p{font-size:14px;color:rgba(61,38,69,.5);line-height:1.7;font-weight:500}
.quote{padding:80px 48px;text-align:center;background:linear-gradient(135deg,rgba(192,132,252,.08),rgba(251,113,133,.08));border-radius:32px;margin:0 32px}
.quote q{font-size:clamp(18px,3vw,36px);font-weight:600;color:#3D2645;font-style:normal;line-height:1.4}
.quote q span{background:linear-gradient(135deg,#C084FC,#FB7185);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.cta-sec{padding:80px 48px;text-align:center}
.cta-inner{background:#fff;border:2px solid rgba(192,132,252,.2);border-radius:32px;padding:64px 40px;box-shadow:0 8px 60px rgba(192,132,252,.08)}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:700;line-height:1.1;margin-bottom:28px}
footer{padding:40px 48px;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:700;background:linear-gradient(135deg,#C084FC,#FB7185);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.f-copy{font-size:12px;color:rgba(61,38,69,.35)}
@keyframes floatIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-20px) scale(1.05)}}
@media(max-width:768px){nav{padding:12px 20px;border-radius:0 0 16px 16px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{margin:0 20px;grid-template-columns:1fr}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote{margin:0 16px;padding:48px 24px}.cta-sec{padding:60px 20px}.cta-inner{padding:44px 20px}footer{padding:32px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Explore</a><a href="#about">About</a><a href="#cta">Join</a></div></nav>
<section class="hero"><div class="blob1"></div><div class="blob2"></div><div class="blob3"></div><div class="hero-tag">🌸 Welcome to {{BRAND_NAME}}</div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Learn more</button></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><div class="feat-intro"><h2>Everything you <span>adore</span></h2><p>{{SUBHEADLINE}}</p></div><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q><span>{{BRAND_NAME}}</span> — {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><div class="cta-inner"><h2>Start your<br><span style="background:linear-gradient(135deg,#C084FC,#FB7185);-webkit-background-clip:text;-webkit-text-fill-color:transparent">dream today.</span></h2><button class="btn" style="font-size:15px;padding:16px 48px">{{CTA_TEXT}} 🌸</button></div></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 20. GROOVY 70s
  // ─────────────────────────────────────────────
  {
    name: 'Groovy 70s', emoji: '🕺',
    keywords: ['vintage','70s','retro','groovy','classic','nostalgic','warm'],
    examples: ['Vintage record store', 'Retro lifestyle brand', 'Nostalgic food brand'],
    theme: { bg:'#E8D5AA', text:'#2D1B00', sub:'rgba(45,27,0,0.6)', acc:'#D4A017', border:'2px solid rgba(45,27,0,0.2)', cardBg:'rgba(212,160,23,0.1)', headFont:"'DM Serif Display',serif", bodyFont:"'Lato',sans-serif", headWeight:'400', headCase:'none', radius:'100px', btnBg:'#7B3F00', btnText:'#E8D5AA' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:#E8D5AA;color:#2D1B00;font-family:'Lato',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 52px;background:rgba(232,213,170,.95);backdrop-filter:blur(8px);border-bottom:2px solid rgba(45,27,0,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'DM Serif Display',serif;font-size:22px;font-style:italic;color:#7B3F00}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(45,27,0,.55);text-decoration:none;font-size:13px;letter-spacing:.08em;transition:color .2s;font-weight:700}
.nav-links a:hover{color:#D4A017}
.hero{min-height:100vh;padding:130px 52px 80px;display:flex;align-items:center;position:relative;overflow:hidden}
.circle1{position:absolute;width:400px;height:400px;border-radius:50%;background:rgba(212,160,23,.25);top:-100px;right:-100px;pointer-events:none}
.circle2{position:absolute;width:300px;height:300px;border-radius:50%;background:rgba(123,63,0,.15);bottom:-80px;left:10%;pointer-events:none;animation:spin 20s linear infinite}
.circle3{position:absolute;width:200px;height:200px;border-radius:50%;border:3px solid rgba(212,160,23,.3);top:30%;right:15%;pointer-events:none}
.hero-content{position:relative;z-index:1;max-width:760px}
.hero-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 20px;background:rgba(123,63,0,.12);border:2px solid rgba(123,63,0,.2);border-radius:100px;font-size:12px;color:#7B3F00;font-weight:700;margin-bottom:28px;letter-spacing:.08em;text-transform:uppercase}
h1{font-family:'DM Serif Display',serif;font-size:clamp(52px,9vw,120px);line-height:1;margin-bottom:28px;animation:slideUp .8s ease forwards}
h1 em{font-style:italic;color:#D4A017}
h1 span{font-style:italic;color:#7B3F00}
.sub{font-size:17px;color:rgba(45,27,0,.6);line-height:1.75;max-width:500px;margin-bottom:40px;font-weight:300}
.btns{display:flex;gap:14px}
.btn{padding:15px 40px;background:#7B3F00;color:#E8D5AA;border:none;border-radius:100px;font-family:'Lato',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s}
.btn:hover{background:#9D5100;transform:scale(1.02)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);background:rgba(45,27,0,.06);border-top:2px solid rgba(45,27,0,.12);border-bottom:2px solid rgba(45,27,0,.12)}
.stat{padding:44px 52px;border-right:1px solid rgba(45,27,0,.08)}
.stat:last-child{border-right:none}
.stat-n{font-family:'DM Serif Display',serif;font-size:60px;font-style:italic;color:#D4A017;line-height:1}
.stat-l{font-size:11px;color:rgba(45,27,0,.45);letter-spacing:.15em;text-transform:uppercase;margin-top:8px;font-weight:700}
.features{padding:80px 52px}
.feat-hdr{text-align:center;margin-bottom:52px}
.feat-hdr h2{font-family:'DM Serif Display',serif;font-size:clamp(32px,5vw,60px);font-style:italic;color:#2D1B00;margin-bottom:10px}
.feat-hdr h2 em{color:#D4A017;font-style:normal}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:rgba(212,160,23,.1);border:2px solid rgba(212,160,23,.2);border-radius:24px;padding:36px 24px;transition:all .2s}
.card:hover{transform:scale(1.02);background:rgba(212,160,23,.18)}
.card-ico{font-size:40px;margin-bottom:16px}
.card h3{font-family:'DM Serif Display',serif;font-size:22px;font-style:italic;color:#2D1B00;margin-bottom:10px}
.card p{font-size:14px;color:rgba(45,27,0,.55);line-height:1.7;font-weight:300}
.quote{padding:80px 52px;text-align:center;background:#7B3F00;color:#E8D5AA;position:relative;overflow:hidden}
.quote::before{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:rgba(212,160,23,.2);top:-100px;right:-50px}
.quote q{font-family:'DM Serif Display',serif;font-size:clamp(22px,4vw,48px);font-style:italic;line-height:1.3;position:relative;z-index:1}
.cta-sec{padding:80px 52px;text-align:center;background:#E8D5AA}
.cta-sec h2{font-family:'DM Serif Display',serif;font-size:clamp(36px,5vw,72px);font-style:italic;margin-bottom:32px;line-height:1.05}
.cta-sec h2 em{color:#D4A017;font-style:normal}
footer{padding:36px 52px;border-top:2px solid rgba(45,27,0,.12);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'DM Serif Display',serif;font-size:18px;font-style:italic;color:#7B3F00}
.f-copy{font-size:11px;color:rgba(45,27,0,.4);font-weight:300}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@media(max-width:768px){nav{padding:14px 20px}.nav-links{display:none}.hero{padding:110px 20px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 20px;border-right:none;border-bottom:1px solid rgba(45,27,0,.08)}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote,.cta-sec{padding:60px 20px}footer{padding:28px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Vibe</a><a href="#about">Story</a><a href="#cta">Connect</a></div></nav>
<section class="hero"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="hero-content"><div class="hero-badge">☮ Groovy since 2025</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br><span>{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}} →</button></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-hdr"><h2>What makes us <em>Groovy</em></h2></div><div class="grid"><div class="card"><div class="card-ico">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-ico">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote" id="about"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Let's get<br><em>Groovy.</em></h2><button class="btn" style="font-size:15px;padding:18px 52px">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ─────────────────────────────────────────────
  // 10. BLUEPRINT / TECHNICAL  (kept — do not remove this comment marker)
  // ─────────────────────────────────────────────
  {
    name: 'Blueprint', emoji: '📐',
    keywords: ['architecture', 'engineering', 'construction', 'design', 'technical', 'manufacturing', 'industrial', 'real estate', 'build', 'infrastructure', 'consulting', 'enterprise'],
    examples: ['Architecture & design firm', 'Civil engineering consultancy', 'Real estate development group'],
    theme: { bg:'#0C1F3F', text:'#E8F0FE', sub:'rgba(232,240,254,0.45)', acc:'#4A9EFF', border:'1px solid rgba(74,158,255,0.2)', cardBg:'#102346', headFont:"'Inter',sans-serif", bodyFont:"'JetBrains Mono',monospace", headWeight:'700', headCase:'none', radius:'0', btnBg:'#4A9EFF', btnText:'#0C1F3F' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
:root{--bg:#0C1F3F;--mid:#102346;--lt:#E8F0FE;--acc:#4A9EFF;--acc2:#7BC4FF;--dim:rgba(74,158,255,.12);--line:rgba(74,158,255,.2)}
body{background:var(--bg);color:var(--lt);font-family:'Inter',sans-serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0;opacity:.4}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 60px;background:rgba(12,31,63,.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);display:flex;align-items:stretch;height:64px}
.logo-wrap{display:flex;align-items:center;padding-right:32px;border-right:1px solid var(--line);gap:12px}
.logo-mark{width:32px;height:32px;border:2px solid var(--acc);position:relative;display:flex;align-items:center;justify-content:center}
.logo-mark::before{content:'';position:absolute;width:18px;height:18px;border:1.5px solid var(--acc2);top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg)}
.logo{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--lt);letter-spacing:.06em;text-transform:uppercase}
.nav-links{display:flex;margin-left:32px}
.nav-links a{color:rgba(232,240,254,.4);text-decoration:none;font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;padding:0 20px;display:flex;align-items:center;border-right:1px solid rgba(74,158,255,.08);transition:color .15s,background .15s}
.nav-links a:hover{color:var(--acc);background:var(--dim)}
.nav-links a::before{content:'[';color:rgba(74,158,255,.3);margin-right:4px}
.nav-links a::after{content:']';color:rgba(74,158,255,.3);margin-left:4px}
.spacer{flex:1}
.nav-badge{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--acc);padding:0 20px;border-left:1px solid var(--line)}
.badge-dot{width:6px;height:6px;background:var(--acc);border-radius:50%;animation:pulse 2s ease-in-out infinite}
.hero{position:relative;z-index:1;padding:120px 60px 0;min-height:100vh;display:flex;flex-direction:column;justify-content:center}
.hero-coords{position:absolute;top:80px;right:60px;font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(74,158,255,.3);line-height:1.8;letter-spacing:.05em}
.hero-label{display:flex;align-items:center;gap:12px;margin-bottom:24px}
.hero-label span{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--acc);letter-spacing:.15em;text-transform:uppercase}
.label-line{height:1px;width:60px;background:var(--acc);opacity:.5}
h1{font-size:clamp(52px,7vw,108px);font-weight:700;line-height:.95;letter-spacing:-.03em;max-width:820px;margin-bottom:36px;animation:draw .9s ease forwards}
h1 .acc{color:var(--acc);font-weight:300}
h1 .thin{font-weight:200;color:rgba(232,240,254,.5)}
.sub{font-size:16px;color:rgba(232,240,254,.5);line-height:1.75;max-width:520px;margin-bottom:48px;font-weight:300}
.btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:80px}
.btn{padding:14px 36px;background:var(--acc);color:#0C1F3F;border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;clip-path:polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px);transition:background .2s}
.btn:hover{background:var(--acc2)}
.btn2{padding:14px 32px;background:transparent;border:1px solid var(--line);color:rgba(232,240,254,.5);font-family:'Inter',sans-serif;font-size:13px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;clip-path:polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px);transition:all .2s}
.btn2:hover{border-color:var(--acc);color:var(--acc)}
.stats{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);margin:0 60px}
.stat{padding:48px 40px;border-right:1px solid var(--line);position:relative}
.stat:last-child{border-right:none}
.stat-tag{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(74,158,255,.4);letter-spacing:.15em;text-transform:uppercase;margin-bottom:16px}
.stat-n{font-size:60px;font-weight:700;color:var(--acc);line-height:1;letter-spacing:-.03em}
.stat-l{font-size:12px;color:rgba(232,240,254,.35);letter-spacing:.1em;text-transform:uppercase;margin-top:8px;font-weight:500}
.stat-corner{position:absolute;bottom:12px;right:12px;width:16px;height:16px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.features{position:relative;z-index:1;padding:80px 60px}
.feat-top{display:flex;align-items:center;gap:24px;margin-bottom:48px}
.feat-top h2{font-size:clamp(28px,3vw,44px);font-weight:700;letter-spacing:-.02em}
.feat-top h2 span{color:var(--acc);font-weight:300}
.feat-sep{flex:1;height:1px;background:linear-gradient(90deg,var(--line),transparent)}
.feat-count{font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(74,158,255,.35);flex-shrink:0}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line)}
.card{background:var(--bg);padding:40px 32px;position:relative;transition:background .2s}
.card:hover{background:var(--mid)}
.card-corner-tl{position:absolute;top:12px;left:12px;width:16px;height:16px;border-left:1px solid var(--acc);border-top:1px solid var(--acc);opacity:.4}
.card-corner-br{position:absolute;bottom:12px;right:12px;width:16px;height:16px;border-right:1px solid var(--acc);border-bottom:1px solid var(--acc);opacity:.4}
.card-ico{font-size:36px;margin-bottom:20px;display:block}
.card-ref{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(74,158,255,.3);letter-spacing:.15em;margin-bottom:12px}
.card h3{font-size:18px;font-weight:600;color:var(--lt);margin-bottom:12px;letter-spacing:-.01em}
.card p{font-size:13px;color:rgba(232,240,254,.45);line-height:1.7;font-weight:300}
.quote{position:relative;z-index:1;padding:80px 60px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.quote-inner{background:var(--dim);border:1px solid var(--line);padding:56px;position:relative;clip-path:polygon(16px 0%,100% 0%,100% calc(100% - 16px),calc(100% - 16px) 100%,0% 100%,0% 16px)}
.quote q{font-size:clamp(18px,3vw,34px);font-weight:300;color:var(--lt);line-height:1.5;font-style:normal;letter-spacing:-.01em}
.quote q strong{font-weight:700;color:var(--acc)}
.cta-sec{position:relative;z-index:1;padding:80px 60px;display:flex;align-items:center;gap:60px;justify-content:space-between}
.cta-sec h2{font-size:clamp(36px,6vw,88px);font-weight:700;letter-spacing:-.03em;line-height:.95;flex:1}
.cta-sec h2 span{color:var(--acc);font-weight:200}
footer{position:relative;z-index:1;padding:32px 60px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:var(--lt);letter-spacing:.08em;text-transform:uppercase}
.f-copy{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(232,240,254,.2);letter-spacing:.06em}
@keyframes draw{from{opacity:0;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0% 0 0)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
@media(max-width:768px){nav{padding:0 20px}.nav-links{display:none}.hero{padding:90px 20px 0}.stats{margin:0 20px;grid-template-columns:1fr}.stat{border-right:none;border-bottom:1px solid var(--line)}.features{padding:60px 20px}.grid{grid-template-columns:1fr}.quote{padding:60px 20px}.quote-inner{padding:36px 24px}.cta-sec{padding:60px 20px;flex-direction:column}footer{padding:28px 20px;flex-direction:column;gap:10px;text-align:center}}
</style></head><body>
<nav><div class="logo-wrap"><div class="logo-mark"></div><div class="logo">{{BRAND_NAME}}</div></div><div class="nav-links"><a href="#features">Systems</a><a href="#about">Mission</a><a href="#cta">Engage</a></div><div class="spacer"></div><div class="nav-badge"><div class="badge-dot"></div>SYSTEM ACTIVE</div></nav>
<section class="hero"><div class="hero-coords">LAT: 40.7128°N<br>LON: 74.0060°W<br>REF: {{BRAND_NAME}}-001</div><div class="hero-label"><div class="label-line"></div><span>Project: {{BRAND_NAME}}</span></div><h1>{{HEADLINE_A}}<br><span class="acc">{{HEADLINE_B}}</span><br><span class="thin">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">View Documentation</button></div></section>
<section class="stats"><div class="stat"><div class="stat-tag">Metric A</div><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div><div class="stat-corner"></div></div><div class="stat"><div class="stat-tag">Metric B</div><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div><div class="stat-corner"></div></div><div class="stat"><div class="stat-tag">Metric C</div><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div><div class="stat-corner"></div></div></section>
<section class="features" id="features"><div class="feat-top"><h2>Core <span>Systems</span></h2><div class="feat-sep"></div><span class="feat-count">03 MODULES</span></div><div class="grid"><div class="card"><div class="card-corner-tl"></div><span class="card-ico">{{FEAT_1_ICON}}</span><div class="card-ref">MODULE_01</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p><div class="card-corner-br"></div></div><div class="card"><div class="card-corner-tl"></div><span class="card-ico">{{FEAT_2_ICON}}</span><div class="card-ref">MODULE_02</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p><div class="card-corner-br"></div></div><div class="card"><div class="card-corner-tl"></div><span class="card-ico">{{FEAT_3_ICON}}</span><div class="card-ref">MODULE_03</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p><div class="card-corner-br"></div></div></div></section>
<section class="quote" id="about"><div class="quote-inner"><q><strong>{{BRAND_NAME}}:</strong> {{QUOTE}}</q></div></section>
<section class="cta-sec" id="cta"><h2>Begin Your<br><span>Project.</span></h2><button class="btn" style="font-size:14px;padding:18px 52px;flex-shrink:0">{{CTA_TEXT}} →</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025 · ALL RIGHTS RESERVED</div></footer>
</body></html>`,
  },

  // ── 11. SYNTHWAVE ──────────────────────────────
  {
    name: 'Synthwave', emoji: '🌆',
    keywords: ['gaming','music','retro','80s','synth','neon','night'],
    examples: ['80s synth music streaming platform','Retro gaming community','Night drive app'],
    theme: { bg:'#0a0015', text:'#f0e6ff', sub:'rgba(240,230,255,0.5)', acc:'#ff006e', border:'1px solid rgba(255,0,110,0.2)', cardBg:'rgba(255,255,255,0.03)', headFont:"'Russo One',sans-serif", bodyFont:"'Share Tech Mono',monospace", headWeight:'900', headCase:'uppercase', radius:'0', btnBg:'#ff006e', btnText:'#0a0015' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0015;color:#f0e6ff;font-family:'Share Tech Mono',monospace;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 60px;background:rgba(10,0,21,.92);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,0,110,.2);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Russo One',sans-serif;font-size:22px;color:#00f5d4;text-shadow:0 0 20px #00f5d4;letter-spacing:.08em}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(240,230,255,.5);text-decoration:none;font-size:11px;letter-spacing:.15em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#ff006e}
.hero{min-height:100vh;padding:130px 60px 60px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.grid-floor{position:absolute;bottom:0;left:0;right:0;height:55%;perspective:400px;transform-style:preserve-3d}
.grid-floor::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,0,110,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,110,.35) 1px,transparent 1px);background-size:60px 60px;transform:rotateX(60deg);transform-origin:top center}
.grid-floor::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,#0a0015 10%,transparent)}
.sun{position:absolute;bottom:28%;left:50%;transform:translateX(-50%);width:260px;height:130px;border-radius:130px 130px 0 0;background:linear-gradient(180deg,#ff9900,#ff006e);box-shadow:0 0 60px rgba(255,0,110,.6);overflow:hidden}
.sun::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(transparent,transparent 12px,#0a0015 12px,#0a0015 14px)}
.hero-content{position:relative;z-index:2;max-width:760px}
h1{font-family:'Russo One',sans-serif;font-size:clamp(48px,8vw,110px);line-height:.95;text-transform:uppercase;margin-bottom:24px;animation:fadeUp .8s ease forwards}
h1 span{background:linear-gradient(90deg,#ff006e,#00f5d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-shadow:none;display:block}
.sub{font-size:13px;color:rgba(240,230,255,.55);line-height:1.9;max-width:440px;margin-bottom:40px}
.btn{padding:14px 40px;background:#ff006e;color:#0a0015;border:none;font-family:'Share Tech Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .2s;box-shadow:0 0 28px rgba(255,0,110,.5)}
.btn:hover{box-shadow:0 0 50px rgba(255,0,110,.8);transform:translateY(-2px)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(255,0,110,.15);border-bottom:1px solid rgba(255,0,110,.15)}
.stat{padding:44px 60px;border-right:1px solid rgba(255,0,110,.1)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Russo One',sans-serif;font-size:52px;color:#ff006e;text-shadow:0 0 20px rgba(255,0,110,.6);line-height:1}
.stat-l{font-size:10px;color:rgba(240,230,255,.4);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:100px 60px}
.features h2{font-family:'Russo One',sans-serif;font-size:48px;text-transform:uppercase;margin-bottom:52px;color:#f0e6ff}
.features h2 span{color:#00f5d4;text-shadow:0 0 15px #00f5d4}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(255,0,110,.08)}
.card{background:#0a0015;padding:38px 30px;transition:background .2s;border-top:2px solid transparent}
.card:hover{background:rgba(255,0,110,.06);border-top-color:#ff006e}
.card-ico{font-size:32px;display:block;margin-bottom:18px}
.card h3{font-family:'Russo One',sans-serif;font-size:18px;text-transform:uppercase;margin-bottom:12px;color:#f0e6ff}
.card p{font-size:12px;color:rgba(240,230,255,.5);line-height:1.8}
.quote{padding:80px 60px;text-align:center;background:linear-gradient(135deg,rgba(255,0,110,.06),rgba(0,245,212,.06));border-top:1px solid rgba(255,0,110,.12);border-bottom:1px solid rgba(255,0,110,.12)}
.quote q{font-family:'Russo One',sans-serif;font-size:clamp(18px,3vw,30px);line-height:1.5;text-transform:uppercase;color:#f0e6ff;max-width:760px;display:inline-block}
.cta-sec{padding:100px 60px;text-align:center}
.cta-sec h2{font-family:'Russo One',sans-serif;font-size:clamp(40px,7vw,90px);text-transform:uppercase;margin-bottom:36px;line-height:1}
.cta-sec h2 span{color:#ff006e;text-shadow:0 0 30px rgba(255,0,110,.6)}
footer{padding:32px 60px;border-top:1px solid rgba(255,0,110,.12);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Russo One',sans-serif;font-size:18px;color:#00f5d4}
.f-copy{font-size:10px;color:rgba(240,230,255,.3);letter-spacing:.1em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:16px 24px}.hero{padding:110px 24px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(255,0,110,.1)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}.sun{width:180px;height:90px}footer{padding:24px;flex-direction:column;gap:12px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Start</a></div></nav>
<section class="hero"><div class="grid-floor"></div><div class="sun"></div><div class="hero-content"><h1>{{HEADLINE_A}}<span>{{HEADLINE_B}}</span>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}} ▶</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Core <span>Modules</span></h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Join the <span>Wave</span></h2><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 12. CLEAN WHITE SAAS ───────────────────────
  {
    name: 'Clean White SaaS', emoji: '🍎',
    keywords: ['saas','software','startup','app','product','tech','business'],
    examples: ['Project management tool','Analytics dashboard product','Customer support SaaS'],
    theme: { bg:'#ffffff', text:'#111827', sub:'rgba(17,24,39,0.55)', acc:'#2563eb', border:'1px solid rgba(0,0,0,0.08)', cardBg:'#f9fafb', headFont:"'Inter',sans-serif", bodyFont:"'Inter',sans-serif", headWeight:'700', headCase:'none', radius:'12px', btnBg:'#2563eb', btnText:'#ffffff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#111827;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 60px;height:64px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.07);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:18px;font-weight:800;color:#111827;letter-spacing:-.02em}
.logo span{color:#2563eb}
.nav-links{display:flex;gap:32px}
.nav-links a{color:#6b7280;text-decoration:none;font-size:14px;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#111827}
.hero{padding:140px 60px 100px;text-align:center;position:relative}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:100px;padding:6px 16px;font-size:12px;font-weight:600;color:#2563eb;margin-bottom:28px}
.hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:#2563eb;animation:pulse 1.5s ease-in-out infinite}
h1{font-size:clamp(40px,6vw,76px);font-weight:800;line-height:1.1;letter-spacing:-.03em;margin-bottom:24px;max-width:800px;margin-left:auto;margin-right:auto;animation:fadeUp .7s ease forwards}
h1 span{color:#2563eb}
.sub{font-size:18px;color:#6b7280;line-height:1.7;max-width:520px;margin:0 auto 44px}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{padding:14px 32px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 20px rgba(37,99,235,.3)}
.btn:hover{background:#1d4ed8;transform:translateY(-1px);box-shadow:0 8px 28px rgba(37,99,235,.4)}
.btn2{padding:14px 28px;background:transparent;color:#374151;border:1px solid #d1d5db;border-radius:10px;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#2563eb;color:#2563eb}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin:80px 0;border:1px solid rgba(0,0,0,.07);border-radius:16px;overflow:hidden}
.stat{padding:44px 40px;border-right:1px solid rgba(0,0,0,.07);text-align:center;background:#f9fafb}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:800;color:#2563eb;letter-spacing:-.03em;line-height:1}
.stat-l{font-size:13px;color:#6b7280;font-weight:500;margin-top:8px}
.features{padding:80px 60px;max-width:1200px;margin:0 auto}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-.03em;text-align:center;margin-bottom:16px}
.features h2 span{color:#2563eb}
.features-sub{text-align:center;color:#6b7280;font-size:16px;margin-bottom:56px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:16px;padding:32px;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.card:hover{box-shadow:0 12px 40px rgba(0,0,0,.1);transform:translateY(-4px);border-color:#bfdbfe}
.card-ico{font-size:28px;margin-bottom:16px;display:block}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;letter-spacing:-.01em}
.card p{font-size:14px;color:#6b7280;line-height:1.7}
.quote{padding:80px 60px;background:linear-gradient(135deg,#eff6ff,#f0fdf4);border-radius:20px;margin:0 60px;text-align:center}
.quote q{font-size:clamp(18px,2.5vw,26px);font-weight:600;color:#111827;line-height:1.6;max-width:660px;display:inline-block;letter-spacing:-.01em}
.cta-sec{padding:100px 60px;text-align:center}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:800;letter-spacing:-.03em;margin-bottom:16px}
.cta-sec p{font-size:16px;color:#6b7280;margin-bottom:36px}
footer{padding:32px 60px;border-top:1px solid rgba(0,0,0,.07);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:800;color:#111827}
.f-logo span{color:#2563eb}
.f-copy{font-size:13px;color:#9ca3af}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:100px 24px 60px}.sub{font-size:16px}.stats{grid-template-columns:1fr;margin:50px 0;border-radius:0}.stat{border-right:none;border-bottom:1px solid rgba(0,0,0,.07);padding:28px 24px}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{margin:0 24px;padding:48px 28px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Get started</a></div></nav>
<section class="hero"><div class="hero-badge">New · Just launched</div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">See how it works →</button></div></section>
<div style="padding:0 60px"><div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></div>
<section class="features" id="features"><h2>Everything you need to <span>succeed</span></h2><p class="features-sub">Powerful features built for modern teams</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section style="padding:80px 0"><div class="quote"><q>{{QUOTE}}</q><p style="margin-top:20px;font-size:14px;color:#9ca3af;font-weight:500">— {{BRAND_NAME}} Customer</p></div></section>
<section class="cta-sec" id="cta"><h2>Ready to get started?</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:16px;padding:16px 48px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">© {{BRAND_NAME}} 2025 · {{FOOTER_TAGLINE}}</div></footer>
</body></html>`,
  },

  // ── 13. DARK LUXURY NOIR ───────────────────────
  {
    name: 'Dark Luxury Noir', emoji: '🥃',
    keywords: ['luxury','premium','whiskey','spirits','brand','noir','exclusive'],
    examples: ['Premium whiskey brand','Luxury cigar shop','Exclusive member club'],
    theme: { bg:'#000000', text:'#f5f0e8', sub:'rgba(245,240,232,0.5)', acc:'#D4AF37', border:'1px solid rgba(212,175,55,0.25)', cardBg:'rgba(212,175,55,0.04)', headFont:"'Libre Baskerville',serif", bodyFont:"'Libre Baskerville',serif", headWeight:'700', headCase:'none', radius:'0', btnBg:'transparent', btnText:'#D4AF37' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#f5f0e8;font-family:'Libre Baskerville',serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:24px 80px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to bottom,rgba(0,0,0,.95),transparent)}
.logo{font-size:16px;font-weight:700;color:#D4AF37;letter-spacing:.25em;text-transform:uppercase}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(245,240,232,.45);text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#D4AF37}
.hero{min-height:100vh;padding:160px 80px 80px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 40%,rgba(212,175,55,.06) 0%,transparent 65%)}
.hero-line{width:60px;height:1px;background:#D4AF37;margin-bottom:28px;animation:growLine .8s ease forwards}
h1{font-size:clamp(44px,7vw,100px);font-weight:700;line-height:1;letter-spacing:-.01em;max-width:780px;margin-bottom:8px;animation:fadeUp .9s ease forwards}
h1 em{color:#D4AF37;font-style:italic}
.hero-year{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:rgba(245,240,232,.3);margin-bottom:28px}
.sub{font-size:16px;color:rgba(245,240,232,.5);line-height:1.9;max-width:420px;margin-bottom:48px;font-style:italic}
.btn{display:inline-block;padding:14px 44px;background:transparent;color:#D4AF37;border:1px solid #D4AF37;font-family:'Libre Baskerville',serif;font-size:12px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.btn:hover{background:#D4AF37;color:#000;box-shadow:0 0 30px rgba(212,175,55,.3)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:120px;border-top:1px solid rgba(212,175,55,.2)}
.stat{padding:48px 80px;border-right:1px solid rgba(212,175,55,.15)}
.stat:last-child{border-right:none}
.stat-n{font-size:56px;font-weight:700;color:#D4AF37;line-height:1}
.stat-l{font-size:11px;color:rgba(245,240,232,.35);letter-spacing:.2em;text-transform:uppercase;margin-top:10px;font-style:italic}
.features{padding:120px 80px;border-top:1px solid rgba(212,175,55,.12)}
.features-head{display:flex;align-items:baseline;gap:32px;margin-bottom:72px}
.features h2{font-size:clamp(32px,4vw,54px);font-weight:700;color:#f5f0e8}
.features h2 em{color:#D4AF37;font-style:italic}
.features-rule{flex:1;height:1px;background:rgba(212,175,55,.2)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:48px}
.card{padding:0;border-top:1px solid rgba(212,175,55,.2);padding-top:32px;transition:border-color .2s}
.card:hover{border-top-color:#D4AF37}
.card-ico{font-size:24px;margin-bottom:20px;display:block}
.card h3{font-size:20px;font-weight:700;margin-bottom:14px;color:#f5f0e8}
.card p{font-size:14px;color:rgba(245,240,232,.45);line-height:1.9;font-style:italic}
.quote{padding:100px 80px;border-top:1px solid rgba(212,175,55,.12);border-bottom:1px solid rgba(212,175,55,.12)}
.quote-inner{max-width:680px;margin:0 auto;text-align:center}
.quote-inner::before{content:'❝';font-size:60px;color:rgba(212,175,55,.2);display:block;line-height:1;margin-bottom:20px}
.quote q{font-size:clamp(18px,2.5vw,26px);font-style:italic;color:rgba(245,240,232,.7);line-height:1.7;quotes:none}
.quote-rule{width:40px;height:1px;background:#D4AF37;margin:28px auto 0}
.cta-sec{padding:120px 80px;text-align:center}
.cta-sec h2{font-size:clamp(36px,5vw,68px);font-weight:700;margin-bottom:20px;line-height:1.1}
.cta-sec h2 em{color:#D4AF37;font-style:italic}
.cta-sec p{font-size:16px;color:rgba(245,240,232,.4);font-style:italic;margin-bottom:44px}
footer{padding:36px 80px;border-top:1px solid rgba(212,175,55,.15);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;color:#D4AF37;letter-spacing:.25em;text-transform:uppercase}
.f-copy{font-size:11px;color:rgba(245,240,232,.25);letter-spacing:.1em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes growLine{from{width:0}to{width:60px}}
@media(max-width:768px){nav{padding:20px 28px}.hero{padding:130px 28px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px;border-right:none;border-bottom:1px solid rgba(212,175,55,.12)}.features{padding:80px 28px}.grid{grid-template-columns:1fr;gap:36px}.quote{padding:60px 28px}.cta-sec{padding:80px 28px}footer{flex-direction:column;gap:12px;padding:28px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Heritage</a><a href="#about">Story</a><a href="#cta">Reserve</a></div></nav>
<section class="hero"><div class="hero-line"></div><div class="hero-year">Est. 1921</div><h1>{{HEADLINE_A}} <em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></section>
<section class="features" id="features"><div class="features-head"><h2>The <em>Craft</em></h2><div class="features-rule"></div></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><div class="quote-inner"><q>{{QUOTE}}</q><div class="quote-rule"></div></div></section>
<section class="cta-sec" id="cta"><h2><em>Reserve</em> Your Place</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 14. PASTEL SOFT ────────────────────────────
  {
    name: 'Pastel Soft', emoji: '🌸',
    keywords: ['wellness','beauty','lifestyle','kids','soft','gentle','cute'],
    examples: ['Wellness coaching app','Baby product brand','Self-care subscription box'],
    theme: { bg:'#fef9ff', text:'#3d2952', sub:'rgba(61,41,82,0.5)', acc:'#e879f9', border:'1px solid rgba(232,121,249,0.2)', cardBg:'#fff', headFont:"'Poppins',sans-serif", bodyFont:"'Poppins',sans-serif", headWeight:'700', headCase:'none', radius:'24px', btnBg:'#e879f9', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fef9ff;color:#3d2952;font-family:'Poppins',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 60px;height:68px;background:rgba(254,249,255,.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(232,121,249,.12);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:800;color:#3d2952;letter-spacing:-.02em}
.logo span{color:#e879f9}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(61,41,82,.5);text-decoration:none;font-size:14px;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#e879f9}
.hero{padding:140px 60px 80px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-120px;right:-120px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(232,121,249,.1),transparent 70%)}
.hero::after{content:'';position:absolute;bottom:-80px;left:-80px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(52,211,153,.1),transparent 70%)}
.badge{display:inline-flex;align-items:center;gap:8px;background:#fdf4ff;border:1px solid rgba(232,121,249,.3);border-radius:100px;padding:8px 20px;font-size:13px;font-weight:600;color:#c026d3;margin-bottom:28px}
h1{font-size:clamp(38px,6vw,72px);font-weight:800;line-height:1.15;letter-spacing:-.02em;max-width:700px;margin:0 auto 20px;animation:fadeUp .7s ease forwards}
h1 .acc{color:#e879f9}
h1 .acc2{color:#34d399}
.sub{font-size:17px;color:rgba(61,41,82,.55);line-height:1.75;max-width:480px;margin:0 auto 44px}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{padding:15px 36px;background:#e879f9;color:#fff;border:none;border-radius:100px;font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 8px 24px rgba(232,121,249,.35)}
.btn:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(232,121,249,.5)}
.btn2{padding:15px 28px;background:#fff;color:#3d2952;border:1px solid rgba(61,41,82,.12);border-radius:100px;font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,.05)}
.btn2:hover{border-color:#e879f9;color:#e879f9}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:60px;background:transparent}
.stat{background:#fff;border-radius:24px;padding:36px;text-align:center;box-shadow:0 4px 24px rgba(61,41,82,.06)}
.stat-n{font-size:48px;font-weight:800;color:#e879f9;letter-spacing:-.03em;line-height:1}
.stat-l{font-size:13px;color:rgba(61,41,82,.5);font-weight:500;margin-top:8px}
.features{padding:60px;max-width:1200px;margin:0 auto}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-.02em}
.features-sub{text-align:center;color:rgba(61,41,82,.5);font-size:16px;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border-radius:24px;padding:32px;transition:all .25s;box-shadow:0 4px 20px rgba(61,41,82,.06);border:1px solid rgba(61,41,82,.06)}
.card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(61,41,82,.1)}
.card-ico{font-size:36px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;color:#3d2952}
.card p{font-size:14px;color:rgba(61,41,82,.5);line-height:1.75}
.quote{padding:80px 60px;text-align:center;background:linear-gradient(135deg,#fdf4ff,#f0fdf4);border-radius:28px;margin:0 60px}
.quote q{font-size:clamp(18px,2.5vw,26px);font-weight:600;color:#3d2952;line-height:1.6;max-width:620px;display:inline-block;quotes:none}
.cta-sec{padding:100px 60px;text-align:center}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:800;letter-spacing:-.02em;margin-bottom:16px}
.cta-sec p{font-size:16px;color:rgba(61,41,82,.5);margin-bottom:40px}
footer{padding:32px 60px;border-top:1px solid rgba(61,41,82,.07);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:800;color:#3d2952}
.f-logo span{color:#e879f9}
.f-copy{font-size:13px;color:rgba(61,41,82,.35)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:110px 24px 60px}.stats{grid-template-columns:1fr;padding:24px;gap:16px}.features{padding:40px 24px}.grid{grid-template-columns:1fr}.quote{margin:0 24px;padding:48px 28px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;text-align:center;padding:24px}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span> ✦</span></div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Join</a></div></nav>
<section class="hero"><div class="badge">✨ New · Just for you</div><h1><span class="acc">{{HEADLINE_A}}</span> {{HEADLINE_B}}<br><span class="acc2">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}} ✦</button><button class="btn2">Learn more</button></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2>Why you'll <span style="color:#e879f9">love it</span> 💕</h2><p class="features-sub">Everything crafted just for you</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section style="padding:60px 0"><div class="quote"><q>{{QUOTE}}</q></div></section>
<section class="cta-sec" id="cta"><h2>Ready to <span style="color:#e879f9">start?</span> 🌸</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span> ✦</span></div><div class="f-copy">© {{BRAND_NAME}} 2025 · {{FOOTER_TAGLINE}}</div></footer>
</body></html>`,
  },

  // ── 15. SWISS INTERNATIONAL ────────────────────
  {
    name: 'Swiss International', emoji: '🇨🇭',
    keywords: ['design','agency','typography','branding','studio','international','grid'],
    examples: ['Design agency portfolio','Branding studio','Typography-focused brand'],
    theme: { bg:'#ffffff', text:'#000000', sub:'rgba(0,0,0,0.5)', acc:'#E63946', border:'1px solid #000', cardBg:'#f5f5f5', headFont:"'Barlow',sans-serif", bodyFont:"'Barlow',sans-serif", headWeight:'900', headCase:'uppercase', radius:'0', btnBg:'#E63946', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#000;font-family:'Barlow',sans-serif;overflow-x:hidden}
.grid-overlay{position:fixed;inset:0;background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;height:56px;background:#fff;border-bottom:2px solid #000;display:flex;align-items:stretch}
.logo{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.15em;color:#000;padding:0 32px;border-right:2px solid #000;display:flex;align-items:center;background:#E63946;color:#fff}
.nav-links{display:flex;align-items:stretch;margin-left:auto}
.nav-links a{color:#000;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;padding:0 28px;border-left:1px solid #000;display:flex;align-items:center;transition:background .15s,color .15s}
.nav-links a:hover{background:#000;color:#fff}
.hero{padding:130px 80px 0;display:grid;grid-template-columns:1fr 1fr;gap:0;border-bottom:2px solid #000;position:relative;z-index:1;min-height:90vh;align-items:center}
.hero-left{padding-right:80px;border-right:2px solid #000;padding-bottom:80px}
.hero-tag{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#E63946;margin-bottom:24px;display:flex;align-items:center;gap:12px}
.hero-tag::before{content:'';width:32px;height:2px;background:#E63946}
h1{font-size:clamp(52px,7vw,96px);font-weight:900;line-height:.95;text-transform:uppercase;letter-spacing:-.02em;margin-bottom:32px;animation:fadeUp .7s ease forwards}
h1 span{color:#E63946;display:block}
.sub{font-size:16px;color:rgba(0,0,0,.55);line-height:1.7;max-width:400px;margin-bottom:48px;font-weight:300}
.btn{padding:15px 44px;background:#E63946;color:#fff;border:2px solid #E63946;font-family:'Barlow',sans-serif;font-size:12px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .15s}
.btn:hover{background:#000;border-color:#000}
.hero-right{padding-left:80px;display:flex;flex-direction:column;justify-content:center;padding-bottom:80px}
.hero-num{font-size:120px;font-weight:900;line-height:1;color:rgba(0,0,0,.06);margin-bottom:16px}
.hero-desc{font-size:14px;color:rgba(0,0,0,.5);line-height:1.8;font-weight:300}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:2px solid #000;position:relative;z-index:1}
.stat{padding:48px 80px;border-right:2px solid #000;position:relative}
.stat:last-child{border-right:none}
.stat::before{content:attr(data-n);position:absolute;top:20px;right:20px;font-size:10px;font-weight:700;color:rgba(0,0,0,.2);letter-spacing:.1em}
.stat-n{font-size:56px;font-weight:900;color:#E63946;line-height:1;text-transform:uppercase}
.stat-l{font-size:11px;font-weight:700;color:rgba(0,0,0,.45);letter-spacing:.15em;text-transform:uppercase;margin-top:8px}
.features{padding:80px;position:relative;z-index:1;border-bottom:2px solid #000}
.features-top{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,.12);padding-bottom:32px;margin-bottom:48px}
.features h2{font-size:clamp(28px,3.5vw,44px);font-weight:900;text-transform:uppercase;letter-spacing:-.01em}
.feat-num{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.3)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:32px;border-right:1px solid rgba(0,0,0,.12);transition:background .15s}
.card:last-child{border-right:none}
.card:hover{background:#f5f5f5}
.card-ico{font-size:24px;display:block;margin-bottom:20px}
.card-num{font-size:11px;font-weight:700;color:#E63946;letter-spacing:.15em;margin-bottom:12px;text-transform:uppercase}
.card h3{font-size:18px;font-weight:900;text-transform:uppercase;margin-bottom:12px;letter-spacing:-.01em}
.card p{font-size:13px;color:rgba(0,0,0,.5);line-height:1.8;font-weight:300}
.quote{padding:80px;background:#000;color:#fff;border-bottom:2px solid #000;position:relative;z-index:1}
.quote q{font-size:clamp(20px,3vw,36px);font-weight:300;line-height:1.5;max-width:800px;display:block;quotes:none}
.quote q strong{font-weight:900;color:#E63946}
.cta-sec{padding:80px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(36px,5vw,72px);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.95}
.cta-sec h2 span{color:#E63946;display:block}
footer{padding:28px 80px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.2em}
.f-copy{font-size:11px;color:rgba(0,0,0,.4);font-weight:600;letter-spacing:.1em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{height:auto;flex-wrap:wrap}.logo{width:100%;border-right:none;border-bottom:2px solid #000;padding:14px 24px;justify-content:flex-start}.nav-links{width:100%}.nav-links a{flex:1;justify-content:center;padding:12px 8px;border-left:none;border-top:1px solid #000}.hero{grid-template-columns:1fr;padding:100px 24px 0}.hero-left{padding-right:0;border-right:none;padding-bottom:40px}.hero-right{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:2px solid #000}.features{padding:40px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(0,0,0,.12)}.quote{padding:48px 24px}.cta-sec{flex-direction:column;gap:32px;align-items:flex-start;padding:48px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<div class="grid-overlay"></div>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-left"><div class="hero-tag">International Style</div><h1>{{HEADLINE_A}}<span>{{HEADLINE_B}}</span>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-right"><div class="hero-num">01</div><p class="hero-desc">{{SUBHEADLINE}}</p></div></section>
<section class="stats"><div class="stat" data-n="01"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat" data-n="02"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat" data-n="03"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="features-top"><h2>Core Services</h2><span class="feat-num">— 03 Disciplines</span></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><div class="card-num">01</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><div class="card-num">02</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><div class="card-num">03</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q><strong>{{BRAND_NAME}}:</strong> {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Start a<span>Project.</span></h2><button class="btn" style="font-size:14px;padding:18px 60px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 16. FINTECH PRO ────────────────────────────
  {
    name: 'Fintech Pro', emoji: '💹',
    keywords: ['finance','fintech','banking','investment','trading','money','crypto'],
    examples: ['Investment platform','Trading analytics tool','Digital banking app'],
    theme: { bg:'#0f172a', text:'#f8fafc', sub:'rgba(248,250,252,0.55)', acc:'#3b82f6', border:'1px solid rgba(59,130,246,0.18)', cardBg:'rgba(30,41,59,0.8)', headFont:"'Inter',sans-serif", bodyFont:"'Inter',sans-serif", headWeight:'700', headCase:'none', radius:'8px', btnBg:'#3b82f6', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f172a;color:#f8fafc;font-family:'Inter',sans-serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 20% 20%,rgba(59,130,246,.08) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(99,102,241,.06) 0%,transparent 50%);pointer-events:none}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:64px;background:rgba(15,23,42,.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(59,130,246,.12);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:18px;font-weight:800;color:#f8fafc;letter-spacing:-.03em}
.logo span{color:#3b82f6}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(248,250,252,.5);text-decoration:none;font-size:13px;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#3b82f6}
.hero{padding:140px 64px 80px;position:relative;z-index:1}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.25);border-radius:6px;padding:6px 14px;font-size:11px;font-weight:600;color:#93c5fd;letter-spacing:.08em;text-transform:uppercase;margin-bottom:32px}
.ticker{display:flex;gap:24px;margin-bottom:36px;flex-wrap:wrap}
.tick-item{font-size:12px;font-weight:600;letter-spacing:.04em}
.tick-up{color:#22c55e}
.tick-down{color:#ef4444}
.tick-name{color:rgba(248,250,252,.4);margin-right:6px}
h1{font-size:clamp(40px,5.5vw,80px);font-weight:800;line-height:1.05;letter-spacing:-.04em;max-width:740px;margin-bottom:24px;animation:fadeUp .7s ease forwards}
h1 span{background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{font-size:17px;color:rgba(248,250,252,.5);line-height:1.75;max-width:500px;margin-bottom:48px;font-weight:400}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:13px 32px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 20px rgba(59,130,246,.35)}
.btn:hover{background:#2563eb;transform:translateY(-1px);box-shadow:0 8px 28px rgba(59,130,246,.45)}
.btn2{padding:13px 28px;background:rgba(248,250,252,.06);color:#f8fafc;border:1px solid rgba(248,250,252,.12);border-radius:8px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.btn2:hover{background:rgba(248,250,252,.1)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(59,130,246,.12);border-bottom:1px solid rgba(59,130,246,.12);margin-top:80px}
.stat{padding:44px 64px;border-right:1px solid rgba(59,130,246,.08)}
.stat:last-child{border-right:none}
.stat-n{font-size:48px;font-weight:800;letter-spacing:-.04em;line-height:1;background:linear-gradient(135deg,#3b82f6,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-l{font-size:12px;color:rgba(248,250,252,.4);font-weight:500;margin-top:8px}
.features{padding:100px 64px;position:relative;z-index:1}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-.03em;margin-bottom:12px}
.features-sub{font-size:15px;color:rgba(248,250,252,.45);margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(59,130,246,.1)}
.card{background:#0f172a;padding:36px;transition:background .2s}
.card:hover{background:rgba(30,41,59,.8)}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:17px;font-weight:700;margin-bottom:10px;letter-spacing:-.02em}
.card p{font-size:13px;color:rgba(248,250,252,.45);line-height:1.75}
.quote{padding:80px 64px;background:rgba(30,41,59,.5);border-top:1px solid rgba(59,130,246,.12);border-bottom:1px solid rgba(59,130,246,.12);position:relative;z-index:1}
.quote q{font-size:clamp(17px,2.5vw,26px);font-weight:600;color:#f8fafc;line-height:1.6;max-width:700px;display:block;quotes:none;letter-spacing:-.01em}
.quote q span{color:#3b82f6}
.cta-sec{padding:100px 64px;text-align:center;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(32px,5vw,64px);font-weight:800;letter-spacing:-.04em;margin-bottom:16px}
.cta-sec p{font-size:16px;color:rgba(248,250,252,.45);margin-bottom:40px}
footer{padding:32px 64px;border-top:1px solid rgba(59,130,246,.1);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:16px;font-weight:800;color:#f8fafc}
.f-logo span{color:#3b82f6}
.f-copy{font-size:12px;color:rgba(248,250,252,.3)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:110px 24px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(59,130,246,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr;gap:1px}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Platform</a><a href="#about">Security</a><a href="#cta">Start</a></div></nav>
<section class="hero">
<div class="hero-eyebrow">⚡ Live Platform</div>
<div class="ticker"><span class="tick-item"><span class="tick-name">BTC</span><span class="tick-up">+3.4%</span></span><span class="tick-item"><span class="tick-name">ETH</span><span class="tick-up">+1.8%</span></span><span class="tick-item"><span class="tick-name">SPX</span><span class="tick-up">+0.6%</span></span><span class="tick-item"><span class="tick-name">GOLD</span><span class="tick-down">-0.2%</span></span></div>
<h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">View demo →</button></div>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></section>
<section class="features" id="features"><h2>{{HEADLINE_A}} Platform</h2><p class="features-sub">Professional-grade tools for serious investors</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q><span>{{BRAND_NAME}}:</span> {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Start <span style="color:#3b82f6">trading</span> today</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:15px;padding:15px 48px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 17. HEALTHCARE CLEAN ───────────────────────
  {
    name: 'Healthcare Clean', emoji: '🏥',
    keywords: ['healthcare','medical','wellness','clinic','health','doctor','therapy'],
    examples: ['Telehealth platform','Medical clinic website','Mental wellness app'],
    theme: { bg:'#ffffff', text:'#134e4a', sub:'rgba(19,78,74,0.55)', acc:'#0d9488', border:'1px solid rgba(13,148,136,0.15)', cardBg:'#f0fdfa', headFont:"'Nunito',sans-serif", bodyFont:"'Nunito',sans-serif", headWeight:'800', headCase:'none', radius:'16px', btnBg:'#0d9488', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#134e4a;font-family:'Nunito',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:68px;background:rgba(255,255,255,.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(13,148,136,.1);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:900;color:#134e4a;letter-spacing:-.02em}
.logo span{color:#0d9488}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(19,78,74,.5);text-decoration:none;font-size:14px;font-weight:600;transition:color .15s}
.nav-links a:hover{color:#0d9488}
.hero{padding:140px 64px 60px;display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:center}
h1{font-size:clamp(36px,5vw,68px);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 span{color:#0d9488}
.sub{font-size:17px;color:rgba(19,78,74,.55);line-height:1.75;margin-bottom:40px}
.trust-row{display:flex;gap:24px;flex-wrap:wrap;margin-top:40px}
.trust-badge{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:rgba(19,78,74,.6)}
.trust-badge span{font-size:18px}
.btn{padding:14px 36px;background:#0d9488;color:#fff;border:none;border-radius:100px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 6px 20px rgba(13,148,136,.3)}
.btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(13,148,136,.45);background:#0f766e}
.hero-visual{background:linear-gradient(135deg,#f0fdfa,#ccfbf1);border-radius:28px;padding:48px;display:flex;flex-direction:column;gap:20px}
.dash-card{background:#fff;border-radius:16px;padding:20px 24px;box-shadow:0 4px 16px rgba(13,148,136,.08)}
.dash-label{font-size:11px;font-weight:700;color:rgba(19,78,74,.45);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
.dash-val{font-size:28px;font-weight:900;color:#0d9488}
.dash-sub{font-size:12px;color:rgba(19,78,74,.45);font-weight:600;margin-top:4px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;background:#f0fdfa;border-top:1px solid rgba(13,148,136,.12);border-bottom:1px solid rgba(13,148,136,.12)}
.stat{padding:44px 64px;border-right:1px solid rgba(13,148,136,.1)}
.stat:last-child{border-right:none}
.stat-n{font-size:48px;font-weight:900;color:#0d9488;letter-spacing:-.03em;line-height:1}
.stat-l{font-size:13px;color:rgba(19,78,74,.5);font-weight:600;margin-top:8px}
.features{padding:100px 64px}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:900;text-align:center;margin-bottom:12px;letter-spacing:-.02em}
.features h2 span{color:#0d9488}
.features-sub{text-align:center;color:rgba(19,78,74,.5);font-size:16px;font-weight:500;margin-bottom:56px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:#f0fdfa;border-radius:20px;padding:32px;transition:all .25s;border:1px solid rgba(13,148,136,.08)}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(13,148,136,.12);border-color:rgba(13,148,136,.2)}
.card-ico{font-size:32px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:800;margin-bottom:10px;color:#134e4a}
.card p{font-size:14px;color:rgba(19,78,74,.5);line-height:1.75;font-weight:500}
.quote{padding:80px 64px;text-align:center;background:linear-gradient(135deg,#f0fdfa,#fff)}
.quote q{font-size:clamp(18px,2.5vw,26px);font-weight:700;color:#134e4a;line-height:1.65;max-width:660px;display:inline-block;quotes:none}
.cta-sec{padding:100px 64px;text-align:center}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:900;letter-spacing:-.03em;margin-bottom:16px}
.cta-sec h2 span{color:#0d9488}
.cta-sec p{font-size:16px;color:rgba(19,78,74,.5);margin-bottom:40px;font-weight:500}
footer{padding:32px 64px;border-top:1px solid rgba(13,148,136,.1);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:900;color:#134e4a}
.f-logo span{color:#0d9488}
.f-copy{font-size:13px;color:rgba(19,78,74,.35);font-weight:500}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{grid-template-columns:1fr;padding:110px 24px 60px;gap:40px}.hero-visual{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(13,148,136,.1)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>+</span></div><div class="nav-links"><a href="#features">Services</a><a href="#about">About</a><a href="#cta">Book</a></div></nav>
<section class="hero"><div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button><div class="trust-row"><div class="trust-badge"><span>✓</span> HIPAA Compliant</div><div class="trust-badge"><span>🔒</span> Secure &amp; Private</div><div class="trust-badge"><span>⭐</span> 5-Star Rated</div></div></div><div class="hero-visual"><div class="dash-card"><div class="dash-label">Today's Appointments</div><div class="dash-val">12</div><div class="dash-sub">3 remaining · All confirmed</div></div><div class="dash-card"><div class="dash-label">Patient Satisfaction</div><div class="dash-val">98.4%</div><div class="dash-sub">Based on 2,400 reviews</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Why patients choose <span>{{BRAND_NAME}}</span></h2><p class="features-sub">Compassionate care backed by technology</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Your health,<br><span>our priority</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:16px;padding:16px 48px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>+</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 18. RESTAURANT NOIR ────────────────────────
  {
    name: 'Restaurant Noir', emoji: '🍽️',
    keywords: ['restaurant','dining','food','chef','menu','culinary','premium'],
    examples: ['Fine dining restaurant','Premium chef experience','Gourmet food brand'],
    theme: { bg:'#0d0d0d', text:'#f5efe6', sub:'rgba(245,239,230,0.5)', acc:'#f59e0b', border:'1px solid rgba(245,158,11,0.2)', cardBg:'rgba(255,255,255,0.03)', headFont:"'Playfair Display',serif", bodyFont:"'Playfair Display',serif", headWeight:'700', headCase:'none', radius:'0', btnBg:'#f59e0b', btnText:'#0d0d0d' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d0d0d;color:#f5efe6;font-family:'Playfair Display',serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:24px 80px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to bottom,rgba(13,13,13,.98),transparent)}
.logo{font-size:22px;font-weight:700;color:#f59e0b;letter-spacing:.12em;text-transform:uppercase}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(245,239,230,.45);text-decoration:none;font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:400;transition:color .2s}
.nav-links a:hover{color:#f59e0b}
.hero{min-height:100vh;padding:0;position:relative;display:flex;align-items:flex-end;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(245,158,11,.08),transparent 60%)}
.hero-content{padding:80px;position:relative;z-index:1;width:100%}
.hero-ornament{color:rgba(245,158,11,.3);font-size:14px;letter-spacing:.3em;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:16px}
.hero-ornament::before,.hero-ornament::after{content:'';flex:0 0 40px;height:1px;background:rgba(245,158,11,.3)}
h1{font-size:clamp(52px,8vw,120px);font-weight:700;line-height:.95;max-width:800px;margin-bottom:24px;animation:fadeUp .8s ease forwards}
h1 em{color:#f59e0b;font-style:italic}
.sub{font-size:17px;color:rgba(245,239,230,.5);line-height:1.8;max-width:440px;margin-bottom:48px;font-style:italic}
.btn{display:inline-block;padding:15px 52px;background:#f59e0b;color:#0d0d0d;border:none;font-family:'Playfair Display',serif;font-size:13px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.btn:hover{background:#d97706;box-shadow:0 0 40px rgba(245,158,11,.3)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(245,158,11,.15);border-bottom:1px solid rgba(245,158,11,.15)}
.stat{padding:48px 80px;border-right:1px solid rgba(245,158,11,.1);text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:56px;font-weight:700;color:#f59e0b;font-style:italic;line-height:1}
.stat-l{font-size:11px;color:rgba(245,239,230,.35);letter-spacing:.2em;text-transform:uppercase;margin-top:10px}
.features{padding:120px 80px}
.features-header{text-align:center;margin-bottom:72px}
.features h2{font-size:clamp(32px,4vw,56px);font-weight:700;color:#f5efe6}
.features h2 em{color:#f59e0b}
.features-rule{width:60px;height:1px;background:#f59e0b;margin:24px auto 0}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:48px 40px;border-right:1px solid rgba(245,158,11,.1);text-align:center;transition:background .2s}
.card:last-child{border-right:none}
.card:hover{background:rgba(245,158,11,.04)}
.card-ico{font-size:36px;display:block;margin-bottom:20px}
.card h3{font-size:22px;font-weight:700;margin-bottom:14px;font-style:italic;color:#f59e0b}
.card p{font-size:14px;color:rgba(245,239,230,.45);line-height:1.9;font-style:italic}
.quote{padding:100px 80px;text-align:center;border-top:1px solid rgba(245,158,11,.12);border-bottom:1px solid rgba(245,158,11,.12)}
.quote-mark{font-size:80px;color:rgba(245,158,11,.15);line-height:1;margin-bottom:16px}
.quote q{font-size:clamp(20px,3vw,32px);font-style:italic;color:rgba(245,239,230,.7);line-height:1.6;max-width:720px;display:inline-block;quotes:none}
.cta-sec{padding:120px 80px;text-align:center}
.cta-sec h2{font-size:clamp(36px,5vw,72px);font-weight:700;margin-bottom:24px;line-height:1.1}
.cta-sec h2 em{color:#f59e0b;font-style:italic}
.cta-sec p{font-size:16px;color:rgba(245,239,230,.4);font-style:italic;margin-bottom:44px}
footer{padding:36px 80px;border-top:1px solid rgba(245,158,11,.12);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:700;color:#f59e0b;letter-spacing:.15em;text-transform:uppercase}
.f-copy{font-size:11px;color:rgba(245,239,230,.25);letter-spacing:.1em;text-transform:uppercase;font-style:italic}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:20px 28px}.hero-content{padding:80px 28px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px;border-right:none;border-bottom:1px solid rgba(245,158,11,.1)}.features{padding:80px 28px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(245,158,11,.1)}.quote{padding:60px 28px}.cta-sec{padding:80px 28px}footer{flex-direction:column;gap:12px;padding:28px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Menu</a><a href="#about">Story</a><a href="#cta">Reserve</a></div></nav>
<section class="hero"><div class="hero-bg"></div><div class="hero-content"><div class="hero-ornament">Fine Dining</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="features-header"><h2>The <em>Experience</em></h2><div class="features-rule"></div></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><div class="quote-mark">❝</div><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Make a <em>Reservation</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 19. BOTANICAL GREEN ────────────────────────
  {
    name: 'Botanical Green', emoji: '🌿',
    keywords: ['nature','eco','organic','plant','garden','green','sustainable'],
    examples: ['Organic skincare brand','Eco-friendly products','Botanical garden tour'],
    theme: { bg:'#f8f5f0', text:'#1a3a2a', sub:'rgba(26,58,42,0.55)', acc:'#2d6a4f', border:'1px solid rgba(45,106,79,0.2)', cardBg:'#fff', headFont:"'Lora',serif", bodyFont:"'Lora',serif", headWeight:'700', headCase:'none', radius:'20px', btnBg:'#2d6a4f', btnText:'#f8f5f0' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f8f5f0;color:#1a3a2a;font-family:'Lora',serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:64px;background:rgba(248,245,240,.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(45,106,79,.1);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:700;color:#1a3a2a;letter-spacing:.02em}
.logo em{color:#2d6a4f;font-style:italic}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(26,58,42,.5);text-decoration:none;font-size:14px;font-style:italic;transition:color .15s}
.nav-links a:hover{color:#2d6a4f}
.hero{padding:140px 64px 80px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;min-height:90vh;clip-path:polygon(0 0,100% 0,100% 92%,0 100%);background:#f8f5f0}
.hero-eyebrow{font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:rgba(26,58,42,.4);margin-bottom:20px;display:flex;align-items:center;gap:10px}
.hero-eyebrow::before{content:'🌿';font-size:14px}
h1{font-size:clamp(38px,5vw,72px);font-weight:700;line-height:1.15;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 em{color:#2d6a4f;font-style:italic}
.sub{font-size:17px;color:rgba(26,58,42,.55);line-height:1.8;margin-bottom:40px;font-style:italic}
.btn{display:inline-block;padding:14px 40px;background:#2d6a4f;color:#f8f5f0;border:none;border-radius:100px;font-family:'Lora',serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .25s}
.btn:hover{background:#1b4332;transform:translateY(-2px);box-shadow:0 10px 30px rgba(45,106,79,.25)}
.hero-visual{background:linear-gradient(135deg,#d8f3dc,#b7e4c7);border-radius:32px;padding:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;position:relative;overflow:hidden}
.leaf-bg{position:absolute;inset:0;background-image:radial-gradient(circle at 20% 80%,rgba(45,106,79,.15) 0%,transparent 40%),radial-gradient(circle at 80% 20%,rgba(116,198,157,.2) 0%,transparent 40%)}
.leaf-icon{font-size:120px;position:relative;z-index:1;animation:sway 4s ease-in-out infinite}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;background:#fff;border-top:1px solid rgba(45,106,79,.12);border-bottom:1px solid rgba(45,106,79,.12)}
.stat{padding:44px 64px;border-right:1px solid rgba(45,106,79,.08);text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:48px;font-weight:700;color:#2d6a4f;font-style:italic;line-height:1}
.stat-l{font-size:13px;color:rgba(26,58,42,.45);font-style:italic;margin-top:8px}
.features{padding:100px 64px}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:700;text-align:center;margin-bottom:12px}
.features h2 em{color:#2d6a4f;font-style:italic}
.features-sub{text-align:center;color:rgba(26,58,42,.5);font-size:16px;font-style:italic;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:#fff;border-radius:20px;padding:32px;transition:all .25s;border:1px solid rgba(45,106,79,.08);clip-path:polygon(0 0,100% 0,100% 88%,96% 100%,0 100%)}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(45,106,79,.1)}
.card-ico{font-size:32px;display:block;margin-bottom:18px}
.card h3{font-size:19px;font-weight:700;margin-bottom:10px;color:#1a3a2a}
.card p{font-size:14px;color:rgba(26,58,42,.5);line-height:1.8;font-style:italic}
.quote{padding:80px 64px;text-align:center;background:linear-gradient(135deg,#d8f3dc,#b7e4c7);clip-path:polygon(0 6%,100% 0,100% 94%,0 100%);margin:60px 0}
.quote q{font-size:clamp(18px,2.5vw,28px);font-style:italic;font-weight:600;color:#1b4332;line-height:1.65;max-width:680px;display:inline-block;quotes:none}
.cta-sec{padding:100px 64px;text-align:center}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:700;margin-bottom:16px;line-height:1.1}
.cta-sec h2 em{color:#2d6a4f;font-style:italic}
.cta-sec p{font-size:16px;color:rgba(26,58,42,.5);margin-bottom:40px;font-style:italic}
footer{padding:32px 64px;border-top:1px solid rgba(45,106,79,.12);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:700;color:#1a3a2a}
.f-logo em{color:#2d6a4f;font-style:italic}
.f-copy{font-size:13px;color:rgba(26,58,42,.35);font-style:italic}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@media(max-width:768px){nav{padding:0 24px}.hero{grid-template-columns:1fr;padding:110px 24px 60px;clip-path:none}.hero-visual{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(45,106,79,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px;clip-path:none}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}} <em>🌿</em></div><div class="nav-links"><a href="#features">About</a><a href="#about">Story</a><a href="#cta">Shop</a></div></nav>
<section class="hero"><div><div class="hero-eyebrow">100% Organic</div><h1>{{HEADLINE_A}} <em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-visual"><div class="leaf-bg"></div><div class="leaf-icon">🌿</div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Rooted in <em>Nature</em></h2><p class="features-sub">Crafted with care, grown with love</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Grow with <em>{{BRAND_NAME}}</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}} <em>🌿</em></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 20. SPORTS ATHLETIC ────────────────────────
  {
    name: 'Sports Athletic', emoji: '⚡',
    keywords: ['sports','fitness','athletic','gym','performance','training','energy'],
    examples: ['Athletic apparel brand','Fitness coaching platform','Sports performance app'],
    theme: { bg:'#0a0a0a', text:'#ffffff', sub:'rgba(255,255,255,0.55)', acc:'#ef4444', border:'1px solid rgba(239,68,68,0.25)', cardBg:'rgba(255,255,255,0.04)', headFont:"'Oswald',sans-serif", bodyFont:"'Oswald',sans-serif", headWeight:'700', headCase:'uppercase', radius:'0', btnBg:'#ef4444', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#fff;font-family:'Oswald',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:60px;background:rgba(10,10,10,.95);border-bottom:2px solid #ef4444;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#fff}
.logo span{color:#ef4444}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(255,255,255,.5);text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;transition:color .15s}
.nav-links a:hover{color:#ef4444}
.hero{min-height:100vh;padding:100px 64px 0;position:relative;overflow:hidden;display:flex;align-items:center}
.hero-slash{position:absolute;top:0;right:0;width:55%;height:100%;background:#ef4444;clip-path:polygon(20% 0,100% 0,100% 100%,0% 100%);z-index:0;opacity:.08}
.hero-content{position:relative;z-index:1;max-width:700px}
.hero-tag{font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#ef4444;margin-bottom:20px}
h1{font-size:clamp(60px,9vw,130px);font-weight:700;line-height:.9;text-transform:uppercase;letter-spacing:-.02em;margin-bottom:24px;animation:fadeUp .6s ease forwards}
h1 span{color:#ef4444;display:block;font-style:italic}
.sub{font-size:16px;color:rgba(255,255,255,.5);line-height:1.7;max-width:420px;margin-bottom:44px;font-weight:300;letter-spacing:.02em}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:14px 44px;background:#ef4444;color:#fff;border:none;font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .2s;clip-path:polygon(0 0,100% 0,96% 100%,0 100%)}
.btn:hover{background:#dc2626;transform:translateX(4px)}
.btn2{padding:14px 36px;background:transparent;color:#fff;border:2px solid rgba(255,255,255,.2);font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#ef4444;color:#ef4444}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:80px;border-top:2px solid rgba(239,68,68,.2)}
.stat{padding:44px 64px;border-right:1px solid rgba(239,68,68,.12);position:relative}
.stat:last-child{border-right:none}
.stat::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:#ef4444}
.stat-n{font-size:56px;font-weight:700;color:#ef4444;line-height:1;text-transform:uppercase}
.stat-l{font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.2em;text-transform:uppercase;margin-top:8px;font-weight:400}
.features{padding:100px 64px;clip-path:polygon(0 4%,100% 0,100% 96%,0 100%);background:rgba(255,255,255,.02);margin:60px 0}
.features h2{font-size:clamp(32px,4.5vw,60px);font-weight:700;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:52px}
.features h2 span{color:#ef4444}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(239,68,68,.1)}
.card{background:#0a0a0a;padding:40px 32px;transition:background .2s;clip-path:polygon(0 0,100% 0,100% 92%,96% 100%,0 100%)}
.card:hover{background:rgba(239,68,68,.07)}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}
.card p{font-size:13px;color:rgba(255,255,255,.45);line-height:1.7;font-weight:300}
.quote{padding:80px 64px;background:#ef4444;clip-path:polygon(0 0,100% 6%,100% 100%,0 94%)}
.quote q{font-size:clamp(20px,3vw,36px);font-weight:700;text-transform:uppercase;color:#fff;line-height:1.3;max-width:800px;display:block;quotes:none;letter-spacing:-.01em}
.cta-sec{padding:100px 64px;text-align:center}
.cta-sec h2{font-size:clamp(44px,7vw,100px);font-weight:700;text-transform:uppercase;letter-spacing:-.02em;margin-bottom:36px;line-height:.95}
.cta-sec h2 span{color:#ef4444}
footer{padding:28px 64px;border-top:2px solid rgba(239,68,68,.2);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.1em}
.f-logo span{color:#ef4444}
.f-copy{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:.15em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:90px 24px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(239,68,68,.1)}.features{padding:60px 24px;clip-path:none;margin:0}.grid{grid-template-columns:1fr;gap:2px}.quote{padding:60px 24px;clip-path:none}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Training</a><a href="#about">Team</a><a href="#cta">Join</a></div></nav>
<section class="hero"><div class="hero-slash"></div><div class="hero-content"><div class="hero-tag">⚡ Elite Performance</div><h1>{{HEADLINE_A}}<span>{{HEADLINE_B}}</span>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Our Story</button></div><div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></div></section>
<section class="features" id="features"><h2>Train <span>Harder.</span> Win More.</h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Are You <span>Ready?</span></h2><button class="btn" style="font-size:14px;padding:16px 60px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 21. ART DECO GOLD ─────────────────────────
  {
    name: 'Art Deco Gold', emoji: '🏛️',
    keywords: ['luxury','art deco','gold','fashion','event','gala','vintage'],
    examples: ['Luxury event company','Art deco hotel brand','High-end jewelry brand'],
    theme: { bg:'#f5f0e8', text:'#1a1208', sub:'rgba(26,18,8,0.5)', acc:'#b8860b', border:'1px solid rgba(184,134,11,0.3)', cardBg:'rgba(184,134,11,0.04)', headFont:"'Cormorant Garamond',serif", bodyFont:"'Cormorant Garamond',serif", headWeight:'700', headCase:'uppercase', radius:'0', btnBg:'transparent', btnText:'#b8860b' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;0,700;1,300;1,500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f5f0e8;color:#1a1208;font-family:'Cormorant Garamond',serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 80px;height:64px;background:rgba(245,240,232,.96);backdrop-filter:blur(8px);border-bottom:1px solid rgba(184,134,11,.25);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:18px;font-weight:700;color:#1a1208;letter-spacing:.3em;text-transform:uppercase}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(26,18,8,.45);text-decoration:none;font-size:12px;letter-spacing:.25em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#b8860b}
.hero{padding:130px 80px 80px;text-align:center;position:relative}
.deco-top{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:24px}
.deco-line{width:80px;height:1px;background:linear-gradient(90deg,transparent,#b8860b)}
.deco-line.right{background:linear-gradient(90deg,#b8860b,transparent)}
.deco-diamond{width:8px;height:8px;background:#b8860b;transform:rotate(45deg)}
.hero-eyebrow{font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:rgba(26,18,8,.45)}
h1{font-size:clamp(44px,6.5vw,96px);font-weight:700;line-height:1;letter-spacing:.04em;text-transform:uppercase;max-width:820px;margin:24px auto;animation:fadeUp .8s ease forwards}
h1 em{color:#b8860b;font-style:italic;display:block}
.deco-border{width:200px;height:1px;background:linear-gradient(90deg,transparent,#b8860b,transparent);margin:24px auto}
.sub{font-size:18px;color:rgba(26,18,8,.5);line-height:1.8;max-width:480px;margin:0 auto 44px;font-style:italic;font-weight:300}
.btn{display:inline-block;padding:14px 52px;background:transparent;color:#b8860b;border:1px solid #b8860b;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;cursor:pointer;transition:all .25s;position:relative}
.btn::before,.btn::after{content:'';position:absolute;width:8px;height:8px;border:1px solid #b8860b;transition:all .25s}
.btn::before{top:-4px;left:-4px;border-right:none;border-bottom:none}
.btn::after{bottom:-4px;right:-4px;border-left:none;border-top:none}
.btn:hover{background:#b8860b;color:#f5f0e8}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin:80px 0;border:1px solid rgba(184,134,11,.2);position:relative}
.stats::before{content:'◆';position:absolute;top:-12px;left:50%;transform:translateX(-50%);color:#b8860b;background:#f5f0e8;padding:0 8px;font-size:16px}
.stat{padding:48px 80px;border-right:1px solid rgba(184,134,11,.15);text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:700;color:#b8860b;font-style:italic;line-height:1}
.stat-l{font-size:11px;color:rgba(26,18,8,.35);letter-spacing:.25em;text-transform:uppercase;margin-top:8px;font-weight:300}
.features{padding:80px;border-top:1px solid rgba(184,134,11,.15)}
.features-head{text-align:center;margin-bottom:64px}
.features h2{font-size:clamp(28px,3.5vw,48px);font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.features h2 em{color:#b8860b;font-style:italic}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.card{padding:40px;border:1px solid rgba(184,134,11,.15);text-align:center;transition:border-color .2s,box-shadow .2s;position:relative}
.card::before,.card::after{content:'';position:absolute;width:12px;height:12px;border:1px solid rgba(184,134,11,.4)}
.card::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
.card::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
.card:hover{border-color:rgba(184,134,11,.4);box-shadow:0 8px 32px rgba(184,134,11,.1)}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;color:#1a1208}
.card p{font-size:15px;color:rgba(26,18,8,.45);line-height:1.8;font-style:italic;font-weight:300}
.quote{padding:80px;background:linear-gradient(135deg,rgba(184,134,11,.06),rgba(184,134,11,.02));border-top:1px solid rgba(184,134,11,.12);border-bottom:1px solid rgba(184,134,11,.12);text-align:center}
.quote q{font-size:clamp(18px,2.5vw,30px);font-style:italic;font-weight:300;color:rgba(26,18,8,.65);line-height:1.7;max-width:700px;display:inline-block;quotes:none}
.cta-sec{padding:100px 80px;text-align:center}
.cta-sec h2{font-size:clamp(32px,4.5vw,64px);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:20px;line-height:1}
.cta-sec h2 em{color:#b8860b;font-style:italic;display:block}
.cta-sec p{font-size:16px;color:rgba(26,18,8,.4);font-style:italic;margin-bottom:44px;font-weight:300}
footer{padding:36px 80px;border-top:1px solid rgba(184,134,11,.15);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#1a1208}
.f-copy{font-size:11px;color:rgba(26,18,8,.3);letter-spacing:.15em;text-transform:uppercase;font-style:italic}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:100px 24px 60px}.stats{grid-template-columns:1fr;margin:40px 0}.stat{padding:28px;border-right:none;border-bottom:1px solid rgba(184,134,11,.12)}.features{padding:60px 24px}.grid{grid-template-columns:1fr;gap:24px}.quote{padding:48px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:12px;padding:28px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Collection</a><a href="#about">Heritage</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="deco-top"><div class="deco-line"></div><div class="deco-diamond"></div><span class="hero-eyebrow">Est. MCMXXIV</span><div class="deco-diamond"></div><div class="deco-line right"></div></div><h1>{{HEADLINE_A}}<em>{{HEADLINE_B}}</em>{{HEADLINE_C}}</h1><div class="deco-border"></div><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<div style="padding:0 80px"><div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></div>
<section class="features" id="features"><div class="features-head"><h2>The <em>Artistry</em></h2><div class="deco-border"></div></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Begin Your<em>Journey</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 22. RETRO 70S GROOVY ───────────────────────
  {
    name: 'Retro 70s Groovy', emoji: '🕺',
    keywords: ['retro','70s','vintage','groovy','fun','music','festival'],
    examples: ['Vintage record shop','Retro-themed café','Groovy festival brand'],
    theme: { bg:'#fdf0e0', text:'#3d1a00', sub:'rgba(61,26,0,0.55)', acc:'#f4721b', border:'1px solid rgba(244,114,27,0.25)', cardBg:'rgba(244,114,27,0.06)', headFont:"'Pacifico',cursive", bodyFont:"'Raleway',sans-serif", headWeight:'400', headCase:'none', radius:'100px', btnBg:'#f4721b', btnText:'#fdf0e0' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fdf0e0;color:#3d1a00;font-family:'Raleway',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:68px;background:rgba(253,240,224,.96);backdrop-filter:blur(8px);border-bottom:2px solid rgba(244,114,27,.2);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Pacifico',cursive;font-size:24px;color:#f4721b}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(61,26,0,.45);text-decoration:none;font-size:14px;font-weight:600;transition:color .15s}
.nav-links a:hover{color:#f4721b}
.hero{padding:130px 64px 80px;display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:center;min-height:90vh}
.hero-tag{font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#8b4513;margin-bottom:16px;display:flex;align-items:center;gap:10px}
h1{font-family:'Pacifico',cursive;font-size:clamp(44px,6vw,80px);line-height:1.2;color:#3d1a00;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 span{color:#f4721b}
.sub{font-size:16px;color:rgba(61,26,0,.55);line-height:1.75;margin-bottom:40px;font-weight:500}
.btn{padding:14px 44px;background:#f4721b;color:#fdf0e0;border:none;border-radius:100px;font-family:'Raleway',sans-serif;font-size:14px;font-weight:800;cursor:pointer;transition:all .25s;box-shadow:4px 4px 0 #8b4513}
.btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #8b4513}
.hero-circles{position:relative;height:360px}
.circle{position:absolute;border-radius:50%}
.c1{width:280px;height:280px;background:radial-gradient(circle at 35% 35%,#f4721b,#8b4513);top:40px;left:50%;transform:translateX(-50%);animation:spinCircle 20s linear infinite}
.c2{width:180px;height:180px;background:#fdf0e0;border:3px solid #f4721b;top:100px;left:10%;animation:bob 3s ease-in-out infinite}
.c3{width:100px;height:100px;background:#8b4513;top:60px;right:5%;animation:bob 3s ease-in-out infinite .5s}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:60px 64px}
.stat{background:#fff;border-radius:24px;padding:36px;text-align:center;border:2px solid rgba(244,114,27,.15);box-shadow:4px 4px 0 rgba(244,114,27,.15)}
.stat-n{font-family:'Pacifico',cursive;font-size:44px;color:#f4721b;line-height:1}
.stat-l{font-size:12px;color:rgba(61,26,0,.45);font-weight:700;margin-top:10px;text-transform:uppercase;letter-spacing:.08em}
.features{padding:60px 64px}
.features h2{font-family:'Pacifico',cursive;font-size:clamp(28px,4vw,52px);color:#3d1a00;text-align:center;margin-bottom:12px}
.features h2 span{color:#f4721b}
.features-sub{text-align:center;color:rgba(61,26,0,.5);font-size:16px;font-weight:500;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:#fff;border-radius:24px;padding:36px;transition:all .25s;border:2px solid rgba(244,114,27,.1);box-shadow:4px 4px 0 rgba(244,114,27,.1)}
.card:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 rgba(244,114,27,.2);border-color:rgba(244,114,27,.3)}
.card-ico{font-size:36px;display:block;margin-bottom:18px}
.card h3{font-family:'Pacifico',cursive;font-size:20px;color:#f4721b;margin-bottom:12px}
.card p{font-size:14px;color:rgba(61,26,0,.5);line-height:1.75;font-weight:500}
.quote{padding:80px 64px;background:#f4721b;text-align:center;position:relative;overflow:hidden}
.quote::before,.quote::after{content:'◯';position:absolute;font-size:200px;color:rgba(255,255,255,.06);line-height:1}
.quote::before{top:-40px;left:-40px}
.quote::after{bottom:-40px;right:-40px}
.quote q{font-family:'Pacifico',cursive;font-size:clamp(20px,3vw,32px);color:#fdf0e0;line-height:1.5;max-width:700px;display:inline-block;quotes:none;position:relative;z-index:1}
.cta-sec{padding:100px 64px;text-align:center}
.cta-sec h2{font-family:'Pacifico',cursive;font-size:clamp(36px,5vw,72px);color:#3d1a00;margin-bottom:16px}
.cta-sec h2 span{color:#f4721b}
.cta-sec p{font-size:16px;color:rgba(61,26,0,.45);margin-bottom:40px;font-weight:500}
footer{padding:32px 64px;border-top:2px solid rgba(244,114,27,.15);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Pacifico',cursive;font-size:20px;color:#f4721b}
.f-copy{font-size:13px;color:rgba(61,26,0,.35);font-weight:600}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes spinCircle{from{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(360deg)}}
@media(max-width:768px){nav{padding:0 24px}.hero{grid-template-columns:1fr;padding:110px 24px 60px}.hero-circles{display:none}.stats{grid-template-columns:1fr;padding:40px 24px;gap:16px}.features{padding:40px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Vibes</a><a href="#about">Story</a><a href="#cta">Join</a></div></nav>
<section class="hero"><div><div class="hero-tag">🕺 Far Out!</div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-circles"><div class="circle c1"></div><div class="circle c2"></div><div class="circle c3"></div></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2>What's <span>Groovy</span></h2><p class="features-sub">Everything you need to feel the vibe</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Get <span>Groovy</span> with Us</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 23. VINTAGE PRESS ─────────────────────────
  {
    name: 'Vintage Press', emoji: '📰',
    keywords: ['newspaper','editorial','vintage','press','journalism','blog','media'],
    examples: ['Digital magazine','News editorial brand','Independent journalism platform'],
    theme: { bg:'#f5f0e0', text:'#2a1f0e', sub:'rgba(42,31,14,0.55)', acc:'#8b1a1a', border:'1px solid rgba(42,31,14,0.2)', cardBg:'rgba(42,31,14,0.03)', headFont:"'Playfair Display',serif", bodyFont:"'Courier Prime',monospace", headWeight:'700', headCase:'none', radius:'0', btnBg:'#2a1f0e', btnText:'#f5f0e0' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f5f0e0;color:#2a1f0e;font-family:'Courier Prime',monospace;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='.5' fill='rgba(42,31,14,.04)'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0;background:#f5f0e0;border-bottom:3px double rgba(42,31,14,.3)}
.nav-top{padding:10px 64px;border-bottom:1px solid rgba(42,31,14,.15);display:flex;justify-content:space-between;align-items:center}
.nav-date{font-size:11px;color:rgba(42,31,14,.4);letter-spacing:.05em}
.logo{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:#2a1f0e;text-align:center;letter-spacing:.02em;padding:8px 64px}
.nav-links{display:flex;gap:0;border-top:1px solid rgba(42,31,14,.15)}
.nav-links a{color:rgba(42,31,14,.5);text-decoration:none;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:8px 20px;border-right:1px solid rgba(42,31,14,.1);font-weight:700;transition:background .15s,color .15s}
.nav-links a:hover{background:rgba(42,31,14,.06);color:#2a1f0e}
.hero{padding:170px 64px 80px;position:relative;z-index:1;border-bottom:3px double rgba(42,31,14,.2)}
.hero-dateline{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:rgba(42,31,14,.4);margin-bottom:20px;border-bottom:1px solid rgba(42,31,14,.15);padding-bottom:12px;display:flex;justify-content:space-between}
.hero-layout{display:grid;grid-template-columns:2fr 1fr;gap:48px;align-items:start}
.hero-main h1{font-family:'Playfair Display',serif;font-size:clamp(44px,6.5vw,88px);font-weight:900;line-height:.95;margin-bottom:24px;animation:fadeUp .7s ease forwards;border-bottom:2px solid rgba(42,31,14,.15);padding-bottom:24px}
h1 em{color:#8b1a1a;font-style:italic}
.sub{font-size:15px;color:rgba(42,31,14,.6);line-height:2;margin-bottom:32px;font-style:italic}
.btn{padding:12px 36px;background:#2a1f0e;color:#f5f0e0;border:none;font-family:'Courier Prime',monospace;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:background .15s}
.btn:hover{background:#8b1a1a}
.hero-side{border-left:1px solid rgba(42,31,14,.15);padding-left:32px}
.side-head{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;border-bottom:2px solid #2a1f0e;padding-bottom:8px;margin-bottom:20px}
.side-item{border-bottom:1px solid rgba(42,31,14,.12);padding-bottom:16px;margin-bottom:16px;font-size:13px;color:rgba(42,31,14,.65);line-height:1.7}
.side-item strong{font-family:'Playfair Display',serif;font-size:15px;color:#2a1f0e;display:block;margin-bottom:4px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:3px double rgba(42,31,14,.2);position:relative;z-index:1}
.stat{padding:36px 64px;border-right:1px solid rgba(42,31,14,.15);position:relative}
.stat:last-child{border-right:none}
.stat-n{font-family:'Playfair Display',serif;font-size:52px;font-weight:900;color:#8b1a1a;line-height:1;font-style:italic}
.stat-l{font-size:11px;color:rgba(42,31,14,.4);letter-spacing:.15em;text-transform:uppercase;margin-top:6px}
.features{padding:80px 64px;border-bottom:3px double rgba(42,31,14,.2);position:relative;z-index:1}
.feat-banner{background:#2a1f0e;color:#f5f0e0;padding:10px 24px;display:inline-block;font-family:'Playfair Display',serif;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:40px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:32px;border-right:1px solid rgba(42,31,14,.12);transition:background .15s}
.card:last-child{border-right:none}
.card:hover{background:rgba(42,31,14,.03)}
.card-ico{font-size:24px;display:block;margin-bottom:16px}
.card h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:10px;border-bottom:1px solid rgba(42,31,14,.1);padding-bottom:10px}
.card p{font-size:13px;color:rgba(42,31,14,.55);line-height:1.9;font-style:italic}
.quote{padding:60px 64px;background:#2a1f0e;color:#f5f0e0;border-bottom:3px double rgba(245,240,224,.2);position:relative;z-index:1}
.quote q{font-family:'Playfair Display',serif;font-size:clamp(18px,2.5vw,30px);font-style:italic;color:#f5f0e0;line-height:1.65;max-width:700px;display:block;quotes:none}
.quote q em{color:#c0965c;font-style:normal}
.cta-sec{padding:80px 64px;text-align:center;border-bottom:3px double rgba(42,31,14,.2);position:relative;z-index:1}
.cta-sec h2{font-family:'Playfair Display',serif;font-size:clamp(32px,4.5vw,64px);font-weight:900;margin-bottom:16px;line-height:1}
.cta-sec h2 em{color:#8b1a1a;font-style:italic}
.cta-sec p{font-size:15px;color:rgba(42,31,14,.45);margin-bottom:36px;font-style:italic}
footer{padding:28px 64px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:#2a1f0e}
.f-copy{font-size:11px;color:rgba(42,31,14,.35);letter-spacing:.1em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){.nav-top{padding:10px 24px}.logo{padding:8px 24px;font-size:24px}.nav-links a{padding:8px 12px;font-size:10px}.hero{padding:180px 24px 60px}.hero-layout{grid-template-columns:1fr}.hero-side{border-left:none;padding-left:0;border-top:1px solid rgba(42,31,14,.15);padding-top:24px;margin-top:24px}.stats{grid-template-columns:1fr}.stat{padding:24px;border-right:none;border-bottom:1px solid rgba(42,31,14,.12)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(42,31,14,.1)}.quote{padding:48px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="nav-top"><span class="nav-date">Saturday, May 10, 2025</span><span class="nav-date">Vol. CXXI · No. 42</span></div><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">World</a><a href="#about">Opinion</a><a href="#cta">Subscribe</a></div></nav>
<section class="hero"><div class="hero-dateline"><span>Breaking</span><span>{{BRAND_NAME}} Daily</span></div><div class="hero-layout"><div class="hero-main"><h1>{{HEADLINE_A}} <em>{{HEADLINE_B}}</em> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-side"><div class="side-head">Also Today</div><div class="side-item"><strong>{{FEAT_1_TITLE}}</strong>{{FEAT_1_DESC}}</div><div class="side-item"><strong>{{FEAT_2_TITLE}}</strong>{{FEAT_2_DESC}}</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-banner">Features</div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} <em>— {{BRAND_NAME}}</em></q></section>
<section class="cta-sec" id="cta"><h2>Subscribe to <em>{{BRAND_NAME}}</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025 · All rights reserved</div></footer>
</body></html>`,
  },

  // ── 24. ARCADE 80S ────────────────────────────
  {
    name: 'Arcade 80s', emoji: '🕹️',
    keywords: ['gaming','arcade','retro','80s','pixel','game','nostalgia'],
    examples: ['Retro arcade bar','Pixel art game studio','80s gaming nostalgia brand'],
    theme: { bg:'#000000', text:'#ffffff', sub:'rgba(255,255,255,0.6)', acc:'#ffd700', border:'1px solid rgba(255,215,0,0.3)', cardBg:'rgba(255,215,0,0.05)', headFont:"'Press Start 2P',cursive", bodyFont:"'Press Start 2P',cursive", headWeight:'400', headCase:'uppercase', radius:'0', btnBg:'#ffd700', btnText:'#000' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;image-rendering:pixelated}
body{background:#000;color:#fff;font-family:'Press Start 2P',cursive;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.015) 3px,rgba(255,255,255,.015) 4px);pointer-events:none;z-index:9999}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 40px;background:rgba(0,0,0,.95);border-bottom:2px solid #ffd700;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:14px;color:#ffd700;text-shadow:2px 2px 0 #ff6600,4px 4px 0 rgba(255,102,0,.3);letter-spacing:.04em}
.nav-links{display:flex;gap:24px}
.nav-links a{color:rgba(255,255,255,.5);text-decoration:none;font-size:8px;letter-spacing:.06em;transition:color .1s}
.nav-links a:hover{color:#ff1493}
.hero{min-height:100vh;padding:120px 40px 60px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative}
.score-bar{position:absolute;top:80px;left:0;right:0;display:flex;justify-content:space-around;font-size:8px;color:rgba(255,255,255,.4);letter-spacing:.04em;padding:0 40px}
.blink{animation:blink 1s step-start infinite}
h1{font-size:clamp(20px,4vw,40px);line-height:1.8;letter-spacing:.04em;max-width:700px;margin-bottom:32px;animation:fadeUp .6s ease forwards}
h1 .y{color:#ffd700;text-shadow:2px 2px 0 rgba(255,215,0,.4)}
h1 .p{color:#ff1493;text-shadow:2px 2px 0 rgba(255,20,147,.4)}
h1 .c{color:#00ffff;text-shadow:2px 2px 0 rgba(0,255,255,.4)}
.sub{font-size:9px;color:rgba(255,255,255,.5);line-height:2.4;max-width:400px;margin-bottom:48px;letter-spacing:.04em}
.btn{padding:16px 40px;background:#ffd700;color:#000;border:none;font-family:'Press Start 2P',cursive;font-size:11px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:all .1s;box-shadow:4px 4px 0 #ff6600}
.btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #ff6600}
.btn:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #ff6600}
.pixel-divider{height:16px;background:repeating-linear-gradient(90deg,#ffd700 0,#ffd700 8px,#ff1493 8px,#ff1493 16px,#00ffff 16px,#00ffff 24px,#000 24px,#000 32px);margin:60px 0}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:2px solid #ffd700}
.stat{padding:40px 24px;border-right:2px solid #ffd700;text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:28px;color:#ffd700;text-shadow:2px 2px 0 rgba(255,215,0,.4);line-height:1;margin-bottom:16px}
.stat-l{font-size:7px;color:rgba(255,255,255,.4);letter-spacing:.06em;line-height:2}
.features{padding:60px 40px}
.features h2{font-size:clamp(14px,2.5vw,22px);color:#ff1493;text-shadow:2px 2px 0 rgba(255,20,147,.4);text-align:center;margin-bottom:48px;letter-spacing:.04em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.card{background:rgba(255,215,0,.04);border:2px solid rgba(255,215,0,.2);padding:28px 20px;transition:all .1s}
.card:hover{background:rgba(255,215,0,.08);border-color:#ffd700}
.card-ico{font-size:28px;display:block;margin-bottom:16px}
.card h3{font-size:8px;color:#00ffff;margin-bottom:12px;letter-spacing:.06em;line-height:1.8}
.card p{font-size:7px;color:rgba(255,255,255,.45);line-height:2.2;letter-spacing:.03em}
.quote{padding:60px 40px;text-align:center;background:rgba(255,20,147,.05);border-top:2px solid #ff1493;border-bottom:2px solid #ff1493}
.quote q{font-size:clamp(10px,1.5vw,16px);color:#ff1493;text-shadow:2px 2px 0 rgba(255,20,147,.4);line-height:2;max-width:600px;display:inline-block;quotes:none;letter-spacing:.04em}
.cta-sec{padding:80px 40px;text-align:center}
.cta-sec h2{font-size:clamp(16px,3vw,28px);color:#ffd700;text-shadow:2px 2px 0 rgba(255,215,0,.4);margin-bottom:16px;letter-spacing:.04em;line-height:1.8}
.cta-sec p{font-size:8px;color:rgba(255,255,255,.4);margin-bottom:40px;letter-spacing:.04em;line-height:2.2}
footer{padding:24px 40px;border-top:2px solid #ffd700;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:10px;color:#ffd700}
.f-copy{font-size:7px;color:rgba(255,255,255,.3);letter-spacing:.04em}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@media(max-width:768px){nav{padding:14px 20px}.logo{font-size:10px}.nav-links{gap:16px}.hero{padding:100px 20px 60px}.stats{grid-template-columns:1fr}.stat{border-right:none;border-bottom:2px solid #ffd700}.features{padding:40px 20px}.grid{grid-template-columns:1fr;gap:4px}.quote{padding:48px 20px}.cta-sec{padding:60px 20px}footer{flex-direction:column;gap:10px;padding:20px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">PLAY</a><a href="#about">SCORES</a><a href="#cta">INSERT COIN</a></div></nav>
<section class="hero"><div class="score-bar"><span>SCORE: 000000</span><span class="blink">▶ PLAYER 1</span><span>HI-SCORE: 999999</span></div><h1><span class="y">{{HEADLINE_A}}</span><br><span class="p">{{HEADLINE_B}}</span><br><span class="c">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">▶ {{CTA_TEXT}}</button></section>
<div class="pixel-divider"></div>
<div style="padding:0 40px"><div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></div>
<section class="features" id="features"><h2>— POWER-UPS —</h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>GAME ON!</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">▶ {{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">© {{BRAND_NAME}} 2025 · {{FOOTER_TAGLINE}}</div></footer>
</body></html>`,
  },

  // ── 25. STARK MONOCHROME ───────────────────────
  {
    name: 'Stark Monochrome', emoji: '⬛',
    keywords: ['minimalist','editorial','design','fashion','photography','stark','bold'],
    examples: ['Photography portfolio','Minimalist design studio','Editorial fashion brand'],
    theme: { bg:'#ffffff', text:'#000000', sub:'rgba(0,0,0,0.5)', acc:'#000000', border:'1px solid #000', cardBg:'#f5f5f5', headFont:"'Bebas Neue',cursive", bodyFont:"'Helvetica Neue',Helvetica,Arial,sans-serif", headWeight:'400', headCase:'uppercase', radius:'0', btnBg:'#000', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 60px;height:56px;background:#fff;border-bottom:2px solid #000;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Bebas Neue',cursive;font-size:24px;letter-spacing:.08em;color:#000}
.nav-links{display:flex;gap:0}
.nav-links a{color:rgba(0,0,0,.4);text-decoration:none;font-size:11px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;padding:0 20px;border-left:1px solid rgba(0,0,0,.12);transition:color .15s}
.nav-links a:hover{color:#000}
.hero{padding:120px 60px 0;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;border-bottom:2px solid #000;position:relative}
.hero-index{position:absolute;top:120px;right:60px;font-family:'Bebas Neue',cursive;font-size:180px;color:rgba(0,0,0,.04);line-height:1;pointer-events:none}
h1{font-family:'Bebas Neue',cursive;font-size:clamp(80px,14vw,200px);line-height:.9;letter-spacing:-.01em;text-transform:uppercase;max-width:100%;margin-bottom:0;animation:fadeUp .6s ease forwards;border-bottom:2px solid #000;padding-bottom:48px}
h1 span{display:block}
.hero-bottom{display:grid;grid-template-columns:1fr 2fr 1fr;gap:0;border-top:none;padding:36px 0}
.hero-tag{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.35);align-self:center}
.sub{font-size:15px;color:rgba(0,0,0,.5);line-height:1.7;text-align:center;padding:0 40px}
.btn{justify-self:end;padding:12px 36px;background:#000;color:#fff;border:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:background .15s;align-self:center}
.btn:hover{background:rgba(0,0,0,.75)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:2px solid #000}
.stat{padding:44px 60px;border-right:2px solid #000}
.stat:last-child{border-right:none}
.stat-n{font-family:'Bebas Neue',cursive;font-size:64px;color:#000;line-height:1}
.stat-l{font-size:10px;color:rgba(0,0,0,.35);letter-spacing:.2em;text-transform:uppercase;font-weight:500;margin-top:8px}
.features{padding:80px 60px;border-bottom:2px solid #000}
.features-top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid rgba(0,0,0,.12);padding-bottom:28px;margin-bottom:48px}
.features h2{font-family:'Bebas Neue',cursive;font-size:clamp(36px,5vw,72px);letter-spacing:.02em}
.feat-label{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.35)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:40px;border-right:1px solid rgba(0,0,0,.1);transition:background .15s}
.card:last-child{border-right:none}
.card:hover{background:#f5f5f5}
.card-ico{font-size:24px;display:block;margin-bottom:20px;filter:grayscale(100%)}
.card h3{font-family:'Bebas Neue',cursive;font-size:24px;letter-spacing:.04em;margin-bottom:12px}
.card p{font-size:13px;color:rgba(0,0,0,.45);line-height:1.8}
.quote{padding:80px 60px;background:#000;color:#fff;border-bottom:2px solid #000}
.quote q{font-family:'Bebas Neue',cursive;font-size:clamp(32px,5vw,72px);line-height:1.1;letter-spacing:.02em;max-width:900px;display:block;quotes:none}
.cta-sec{padding:80px 60px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000}
.cta-sec h2{font-family:'Bebas Neue',cursive;font-size:clamp(52px,8vw,120px);letter-spacing:.02em;line-height:.9}
.cta-btn-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:16px}
.btn-lg{padding:16px 52px;background:#000;color:#fff;border:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:background .15s}
.btn-lg:hover{background:rgba(0,0,0,.75)}
footer{padding:24px 60px;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Bebas Neue',cursive;font-size:20px;letter-spacing:.08em}
.f-copy{font-size:10px;color:rgba(0,0,0,.35);letter-spacing:.15em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:90px 24px 0}.hero-index{display:none}.h1-text{font-size:clamp(56px,12vw,80px)}.hero-bottom{grid-template-columns:1fr}.hero-bottom>*{padding:20px 0;border-bottom:1px solid rgba(0,0,0,.1)}.btn{justify-self:start}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:2px solid #000}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(0,0,0,.1)}.quote{padding:60px 24px}.cta-sec{flex-direction:column;gap:40px;align-items:flex-start;padding:60px 24px}footer{padding:24px;flex-direction:column;gap:8px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-index">01</div><h1><span>{{HEADLINE_A}}</span><span>{{HEADLINE_B}}</span><span>{{HEADLINE_C}}</span></h1><div class="hero-bottom"><span class="hero-tag">{{BRAND_NAME}} · Est. 2025</span><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="features-top"><h2>Services</h2><span class="feat-label">What we offer</span></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Let's Work Together.</h2><div class="cta-btn-wrap"><button class="btn-lg">{{CTA_TEXT}}</button><span style="font-size:10px;color:rgba(0,0,0,.35);letter-spacing:.15em;text-transform:uppercase">{{FOOTER_TAGLINE}}</span></div></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">© {{BRAND_NAME}} 2025 · {{FOOTER_TAGLINE}}</div></footer>
</body></html>`,
  },

  // ── 26. COASTAL BREEZY ────────────────────────
  {
    name: 'Coastal Breezy', emoji: '🌊',
    keywords: ['coastal','beach','travel','vacation','surf','ocean','relaxed'],
    examples: ['Beach resort website','Surf school brand','Coastal lifestyle brand'],
    theme: { bg:'#e0f2fe', text:'#0c3651', sub:'rgba(12,54,81,0.55)', acc:'#0284c7', border:'1px solid rgba(2,132,199,0.2)', cardBg:'#ffffff', headFont:"'DM Sans',sans-serif", bodyFont:"'DM Sans',sans-serif", headWeight:'700', headCase:'none', radius:'16px', btnBg:'#0284c7', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#e0f2fe;color:#0c3651;font-family:'DM Sans',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:64px;background:rgba(224,242,254,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(2,132,199,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:800;color:#0c3651;letter-spacing:-.02em}
.logo span{color:#0284c7}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(12,54,81,.5);text-decoration:none;font-size:14px;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#0284c7}
.hero{padding:140px 64px 0;min-height:100vh;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.wave-hero{position:absolute;bottom:0;left:0;right:0;height:200px}
.wave-path{fill:#fef3c7;opacity:.6}
.hero-chip{display:inline-flex;align-items:center;gap:8px;background:rgba(2,132,199,.12);border:1px solid rgba(2,132,199,.2);border-radius:100px;padding:6px 16px;font-size:12px;font-weight:600;color:#0284c7;margin-bottom:24px}
h1{font-size:clamp(42px,6vw,80px);font-weight:800;line-height:1.1;letter-spacing:-.03em;max-width:720px;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 span{color:#0284c7}
h1 em{color:#f59e0b;font-style:normal}
.sub{font-size:18px;color:rgba(12,54,81,.55);line-height:1.7;max-width:480px;margin-bottom:44px}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:14px 36px;background:#0284c7;color:#fff;border:none;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 6px 20px rgba(2,132,199,.3)}
.btn:hover{background:#0369a1;transform:translateY(-2px);box-shadow:0 12px 32px rgba(2,132,199,.4)}
.btn2{padding:14px 28px;background:#fff;color:#0c3651;border:1px solid rgba(12,54,81,.12);border-radius:100px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#0284c7;color:#0284c7}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:80px 64px;background:#fef3c7}
.stat{background:#fff;border-radius:20px;padding:36px;text-align:center;box-shadow:0 4px 20px rgba(12,54,81,.08);border-bottom:4px solid #0284c7}
.stat-n{font-size:44px;font-weight:800;color:#0284c7;letter-spacing:-.03em;line-height:1}
.stat-l{font-size:13px;color:rgba(12,54,81,.5);font-weight:500;margin-top:8px}
.features{padding:80px 64px;position:relative}
.features::before{content:'';position:absolute;top:0;left:0;right:0;height:60px;background:#fef3c7;clip-path:polygon(0 0,100% 0,100% 100%,0 60%)}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-.02em}
.features h2 span{color:#0284c7}
.features-sub{text-align:center;color:rgba(12,54,81,.5);font-size:16px;font-weight:500;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:#fff;border-radius:20px;padding:32px;transition:all .25s;box-shadow:0 4px 20px rgba(12,54,81,.06);border:1px solid rgba(2,132,199,.1)}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(2,132,199,.12)}
.card-ico{font-size:32px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;color:#0c3651}
.card p{font-size:14px;color:rgba(12,54,81,.5);line-height:1.75;font-weight:400}
.quote{padding:80px 64px;text-align:center;background:linear-gradient(135deg,rgba(2,132,199,.08),rgba(245,158,11,.08))}
.quote q{font-size:clamp(18px,2.5vw,28px);font-weight:700;color:#0c3651;line-height:1.6;max-width:660px;display:inline-block;quotes:none}
.cta-sec{padding:100px 64px;text-align:center;background:#0284c7;color:#fff;position:relative;overflow:hidden}
.cta-sec::before{content:'';position:absolute;top:-60px;left:0;right:0;height:60px;background:#e0f2fe;clip-path:polygon(0 0,100% 100%,0 100%)}
.cta-sec::after{content:'';position:absolute;bottom:-60px;left:0;right:0;height:60px;background:#e0f2fe;clip-path:polygon(100% 0,100% 100%,0 100%)}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:800;letter-spacing:-.03em;margin-bottom:16px;color:#fff}
.cta-sec p{font-size:16px;color:rgba(255,255,255,.7);margin-bottom:40px}
.cta-sec .btn{background:#fff;color:#0284c7;box-shadow:0 8px 24px rgba(0,0,0,.15)}
.cta-sec .btn:hover{background:#f0f9ff}
footer{padding:32px 64px;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:800;color:#0c3651}
.f-logo span{color:#0284c7}
.f-copy{font-size:13px;color:rgba(12,54,81,.35);font-weight:500}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:110px 24px 60px}.stats{grid-template-columns:1fr;padding:60px 24px;gap:16px}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:80px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span> 🌊</span></div><div class="nav-links"><a href="#features">Explore</a><a href="#about">About</a><a href="#cta">Book</a></div></nav>
<section class="hero"><div class="hero-chip">🌊 Coastal Living</div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span><br><em>{{HEADLINE_C}}</em></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Explore →</button></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2>Life's Better at <span>{{BRAND_NAME}}</span></h2><p class="features-sub">Everything you need for the perfect coastal experience</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Start Your Adventure</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span> 🌊</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 27. DARK PORTFOLIO ────────────────────────
  {
    name: 'Dark Portfolio', emoji: '📸',
    keywords: ['portfolio','photography','art','creative','artist','photographer','minimal'],
    examples: ['Photographer portfolio','Creative artist website','Film director portfolio'],
    theme: { bg:'#0a0a0a', text:'#ffffff', sub:'rgba(255,255,255,0.45)', acc:'#c9a84c', border:'1px solid rgba(255,255,255,0.08)', cardBg:'rgba(255,255,255,0.03)', headFont:"'Syne',sans-serif", bodyFont:"'Syne',sans-serif", headWeight:'800', headCase:'none', radius:'0', btnBg:'transparent', btnText:'#c9a84c' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#fff;font-family:'Syne',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:28px 60px;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:16px;font-weight:800;color:#fff;letter-spacing:.05em}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(255,255,255,.35);text-decoration:none;font-size:12px;font-weight:500;letter-spacing:.08em;transition:color .2s}
.nav-links a:hover{color:#c9a84c}
.hero{min-height:100vh;padding:140px 60px 80px;display:flex;flex-direction:column;justify-content:flex-end;border-bottom:1px solid rgba(255,255,255,.06)}
.hero-num{font-size:200px;font-weight:800;color:rgba(255,255,255,.02);position:absolute;top:100px;right:60px;line-height:1;pointer-events:none}
h1{font-size:clamp(52px,8vw,120px);font-weight:800;line-height:.92;letter-spacing:-.03em;max-width:900px;margin-bottom:32px;animation:fadeUp .8s ease forwards}
h1 em{color:#c9a84c;font-style:normal}
.hero-meta{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-top:60px}
.sub{font-size:15px;color:rgba(255,255,255,.4);line-height:1.9;max-width:360px;font-weight:400}
.btn{padding:14px 44px;background:transparent;color:#c9a84c;border:1px solid #c9a84c;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .25s;flex-shrink:0}
.btn:hover{background:#c9a84c;color:#0a0a0a}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid rgba(255,255,255,.06)}
.stat{padding:48px 60px;border-right:1px solid rgba(255,255,255,.05)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:800;color:#c9a84c;letter-spacing:-.04em;line-height:1}
.stat-l{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:.12em;text-transform:uppercase;margin-top:8px}
.features{padding:100px 60px;border-bottom:1px solid rgba(255,255,255,.06)}
.features-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:64px}
.features h2{font-size:clamp(28px,3.5vw,48px);font-weight:800;letter-spacing:-.02em}
.features h2 em{color:#c9a84c;font-style:normal}
.feat-count{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:.15em;text-transform:uppercase}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:40px;border-right:1px solid rgba(255,255,255,.05);transition:all .25s}
.card:last-child{border-right:none}
.card:hover{background:rgba(255,255,255,.02)}
.card:hover .card-ico{color:#c9a84c}
.card-ico{font-size:28px;display:block;margin-bottom:20px;transition:color .25s}
.card h3{font-size:18px;font-weight:700;margin-bottom:12px;letter-spacing:-.01em}
.card p{font-size:13px;color:rgba(255,255,255,.35);line-height:1.85}
.quote{padding:80px 60px;border-bottom:1px solid rgba(255,255,255,.06)}
.quote q{font-size:clamp(20px,3vw,36px);font-weight:700;color:rgba(255,255,255,.6);line-height:1.4;max-width:800px;display:block;quotes:none;letter-spacing:-.01em}
.quote q em{color:#c9a84c;font-style:normal}
.cta-sec{padding:120px 60px;display:flex;justify-content:space-between;align-items:center}
.cta-sec h2{font-size:clamp(44px,7vw,100px);font-weight:800;letter-spacing:-.04em;line-height:.9}
.cta-sec h2 em{color:#c9a84c;font-style:normal;display:block}
footer{padding:28px 60px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;font-weight:800;color:#fff;letter-spacing:.05em}
.f-copy{font-size:11px;color:rgba(255,255,255,.2);letter-spacing:.08em}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:20px 24px}.hero{padding:110px 24px 60px}.hero-num{display:none}.hero-meta{flex-direction:column;align-items:flex-start}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(255,255,255,.05)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(255,255,255,.04)}.quote{padding:60px 24px}.cta-sec{flex-direction:column;gap:40px;align-items:flex-start;padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-num">01</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><div class="hero-meta"><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="features-top"><h2>Selected <em>Work</em></h2><span class="feat-count">03 Services</span></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q><em>{{BRAND_NAME}}:</em> {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Let's create<em>together.</em></h2><button class="btn" style="font-size:13px;padding:16px 56px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 28. CORPORATE TRUST ───────────────────────
  {
    name: 'Corporate Trust', emoji: '🏢',
    keywords: ['corporate','professional','consulting','enterprise','b2b','business','services'],
    examples: ['Management consulting firm','Enterprise software company','Professional services brand'],
    theme: { bg:'#f8fafc', text:'#1e293b', sub:'rgba(30,41,59,0.55)', acc:'#1e3a5f', border:'1px solid rgba(30,58,95,0.12)', cardBg:'#ffffff', headFont:"'Source Sans Pro',sans-serif", bodyFont:"'Source Sans Pro',sans-serif", headWeight:'700', headCase:'none', radius:'4px', btnBg:'#1e3a5f', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f8fafc;color:#1e293b;font-family:'Source Sans Pro',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 80px;height:60px;background:#fff;border-bottom:1px solid rgba(30,41,59,.1);display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.logo{font-size:18px;font-weight:700;color:#1e293b;letter-spacing:-.01em}
.logo span{color:#1e3a5f}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(30,41,59,.5);text-decoration:none;font-size:14px;font-weight:600;transition:color .15s}
.nav-links a:hover{color:#1e3a5f}
.hero{padding:130px 80px 80px;background:#fff;border-bottom:1px solid rgba(30,41,59,.08)}
.hero-inner{display:grid;grid-template-columns:1.2fr 1fr;gap:60px;align-items:center;max-width:1200px;margin:0 auto}
.hero-eyebrow{font-size:12px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#1e3a5f;margin-bottom:20px;display:flex;align-items:center;gap:10px}
.hero-eyebrow::before{content:'';width:24px;height:2px;background:#1e3a5f}
h1{font-size:clamp(34px,4.5vw,60px);font-weight:700;line-height:1.15;letter-spacing:-.02em;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 span{color:#1e3a5f}
.sub{font-size:17px;color:rgba(30,41,59,.55);line-height:1.75;margin-bottom:40px;font-weight:400}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:12px 32px;background:#1e3a5f;color:#fff;border:none;border-radius:4px;font-family:'Source Sans Pro',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s}
.btn:hover{background:#162d4a;box-shadow:0 4px 16px rgba(30,58,95,.25)}
.btn2{padding:12px 28px;background:transparent;color:#1e3a5f;border:1px solid rgba(30,58,95,.3);border-radius:4px;font-family:'Source Sans Pro',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#1e3a5f;background:rgba(30,58,95,.04)}
.hero-certs{display:flex;gap:24px;flex-wrap:wrap;margin-top:40px}
.cert{font-size:12px;font-weight:600;color:rgba(30,41,59,.45);display:flex;align-items:center;gap:6px}
.cert::before{content:'✓';color:#1e3a5f;font-weight:700}
.hero-side{background:#f8fafc;border:1px solid rgba(30,41,59,.08);border-radius:8px;padding:32px}
.metric{padding:20px 0;border-bottom:1px solid rgba(30,41,59,.07)}
.metric:last-child{border-bottom:none;padding-bottom:0}
.metric:first-child{padding-top:0}
.metric-n{font-size:32px;font-weight:700;color:#1e3a5f;letter-spacing:-.02em}
.metric-l{font-size:13px;color:rgba(30,41,59,.45);font-weight:600;margin-top:4px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;background:#fff;border-top:1px solid rgba(30,41,59,.08);border-bottom:1px solid rgba(30,41,59,.08)}
.stat{padding:44px 80px;border-right:1px solid rgba(30,41,59,.07)}
.stat:last-child{border-right:none}
.stat-n{font-size:44px;font-weight:700;color:#1e3a5f;letter-spacing:-.03em;line-height:1}
.stat-l{font-size:13px;color:rgba(30,41,59,.45);font-weight:600;margin-top:8px}
.features{padding:80px;max-width:1360px;margin:0 auto}
.features h2{font-size:clamp(26px,3.5vw,44px);font-weight:700;margin-bottom:10px;letter-spacing:-.02em}
.features h2 span{color:#1e3a5f}
.features-sub{color:rgba(30,41,59,.5);font-size:16px;margin-bottom:48px;font-weight:400}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:1px solid rgba(30,41,59,.08);border-radius:6px;padding:32px;transition:all .25s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.card:hover{box-shadow:0 8px 24px rgba(30,58,95,.1);transform:translateY(-2px);border-color:rgba(30,58,95,.15)}
.card-ico{font-size:28px;display:block;margin-bottom:16px}
.card h3{font-size:17px;font-weight:700;margin-bottom:10px;letter-spacing:-.01em}
.card p{font-size:14px;color:rgba(30,41,59,.5);line-height:1.7}
.quote{padding:64px 80px;background:#1e3a5f;color:#fff}
.quote q{font-size:clamp(17px,2.5vw,26px);font-weight:400;color:rgba(255,255,255,.85);line-height:1.65;max-width:700px;display:block;quotes:none}
.quote q strong{font-weight:700;color:#fff}
.cta-sec{padding:80px;text-align:center;background:#fff;border-top:1px solid rgba(30,41,59,.08)}
.cta-sec h2{font-size:clamp(28px,4vw,52px);font-weight:700;letter-spacing:-.02em;margin-bottom:16px}
.cta-sec h2 span{color:#1e3a5f}
.cta-sec p{font-size:16px;color:rgba(30,41,59,.5);margin-bottom:36px}
footer{padding:28px 80px;border-top:1px solid rgba(30,41,59,.08);display:flex;justify-content:space-between;align-items:center;background:#fff}
.f-logo{font-size:16px;font-weight:700;color:#1e293b}
.f-logo span{color:#1e3a5f}
.f-copy{font-size:13px;color:rgba(30,41,59,.35)}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:100px 24px 60px}.hero-inner{grid-template-columns:1fr}.hero-side{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(30,41,59,.07)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:48px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Services</a><a href="#about">About</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-inner"><div><div class="hero-eyebrow">Trusted by Fortune 500</div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Learn More</button></div><div class="hero-certs"><span class="cert">ISO 9001 Certified</span><span class="cert">SOC 2 Compliant</span><span class="cert">GDPR Ready</span></div></div><div class="hero-side"><div class="metric"><div class="metric-n">{{STAT_1_NUM}}</div><div class="metric-l">{{STAT_1_LABEL}}</div></div><div class="metric"><div class="metric-n">{{STAT_2_NUM}}</div><div class="metric-l">{{STAT_2_LABEL}}</div></div><div class="metric"><div class="metric-n">{{STAT_3_NUM}}</div><div class="metric-l">{{STAT_3_LABEL}}</div></div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Our <span>Capabilities</span></h2><p class="features-sub">Comprehensive solutions for complex challenges</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q><strong>{{BRAND_NAME}}:</strong> {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Ready to <span>transform</span> your business?</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:15px;padding:14px 48px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 29. GALLERY WHITE ─────────────────────────
  {
    name: 'Gallery White', emoji: '🖼️',
    keywords: ['gallery','museum','art','exhibition','culture','minimal','white'],
    examples: ['Art gallery website','Museum exhibition','Contemporary art space'],
    theme: { bg:'#ffffff', text:'#111111', sub:'rgba(17,17,17,0.45)', acc:'#111111', border:'1px solid #111', cardBg:'#ffffff', headFont:"'Libre Baskerville',serif", bodyFont:"'Didact Gothic',sans-serif", headWeight:'700', headCase:'none', radius:'0', btnBg:'transparent', btnText:'#111' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Didact+Gothic&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#111;font-family:'Didact Gothic',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 80px;height:60px;background:#fff;border-bottom:1px solid #111;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Libre Baskerville',serif;font-size:16px;font-weight:700;color:#111;letter-spacing:.04em}
.nav-links{display:flex;gap:0}
.nav-links a{color:rgba(17,17,17,.45);text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding:0 24px;height:60px;line-height:60px;border-left:1px solid rgba(17,17,17,.1);transition:color .15s,background .15s}
.nav-links a:hover{color:#111;background:rgba(17,17,17,.03)}
.hero{padding:130px 80px 80px;min-height:90vh;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;border-bottom:1px solid #111}
.hero-left{}
.hero-label{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:rgba(17,17,17,.35);margin-bottom:32px;display:flex;align-items:center;gap:16px}
.hero-label::before{content:'';width:32px;height:1px;background:#111}
h1{font-family:'Libre Baskerville',serif;font-size:clamp(40px,5.5vw,76px);font-weight:700;line-height:1.05;max-width:540px;margin-bottom:28px;animation:fadeUp .7s ease forwards}
h1 em{font-style:italic;color:rgba(17,17,17,.6)}
.sub{font-size:15px;color:rgba(17,17,17,.45);line-height:1.9;margin-bottom:48px;max-width:400px}
.btn{display:inline-block;padding:13px 40px;background:transparent;color:#111;border:1px solid #111;font-family:'Didact Gothic',sans-serif;font-size:11px;letter-spacing:.25em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.btn:hover{background:#111;color:#fff}
.hero-right{display:flex;flex-direction:column;gap:1px;background:#111}
.hero-panel{background:#fff;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center}
.hero-panel:first-child{aspect-ratio:4/2.5}
.panel-content{text-align:center;padding:32px}
.panel-num{font-family:'Libre Baskerville',serif;font-size:60px;color:rgba(17,17,17,.06);line-height:1;margin-bottom:8px}
.panel-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(17,17,17,.3)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid #111}
.stat{padding:44px 80px;border-right:1px solid #111}
.stat:last-child{border-right:none}
.stat-n{font-family:'Libre Baskerville',serif;font-size:52px;font-weight:700;color:#111;font-style:italic;line-height:1}
.stat-l{font-size:11px;color:rgba(17,17,17,.35);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:80px;border-bottom:1px solid #111}
.features-top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid rgba(17,17,17,.1);padding-bottom:28px;margin-bottom:56px}
.features h2{font-family:'Libre Baskerville',serif;font-size:clamp(24px,3vw,40px);font-weight:700}
.feat-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(17,17,17,.35)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:40px;border-right:1px solid rgba(17,17,17,.1);transition:background .15s}
.card:last-child{border-right:none}
.card:hover{background:rgba(17,17,17,.02)}
.card-ico{font-size:24px;display:block;margin-bottom:20px}
.card h3{font-family:'Libre Baskerville',serif;font-size:19px;font-weight:700;margin-bottom:12px;font-style:italic}
.card p{font-size:13px;color:rgba(17,17,17,.45);line-height:1.9}
.quote{padding:80px;background:#111;color:#fff;border-bottom:1px solid #111}
.quote q{font-family:'Libre Baskerville',serif;font-size:clamp(20px,3vw,36px);font-style:italic;font-weight:400;color:rgba(255,255,255,.8);line-height:1.6;max-width:720px;display:block;quotes:none}
.cta-sec{padding:80px;border-bottom:1px solid #111;display:flex;justify-content:space-between;align-items:center}
.cta-sec h2{font-family:'Libre Baskerville',serif;font-size:clamp(32px,4.5vw,64px);font-weight:700;font-style:italic;line-height:1}
footer{padding:28px 80px;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Libre Baskerville',serif;font-size:14px;font-weight:700;color:#111}
.f-copy{font-size:11px;color:rgba(17,17,17,.3);letter-spacing:.12em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.nav-links a{padding:0 14px;font-size:10px}.hero{grid-template-columns:1fr;padding:110px 24px 60px;gap:40px}.hero-right{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid #111}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(17,17,17,.1)}.quote{padding:60px 24px}.cta-sec{flex-direction:column;gap:32px;align-items:flex-start;padding:60px 24px}footer{flex-direction:column;gap:8px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Exhibitions</a><a href="#about">About</a><a href="#cta">Visit</a></div></nav>
<section class="hero"><div class="hero-left"><div class="hero-label">Current Exhibition</div><h1>{{HEADLINE_A}}<br><em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-right"><div class="hero-panel"><div class="panel-content"><div class="panel-num">I</div><div class="panel-label">Main Gallery</div></div></div><div class="hero-panel"><div class="panel-content"><div class="panel-num">II</div><div class="panel-label">East Wing</div></div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="features-top"><h2>The Experience</h2><span class="feat-label">Three galleries</span></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Plan Your <em>Visit</em></h2><button class="btn" style="font-size:12px;padding:14px 52px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 30. DYNAMIC ANGLES ────────────────────────
  {
    name: 'Dynamic Angles', emoji: '🔷',
    keywords: ['agency','creative','tech','startup','bold','dynamic','modern'],
    examples: ['Creative agency','Tech startup','Bold brand campaign'],
    theme: { bg:'#111111', text:'#ffffff', sub:'rgba(255,255,255,0.5)', acc:'#7c3aed', border:'1px solid rgba(124,58,237,0.25)', cardBg:'rgba(124,58,237,0.06)', headFont:"'Outfit',sans-serif", bodyFont:"'Outfit',sans-serif", headWeight:'800', headCase:'none', radius:'8px', btnBg:'#7c3aed', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#111;color:#fff;font-family:'Outfit',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:64px;background:rgba(17,17,17,.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(124,58,237,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:800;color:#fff;letter-spacing:-.02em}
.logo span{color:#7c3aed}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(255,255,255,.4);text-decoration:none;font-size:14px;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#a78bfa}
.hero{padding:130px 64px 0;position:relative;overflow:hidden;min-height:100vh;display:flex;align-items:center}
.hero-diagonal{position:absolute;top:0;right:-100px;width:60%;height:100%;background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(167,139,250,.06));clip-path:polygon(20% 0,100% 0,100% 100%,0% 100%);z-index:0}
.hero-diagonal2{position:absolute;top:30%;right:10%;width:40%;height:60%;background:rgba(124,58,237,.06);clip-path:polygon(10% 0,100% 10%,90% 100%,0% 90%);z-index:0}
.hero-content{position:relative;z-index:1;max-width:760px}
.hero-chip{display:inline-flex;align-items:center;gap:8px;background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3);border-radius:100px;padding:6px 16px;font-size:12px;font-weight:600;color:#a78bfa;margin-bottom:28px}
.hero-chip span{width:6px;height:6px;border-radius:50%;background:#7c3aed;animation:pulse 1.5s infinite}
h1{font-size:clamp(44px,7vw,96px);font-weight:900;line-height:.95;letter-spacing:-.04em;margin-bottom:24px;animation:fadeUp .7s ease forwards}
h1 .acc{background:linear-gradient(135deg,#7c3aed,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block}
.sub{font-size:18px;color:rgba(255,255,255,.45);line-height:1.7;max-width:500px;margin-bottom:48px;font-weight:400}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:14px 36px;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 24px rgba(124,58,237,.4)}
.btn:hover{background:#6d28d9;transform:translateY(-2px);box-shadow:0 8px 32px rgba(124,58,237,.5)}
.btn2{padding:14px 28px;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:8px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s}
.btn2:hover{background:rgba(255,255,255,.1)}
.stats-band{clip-path:polygon(0 8%,100% 0,100% 92%,0 100%);background:linear-gradient(135deg,rgba(124,58,237,.15),rgba(124,58,237,.05));padding:80px 64px;margin:60px 0}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.stat{padding:0 48px;border-right:1px solid rgba(124,58,237,.2)}
.stat:first-child{padding-left:0}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:900;letter-spacing:-.04em;line-height:1;background:linear-gradient(135deg,#7c3aed,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-l{font-size:13px;color:rgba(255,255,255,.4);font-weight:500;margin-top:8px}
.features{padding:80px 64px;position:relative}
.features h2{font-size:clamp(28px,4vw,52px);font-weight:800;letter-spacing:-.03em;margin-bottom:12px}
.features h2 .acc{background:linear-gradient(135deg,#7c3aed,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.features-sub{color:rgba(255,255,255,.4);font-size:16px;margin-bottom:52px;font-weight:400}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.15);border-radius:12px;padding:32px;transition:all .25s;clip-path:polygon(0 0,100% 0,100% 88%,96% 100%,0 100%)}
.card:hover{background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.3);transform:translateY(-4px)}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;letter-spacing:-.01em}
.card p{font-size:14px;color:rgba(255,255,255,.4);line-height:1.75}
.quote{padding:80px 64px;background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(124,58,237,.04));clip-path:polygon(0 0,100% 5%,100% 100%,0 95%)}
.quote q{font-size:clamp(18px,2.5vw,30px);font-weight:700;color:rgba(255,255,255,.75);line-height:1.5;max-width:720px;display:block;quotes:none;letter-spacing:-.01em}
.quote q span{color:#a78bfa}
.cta-sec{padding:100px 64px;text-align:center}
.cta-sec h2{font-size:clamp(36px,5.5vw,80px);font-weight:900;letter-spacing:-.04em;margin-bottom:16px;line-height:.95}
.cta-sec h2 .acc{background:linear-gradient(135deg,#7c3aed,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block}
.cta-sec p{font-size:16px;color:rgba(255,255,255,.4);margin-bottom:40px}
footer{padding:28px 64px;border-top:1px solid rgba(124,58,237,.1);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:800;color:#fff}
.f-logo span{color:#7c3aed}
.f-copy{font-size:12px;color:rgba(255,255,255,.25)}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:110px 24px 60px}.stats-band{clip-path:none;padding:60px 24px;margin:40px 0}.stats{grid-template-columns:1fr;gap:32px}.stat{padding:0;border-right:none}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px;clip-path:none}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Start</a></div></nav>
<section class="hero"><div class="hero-diagonal"></div><div class="hero-diagonal2"></div><div class="hero-content"><div class="hero-chip"><span></span> Now Available</div><h1>{{HEADLINE_A}}<span class="acc">{{HEADLINE_B}}</span>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">See work →</button></div></div></section>
<div class="stats-band"><div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div></div>
<section class="features" id="features"><h2>What Makes Us <span class="acc">Different</span></h2><p class="features-sub">Built for the bold, designed for impact</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q><span>{{BRAND_NAME}}:</span> {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Ready to<span class="acc">Go Bold?</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:16px;padding:16px 52px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 31. HAUTE FASHION ─────────────────────────
  {
    name: 'Haute Fashion', emoji: '👗',
    keywords: ['fashion','luxury','editorial','haute couture','brand','style','chic'],
    examples: ['Luxury fashion house','High-end clothing brand','Fashion editorial magazine'],
    theme: { bg:'#000000', text:'#ffffff', sub:'rgba(255,255,255,0.45)', acc:'#cc0000', border:'1px solid rgba(255,255,255,0.1)', cardBg:'rgba(255,255,255,0.03)', headFont:"'Cormorant Garamond',serif", bodyFont:"'Cormorant Garamond',serif", headWeight:'300', headCase:'uppercase', radius:'0', btnBg:'transparent', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:'Cormorant Garamond',serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:28px 80px;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:14px;font-weight:300;letter-spacing:.4em;text-transform:uppercase;color:#fff}
.nav-links{display:flex;gap:48px}
.nav-links a{color:rgba(255,255,255,.3);text-decoration:none;font-size:10px;letter-spacing:.3em;text-transform:uppercase;font-weight:300;transition:color .2s}
.nav-links a:hover{color:#fff}
.hero{min-height:100vh;padding:140px 80px 80px;display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:end}
.hero-left{border-right:1px solid rgba(255,255,255,.08);padding-right:80px;padding-bottom:80px}
.hero-season{font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:rgba(255,255,255,.25);margin-bottom:36px}
h1{font-size:clamp(48px,7vw,100px);font-weight:300;line-height:1;letter-spacing:.06em;text-transform:uppercase;margin-bottom:40px;animation:fadeUp .9s ease forwards}
h1 em{color:#cc0000;font-style:italic;display:block;font-weight:300}
.sub{font-size:18px;font-weight:300;color:rgba(255,255,255,.4);line-height:1.9;max-width:360px;margin-bottom:52px;font-style:italic}
.btn{display:inline-block;padding:14px 48px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.3);font-family:'Cormorant Garamond',serif;font-size:11px;font-weight:300;letter-spacing:.35em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.btn:hover{border-color:#fff;background:rgba(255,255,255,.04)}
.btn-red{background:#cc0000;color:#fff;border-color:#cc0000;margin-left:12px}
.btn-red:hover{background:#aa0000;border-color:#aa0000}
.hero-right{padding-left:80px;padding-bottom:80px;display:flex;flex-direction:column;justify-content:flex-end;gap:40px}
.hero-pull{font-size:clamp(20px,2.5vw,32px);font-weight:300;color:rgba(255,255,255,.5);font-style:italic;line-height:1.5;border-left:2px solid #cc0000;padding-left:24px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08)}
.stat{padding:44px 80px;border-right:1px solid rgba(255,255,255,.06);text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:300;color:#cc0000;font-style:italic;line-height:1;letter-spacing:.02em}
.stat-l{font-size:10px;color:rgba(255,255,255,.25);letter-spacing:.3em;text-transform:uppercase;margin-top:10px}
.features{padding:100px 80px;border-bottom:1px solid rgba(255,255,255,.08)}
.features-head{text-align:center;margin-bottom:80px}
.features h2{font-size:clamp(28px,3.5vw,52px);font-weight:300;letter-spacing:.12em;text-transform:uppercase}
.features h2 em{color:#cc0000;font-style:italic}
.features-rule{width:60px;height:1px;background:#cc0000;margin:20px auto 0}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:48px 40px;border-right:1px solid rgba(255,255,255,.06);text-align:center;transition:background .2s}
.card:last-child{border-right:none}
.card:hover{background:rgba(204,0,0,.04)}
.card-ico{font-size:28px;display:block;margin-bottom:20px}
.card h3{font-size:18px;font-weight:300;letter-spacing:.2em;text-transform:uppercase;margin-bottom:16px;color:#fff}
.card p{font-size:16px;font-weight:300;color:rgba(255,255,255,.35);line-height:1.9;font-style:italic}
.quote{padding:100px 80px;text-align:center;border-bottom:1px solid rgba(255,255,255,.08)}
.quote q{font-size:clamp(20px,3vw,38px);font-weight:300;font-style:italic;color:rgba(255,255,255,.6);line-height:1.6;max-width:760px;display:inline-block;quotes:none}
.quote q strong{color:#cc0000;font-style:normal;font-weight:300;letter-spacing:.08em;text-transform:uppercase;font-size:.7em}
.cta-sec{padding:120px 80px;text-align:center}
.cta-sec h2{font-size:clamp(40px,6vw,80px);font-weight:300;letter-spacing:.1em;text-transform:uppercase;margin-bottom:20px;line-height:1}
.cta-sec h2 em{color:#cc0000;font-style:italic;display:block}
.cta-sec p{font-size:18px;font-weight:300;color:rgba(255,255,255,.35);font-style:italic;margin-bottom:48px}
footer{padding:32px 80px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:12px;font-weight:300;letter-spacing:.4em;text-transform:uppercase;color:#fff}
.f-copy{font-size:10px;color:rgba(255,255,255,.2);letter-spacing:.2em;text-transform:uppercase;font-weight:300}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:20px 28px}.hero{grid-template-columns:1fr;padding:120px 28px 60px}.hero-left{border-right:none;padding-right:0;padding-bottom:40px}.hero-right{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px;border-right:none;border-bottom:1px solid rgba(255,255,255,.06)}.features{padding:60px 28px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(255,255,255,.06)}.quote{padding:60px 28px}.cta-sec{padding:80px 28px}footer{flex-direction:column;gap:12px;padding:28px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Collection</a><a href="#about">Atelier</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-left"><div class="hero-season">Saison 2025 · Collection Privée</div><h1>{{HEADLINE_A}}<em>{{HEADLINE_B}}</em>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-right"><div class="hero-pull">{{HEADLINE_B}}</div><div style="font-size:11px;color:rgba(255,255,255,.2);letter-spacing:.2em;text-transform:uppercase">— {{BRAND_NAME}} House</div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="features-head"><h2>The <em>Craft</em></h2><div class="features-rule"></div></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} <strong>— {{BRAND_NAME}}</strong></q></section>
<section class="cta-sec" id="cta"><h2>Discover the<em>Collection</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 32. AUDIO WAVES ───────────────────────────
  {
    name: 'Audio Waves', emoji: '🎵',
    keywords: ['music','audio','podcast','sound','streaming','studio','beats'],
    examples: ['Music streaming platform','Podcast hosting service','Audio production studio'],
    theme: { bg:'#060610', text:'#f0f0ff', sub:'rgba(240,240,255,0.45)', acc:'#8b5cf6', border:'1px solid rgba(139,92,246,0.2)', cardBg:'rgba(139,92,246,0.06)', headFont:"'Rajdhani',sans-serif", bodyFont:"'Rajdhani',sans-serif", headWeight:'700', headCase:'uppercase', radius:'8px', btnBg:'#8b5cf6', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#060610;color:#f0f0ff;font-family:'Rajdhani',sans-serif;overflow-x:hidden}
.wave-bg{position:fixed;inset:0;background:repeating-linear-gradient(90deg,transparent 0,transparent 3px,rgba(139,92,246,.015) 3px,rgba(139,92,246,.015) 4px),repeating-linear-gradient(0deg,transparent 0,transparent 19px,rgba(139,92,246,.015) 19px,rgba(139,92,246,.015) 20px);pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 64px;background:rgba(6,6,16,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(139,92,246,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:22px;font-weight:700;color:#f0f0ff;letter-spacing:.08em;text-transform:uppercase}
.logo span{color:#8b5cf6}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(240,240,255,.4);text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:color .15s}
.nav-links a:hover{color:#8b5cf6}
.hero{min-height:100vh;padding:130px 64px 80px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1}
.waveform{display:flex;align-items:center;gap:3px;height:60px;margin-bottom:36px}
.waveform span{display:block;width:4px;border-radius:2px;background:#8b5cf6;animation:wave var(--d,.8s) ease-in-out infinite alternate}
.waveform span:nth-child(2n){background:#22c55e}
h1{font-size:clamp(48px,8vw,110px);font-weight:700;line-height:.95;letter-spacing:.02em;text-transform:uppercase;max-width:820px;margin-bottom:24px;animation:fadeUp .7s ease forwards}
h1 .acc{background:linear-gradient(90deg,#8b5cf6,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block}
.sub{font-size:18px;color:rgba(240,240,255,.45);line-height:1.7;max-width:480px;margin-bottom:48px;font-weight:400}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:14px 40px;background:#8b5cf6;color:#fff;border:none;border-radius:8px;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s;box-shadow:0 4px 24px rgba(139,92,246,.4)}
.btn:hover{background:#7c3aed;transform:translateY(-2px);box-shadow:0 8px 32px rgba(139,92,246,.5)}
.btn2{padding:14px 32px;background:transparent;color:#22c55e;border:1px solid #22c55e;border-radius:8px;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.btn2:hover{background:rgba(34,197,94,.08)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(139,92,246,.12);border-bottom:1px solid rgba(139,92,246,.12);position:relative;z-index:1}
.stat{padding:44px 64px;border-right:1px solid rgba(139,92,246,.08)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:700;letter-spacing:.02em;line-height:1}
.stat-n.pur{color:#8b5cf6;text-shadow:0 0 20px rgba(139,92,246,.4)}
.stat-n.grn{color:#22c55e;text-shadow:0 0 20px rgba(34,197,94,.4)}
.stat-l{font-size:12px;color:rgba(240,240,255,.35);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:100px 64px;position:relative;z-index:1}
.features h2{font-size:clamp(28px,4vw,52px);font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px}
.features h2 .pur{color:#8b5cf6}
.features h2 .grn{color:#22c55e}
.features-sub{font-size:16px;color:rgba(240,240,255,.4);margin-bottom:52px;text-transform:uppercase;letter-spacing:.08em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(139,92,246,.08)}
.card{background:#060610;padding:36px;transition:background .2s;border-top:2px solid transparent}
.card:hover{background:rgba(139,92,246,.05);border-top-color:#8b5cf6}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.card p{font-size:14px;color:rgba(240,240,255,.4);line-height:1.75}
.quote{padding:80px 64px;text-align:center;background:linear-gradient(180deg,rgba(139,92,246,.08),rgba(34,197,94,.04));border-top:1px solid rgba(139,92,246,.12);border-bottom:1px solid rgba(139,92,246,.12);position:relative;z-index:1}
.quote q{font-size:clamp(18px,2.5vw,28px);font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:rgba(240,240,255,.65);line-height:1.5;max-width:720px;display:inline-block;quotes:none}
.cta-sec{padding:100px 64px;text-align:center;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(36px,5.5vw,80px);font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:16px;line-height:.95}
.cta-sec h2 .pur{color:#8b5cf6}
.cta-sec p{font-size:16px;color:rgba(240,240,255,.4);margin-bottom:40px;letter-spacing:.06em;text-transform:uppercase}
footer{padding:28px 64px;border-top:1px solid rgba(139,92,246,.1);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#f0f0ff}
.f-logo span{color:#8b5cf6}
.f-copy{font-size:11px;color:rgba(240,240,255,.25);letter-spacing:.12em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes wave{0%{height:8px}100%{height:var(--h,40px)}}
@media(max-width:768px){nav{padding:16px 24px}.hero{padding:110px 24px 60px}.waveform{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(139,92,246,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<div class="wave-bg"></div>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Studio</a><a href="#about">Artists</a><a href="#cta">Start</a></div></nav>
<section class="hero">
<div class="waveform" aria-hidden="true">
${Array.from({length:40},(_,i)=>`<span style="--h:${Math.floor(Math.random()*50+10)}px;--d:${(Math.random()*.8+.4).toFixed(2)}s;animation-delay:${(i*.04).toFixed(2)}s"></span>`).join('')}
</div>
<h1>{{HEADLINE_A}}<span class="acc">{{HEADLINE_B}}</span>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">▶ Listen Now</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n pur">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n grn">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n pur">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2><span class="pur">Sound</span> <span class="grn">Tools</span></h2><p class="features-sub">Everything for audio creators</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Hit <span class="pur">Play</span> Now</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:16px;padding:16px 52px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 33. STARTUP RAINBOW ───────────────────────
  {
    name: 'Startup Rainbow', emoji: '🌈',
    keywords: ['startup','app','young','vibrant','consumer','product','fun'],
    examples: ['Consumer social app','Fun productivity tool','Youth-focused brand'],
    theme: { bg:'#ffffff', text:'#0f0f0f', sub:'rgba(15,15,15,0.5)', acc:'#7c3aed', border:'1px solid rgba(0,0,0,0.08)', cardBg:'#f8f8f8', headFont:"'Plus Jakarta Sans',sans-serif", bodyFont:"'Plus Jakarta Sans',sans-serif", headWeight:'800', headCase:'none', radius:'16px', btnBg:'#7c3aed', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#0f0f0f;font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 60px;height:64px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.07);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:800;background:linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-.02em}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(15,15,15,.5);text-decoration:none;font-size:14px;font-weight:600;transition:color .15s}
.nav-links a:hover{color:#7c3aed}
.hero{padding:140px 60px 80px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:800px;background:conic-gradient(from 0deg,rgba(239,68,68,.06),rgba(249,115,22,.06),rgba(234,179,8,.06),rgba(34,197,94,.06),rgba(59,130,246,.06),rgba(139,92,246,.06),rgba(239,68,68,.06));border-radius:50%;animation:spinSlow 20s linear infinite}
.hero-badge{display:inline-flex;align-items:center;gap:8px;border-radius:100px;padding:8px 20px;font-size:13px;font-weight:700;margin-bottom:28px;background:linear-gradient(90deg,rgba(239,68,68,.08),rgba(139,92,246,.08));border:1px solid rgba(139,92,246,.15);color:#7c3aed}
h1{font-size:clamp(40px,6.5vw,84px);font-weight:800;line-height:1.1;letter-spacing:-.04em;max-width:800px;margin:0 auto 20px;animation:fadeUp .7s ease forwards;position:relative}
.grad-text{background:linear-gradient(135deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{font-size:18px;color:rgba(15,15,15,.5);line-height:1.7;max-width:520px;margin:0 auto 44px;position:relative}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative}
.btn{padding:14px 36px;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#fff;border:none;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 6px 24px rgba(124,58,237,.3)}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(124,58,237,.4)}
.btn2{padding:14px 28px;background:#f8f8f8;color:#0f0f0f;border:1px solid rgba(0,0,0,.1);border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:rgba(124,58,237,.3)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:60px}
.stat{border-radius:20px;padding:32px;text-align:center;border:1px solid rgba(0,0,0,.06)}
.stat:nth-child(1){background:linear-gradient(135deg,rgba(239,68,68,.06),rgba(249,115,22,.06));border-color:rgba(239,68,68,.12)}
.stat:nth-child(2){background:linear-gradient(135deg,rgba(34,197,94,.06),rgba(59,130,246,.06));border-color:rgba(34,197,94,.12)}
.stat:nth-child(3){background:linear-gradient(135deg,rgba(139,92,246,.06),rgba(236,72,153,.06));border-color:rgba(139,92,246,.12)}
.stat-n{font-size:44px;font-weight:800;letter-spacing:-.04em;line-height:1;background:linear-gradient(135deg,#ef4444,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat:nth-child(2) .stat-n{background:linear-gradient(135deg,#22c55e,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat:nth-child(3) .stat-n{background:linear-gradient(135deg,#8b5cf6,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-l{font-size:13px;color:rgba(15,15,15,.45);font-weight:600;margin-top:8px}
.features{padding:60px;max-width:1200px;margin:0 auto}
.features h2{font-size:clamp(28px,4vw,52px);font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-.03em}
.features-sub{text-align:center;color:rgba(15,15,15,.45);font-size:16px;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{border-radius:20px;padding:32px;transition:all .25s;border:1px solid rgba(0,0,0,.06)}
.card:nth-child(1){background:linear-gradient(135deg,rgba(239,68,68,.05),rgba(249,115,22,.05))}
.card:nth-child(2){background:linear-gradient(135deg,rgba(34,197,94,.05),rgba(59,130,246,.05))}
.card:nth-child(3){background:linear-gradient(135deg,rgba(139,92,246,.05),rgba(236,72,153,.05))}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.08)}
.card-ico{font-size:32px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:800;margin-bottom:10px;letter-spacing:-.02em}
.card p{font-size:14px;color:rgba(15,15,15,.5);line-height:1.75}
.quote{padding:80px 60px;text-align:center;background:linear-gradient(135deg,rgba(139,92,246,.04),rgba(59,130,246,.04))}
.quote q{font-size:clamp(18px,2.5vw,28px);font-weight:700;color:#0f0f0f;line-height:1.6;max-width:660px;display:inline-block;quotes:none;letter-spacing:-.02em}
.cta-sec{padding:100px 60px;text-align:center}
.cta-sec h2{font-size:clamp(32px,5vw,68px);font-weight:800;letter-spacing:-.04em;margin-bottom:16px;line-height:1}
.cta-sec p{font-size:16px;color:rgba(15,15,15,.45);margin-bottom:40px}
footer{padding:32px 60px;border-top:1px solid rgba(0,0,0,.07);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:18px;font-weight:800;background:linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.f-copy{font-size:13px;color:rgba(15,15,15,.3)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes spinSlow{from{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(360deg)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:110px 24px 60px}.stats{grid-template-columns:1fr;padding:40px 24px;gap:16px}.features{padding:40px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Get started</a></div></nav>
<section class="hero"><div class="hero-badge">🌈 New · Made for everyone</div><h1>{{HEADLINE_A}} <span class="grad-text">{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">See how →</button></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2><span class="grad-text">{{HEADLINE_A}}</span> Features</h2><p class="features-sub">Everything you love, built different</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Join <span class="grad-text">{{BRAND_NAME}}</span> today</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">© {{BRAND_NAME}} 2025 · {{FOOTER_TAGLINE}}</div></footer>
</body></html>`,
  },

  // ── 34. SPACE AGE RETRO ───────────────────────
  {
    name: 'Space Age Retro', emoji: '🚀',
    keywords: ['space','sci-fi','retro','futurism','aerospace','tech','exploration'],
    examples: ['Space technology brand','Sci-fi entertainment company','Aerospace startup'],
    theme: { bg:'#0a0e27', text:'#e8f4ff', sub:'rgba(232,244,255,0.5)', acc:'#00d4ff', border:'1px solid rgba(0,212,255,0.2)', cardBg:'rgba(0,212,255,0.04)', headFont:"'Exo 2',sans-serif", bodyFont:"'Exo 2',sans-serif", headWeight:'700', headCase:'uppercase', radius:'0', btnBg:'transparent', btnText:'#00d4ff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0e27;color:#e8f4ff;font-family:'Exo 2',sans-serif;overflow-x:hidden}
.stars{position:fixed;inset:0;background-image:radial-gradient(1px 1px at 10% 15%,rgba(192,192,192,.8) 0%,transparent 100%),radial-gradient(1px 1px at 40% 70%,rgba(192,192,192,.6) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 75% 25%,rgba(192,192,192,.7) 0%,transparent 100%),radial-gradient(1px 1px at 20% 80%,rgba(192,192,192,.5) 0%,transparent 100%),radial-gradient(1px 1px at 90% 50%,rgba(192,192,192,.6) 0%,transparent 100%),radial-gradient(1px 1px at 55% 40%,rgba(192,192,192,.4) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 30% 55%,rgba(0,212,255,.5) 0%,transparent 100%);pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 64px;background:rgba(10,14,39,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,212,255,.12);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:18px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#00d4ff;text-shadow:0 0 20px rgba(0,212,255,.4)}
.nav-badge{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,212,255,.6);border:1px solid rgba(0,212,255,.2);padding:4px 12px}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(232,244,255,.4);text-decoration:none;font-size:12px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;transition:color .15s}
.nav-links a:hover{color:#00d4ff}
.hero{min-height:100vh;padding:130px 64px 80px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1}
.hero-coords{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,212,255,.4);margin-bottom:24px;display:flex;gap:24px}
h1{font-size:clamp(44px,7vw,100px);font-weight:800;line-height:.95;letter-spacing:.04em;text-transform:uppercase;max-width:820px;margin-bottom:28px;animation:fadeUp .8s ease forwards}
h1 .acc{color:#00d4ff;text-shadow:0 0 30px rgba(0,212,255,.5);display:block}
h1 .silver{color:#c0c0c0}
.sub{font-size:16px;color:rgba(232,244,255,.45);line-height:1.85;max-width:460px;margin-bottom:48px;font-weight:300}
.btn{display:inline-block;padding:13px 44px;background:transparent;color:#00d4ff;border:1px solid #00d4ff;font-family:'Exo 2',sans-serif;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .2s;text-shadow:0 0 10px rgba(0,212,255,.4)}
.btn:hover{background:rgba(0,212,255,.1);box-shadow:0 0 24px rgba(0,212,255,.3)}
.planet{position:absolute;right:100px;top:50%;transform:translateY(-50%);width:260px;height:260px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#1a2a6c,#0a0e27);box-shadow:0 0 60px rgba(0,212,255,.2),inset 0 0 40px rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.15);animation:rotatePlanet 30s linear infinite}
.planet::before{content:'';position:absolute;inset:-20px;border-radius:50%;border:1px solid rgba(192,192,192,.1);border-top:2px solid rgba(192,192,192,.3);transform:rotateX(75deg)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(0,212,255,.1);border-bottom:1px solid rgba(0,212,255,.1);position:relative;z-index:1}
.stat{padding:44px 64px;border-right:1px solid rgba(0,212,255,.07)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:800;color:#00d4ff;text-shadow:0 0 20px rgba(0,212,255,.5);line-height:1;letter-spacing:.04em}
.stat-l{font-size:10px;color:rgba(232,244,255,.3);letter-spacing:.25em;text-transform:uppercase;margin-top:8px}
.features{padding:100px 64px;position:relative;z-index:1}
.features h2{font-size:clamp(28px,4vw,52px);font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:52px;color:#e8f4ff}
.features h2 .acc{color:#00d4ff;text-shadow:0 0 20px rgba(0,212,255,.4)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(0,212,255,.06)}
.card{background:#0a0e27;padding:36px;transition:background .2s;border-top:1px solid transparent}
.card:hover{background:rgba(0,212,255,.04);border-top-color:#00d4ff}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;color:#c0c0c0}
.card p{font-size:13px;color:rgba(232,244,255,.35);line-height:1.85;font-weight:300}
.quote{padding:80px 64px;background:rgba(0,212,255,.04);border-top:1px solid rgba(0,212,255,.1);border-bottom:1px solid rgba(0,212,255,.1);position:relative;z-index:1}
.quote q{font-size:clamp(18px,2.5vw,28px);font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:rgba(232,244,255,.6);line-height:1.5;max-width:720px;display:block;quotes:none}
.quote q .acc{color:#00d4ff}
.cta-sec{padding:100px 64px;text-align:center;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(36px,5.5vw,80px);font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;line-height:.95}
.cta-sec h2 .acc{color:#00d4ff;text-shadow:0 0 30px rgba(0,212,255,.5);display:block}
.cta-sec p{font-size:15px;color:rgba(232,244,255,.35);margin-bottom:40px;letter-spacing:.1em;text-transform:uppercase}
footer{padding:28px 64px;border-top:1px solid rgba(0,212,255,.1);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:16px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#00d4ff}
.f-copy{font-size:10px;color:rgba(232,244,255,.2);letter-spacing:.15em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes rotatePlanet{from{transform:translateY(-50%) rotate(0deg)}to{transform:translateY(-50%) rotate(360deg)}}
@media(max-width:768px){nav{padding:16px 24px;flex-wrap:wrap;gap:8px}.planet{display:none}.hero{padding:120px 24px 60px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(0,212,255,.07)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<div class="stars"></div>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Mission</a><a href="#about">Crew</a><a href="#cta">Launch</a></div><span class="nav-badge">● System Active</span></nav>
<section class="hero"><div class="hero-coords"><span>LAT: 28.5°N</span><span>LON: 80.6°W</span><span>ALT: T-MINUS 0</span></div><h1>{{HEADLINE_A}}<span class="acc">{{HEADLINE_B}}</span><span class="silver">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}} →</button><div class="planet"></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Mission <span class="acc">Systems</span></h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} — <span class="acc">{{BRAND_NAME}}</span></q></section>
<section class="cta-sec" id="cta"><h2>Ready for<span class="acc">Launch?</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:13px;padding:15px 52px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025 · STARLOG 001</div></footer>
</body></html>`,
  },

  // ── 36. GEOMETRIC POP ─────────────────────────
  {
    name: 'Geometric Pop', emoji: '🔴',
    keywords: ['design','art','bold','modern','colorful','pop','creative'],
    examples: ['Design studio','Bold creative agency','Modern art brand'],
    theme: { bg:'#ffffff', text:'#0d0d0d', sub:'rgba(13,13,13,0.5)', acc:'#e63946', border:'1px solid #0d0d0d', cardBg:'#f5f5f5', headFont:"'Nunito',sans-serif", bodyFont:"'Nunito',sans-serif", headWeight:'900', headCase:'none', radius:'0', btnBg:'#e63946', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#0d0d0d;font-family:'Nunito',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0;height:60px;background:#fff;border-bottom:3px solid #0d0d0d;display:flex;align-items:stretch}
.logo{font-size:18px;font-weight:900;color:#fff;background:#e63946;padding:0 28px;display:flex;align-items:center;border-right:3px solid #0d0d0d}
.nav-links{display:flex;align-items:stretch;margin-left:auto}
.nav-links a{color:#0d0d0d;text-decoration:none;font-size:13px;font-weight:800;padding:0 24px;border-left:1px solid rgba(13,13,13,.1);display:flex;align-items:center;transition:background .15s}
.nav-links a:hover{background:#1565c0;color:#fff}
.hero{padding:120px 0 0;display:grid;grid-template-columns:1fr 1fr;border-bottom:3px solid #0d0d0d;min-height:90vh}
.hero-left{padding:60px 80px;border-right:3px solid #0d0d0d;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.hero-shapes{position:absolute;top:0;right:0;width:200px;height:200px}
.shape-red{position:absolute;top:0;right:0;width:120px;height:120px;background:#e63946;border-bottom-left-radius:120px}
.shape-blue{position:absolute;top:60px;right:60px;width:80px;height:80px;background:#1565c0;border-radius:50%}
.shape-yellow{position:absolute;top:20px;right:30px;width:50px;height:50px;background:#ffd600;transform:rotate(45deg)}
h1{font-size:clamp(44px,6vw,80px);font-weight:900;line-height:1.05;letter-spacing:-.02em;max-width:500px;margin-bottom:20px;animation:fadeUp .7s ease forwards;position:relative;z-index:1}
h1 .r{color:#e63946}
h1 .b{color:#1565c0}
.sub{font-size:17px;color:rgba(13,13,13,.5);line-height:1.7;max-width:380px;margin-bottom:40px;font-weight:600}
.btn{display:inline-block;padding:14px 44px;background:#e63946;color:#fff;border:3px solid #0d0d0d;font-family:'Nunito',sans-serif;font-size:14px;font-weight:900;cursor:pointer;transition:all .15s;box-shadow:4px 4px 0 #0d0d0d}
.btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #0d0d0d}
.hero-right{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.hero-tile{display:flex;align-items:center;justify-content:center;border-right:1px solid rgba(13,13,13,.1);border-bottom:1px solid rgba(13,13,13,.1);font-size:60px;transition:transform .2s}
.hero-tile:hover{transform:scale(1.05)}
.t1{background:#ffd600}
.t2{background:#1565c0}
.t3{background:#e63946}
.t4{background:#0d0d0d;font-size:40px;color:#fff;font-weight:900;font-family:'Nunito',sans-serif}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:3px solid #0d0d0d}
.stat{padding:40px 80px;border-right:3px solid #0d0d0d}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:900;color:#e63946;line-height:1}
.stat-l{font-size:12px;font-weight:800;color:rgba(13,13,13,.4);letter-spacing:.12em;text-transform:uppercase;margin-top:8px}
.features{padding:80px;border-bottom:3px solid #0d0d0d}
.feat-header{display:flex;align-items:center;gap:20px;margin-bottom:52px}
.feat-sq{width:28px;height:28px;background:#ffd600;border:3px solid #0d0d0d;flex-shrink:0}
.features h2{font-size:clamp(28px,4vw,52px);font-weight:900;line-height:1;letter-spacing:-.02em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:3px solid #0d0d0d}
.card{padding:36px;border-right:1px solid rgba(13,13,13,.15);transition:background .15s;position:relative}
.card:last-child{border-right:none}
.card:hover{background:#f5f5f5}
.card::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:#e63946}
.card:nth-child(2)::before{background:#1565c0}
.card:nth-child(3)::before{background:#ffd600}
.card-ico{font-size:28px;display:block;margin-bottom:16px}
.card h3{font-size:18px;font-weight:900;margin-bottom:10px}
.card p{font-size:14px;color:rgba(13,13,13,.5);line-height:1.7;font-weight:600}
.quote{padding:60px 80px;background:#0d0d0d;color:#fff;border-bottom:3px solid #e63946}
.quote q{font-size:clamp(20px,3vw,36px);font-weight:900;line-height:1.3;max-width:800px;display:block;quotes:none}
.quote q .acc{color:#ffd600}
.cta-sec{padding:80px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0d0d0d}
.cta-sec h2{font-size:clamp(40px,6vw,88px);font-weight:900;line-height:.95;letter-spacing:-.02em}
.cta-sec h2 span{display:block}
.cta-sec h2 .r{color:#e63946}
footer{padding:24px 80px;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:900;color:#0d0d0d}
.f-logo span{color:#e63946}
.f-copy{font-size:12px;color:rgba(13,13,13,.35);font-weight:700}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){.hero{grid-template-columns:1fr}.hero-right{display:none}.hero-left{padding:60px 24px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:3px solid #0d0d0d}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(13,13,13,.1)}.quote{padding:48px 24px}.cta-sec{flex-direction:column;gap:32px;align-items:flex-start;padding:60px 24px}footer{flex-direction:column;gap:8px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">About</a><a href="#cta">Start</a></div></nav>
<section class="hero"><div class="hero-left"><div class="hero-shapes"><div class="shape-red"></div><div class="shape-blue"></div><div class="shape-yellow"></div></div><h1>{{HEADLINE_A}} <span class="r">{{HEADLINE_B}}</span> <span class="b">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-right"><div class="hero-tile t1">🔴</div><div class="hero-tile t2">🔵</div><div class="hero-tile t3">🟡</div><div class="hero-tile t4">{{BRAND_NAME}}</div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-header"><div class="feat-sq"></div><h2>Bold Features</h2></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} <span class="acc">— {{BRAND_NAME}}</span></q></section>
<section class="cta-sec" id="cta"><h2>Get<span class="r">Started</span>Now.</h2><button class="btn" style="font-size:15px;padding:16px 56px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 37. Y2K NOSTALGIA ─────────────────────────
  {
    name: 'Y2K Nostalgia', emoji: '💿',
    keywords: ['y2k','2000s','retro','nostalgia','tech','internet','millennium'],
    examples: ['Y2K fashion brand','Nostalgia tech app','Early internet revival brand'],
    theme: { bg:'#c8d8e8', text:'#001133', sub:'rgba(0,17,51,0.55)', acc:'#00b4d8', border:'1px solid rgba(0,180,216,0.3)', cardBg:'rgba(255,255,255,0.6)', headFont:"'Orbitron',sans-serif", bodyFont:"'Orbitron',sans-serif", headWeight:'700', headCase:'uppercase', radius:'8px', btnBg:'#00b4d8', btnText:'#001133' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#c8d8e8;color:#001133;font-family:'Orbitron',sans-serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.3) 0%,transparent 50%,rgba(0,180,216,.1) 100%),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,180,216,.05) 39px,rgba(0,180,216,.05) 40px);pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 60px;background:linear-gradient(180deg,rgba(200,216,232,.98),rgba(190,210,228,.96));border-bottom:2px solid rgba(0,180,216,.4);box-shadow:0 2px 20px rgba(0,180,216,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:16px;font-weight:900;color:#001133;letter-spacing:.08em;text-shadow:1px 1px 2px rgba(255,255,255,.8)}
.logo span{color:#00b4d8;text-shadow:0 0 10px rgba(0,180,216,.5)}
.nav-links{display:flex;gap:24px}
.nav-links a{color:rgba(0,17,51,.5);text-decoration:none;font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;padding:6px 12px;border:1px solid rgba(0,180,216,.2);background:rgba(255,255,255,.3);transition:all .15s}
.nav-links a:hover{background:rgba(0,180,216,.15);border-color:#00b4d8;color:#001133}
.hero{padding:130px 60px 80px;position:relative;z-index:1}
.hero-browser{background:rgba(255,255,255,.5);border:2px solid rgba(0,180,216,.3);border-radius:8px;overflow:hidden;max-width:800px;backdrop-filter:blur(8px);box-shadow:0 8px 32px rgba(0,0,0,.1),inset 0 1px 0 rgba(255,255,255,.6)}
.browser-bar{background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(220,235,248,.7));padding:10px 16px;border-bottom:1px solid rgba(0,180,216,.2);display:flex;align-items:center;gap:8px}
.browser-dots{display:flex;gap:5px}
.dot{width:10px;height:10px;border-radius:50%}
.d1{background:#ff5f57}
.d2{background:#febc2e}
.d3{background:#28c840}
.address-bar{flex:1;background:rgba(255,255,255,.6);border:1px solid rgba(0,180,216,.2);border-radius:4px;padding:4px 10px;font-size:9px;color:rgba(0,17,51,.5);letter-spacing:.06em}
.browser-content{padding:40px 48px}
.hero-eyebrow{font-size:9px;letter-spacing:.25em;color:rgba(0,17,51,.4);margin-bottom:20px}
h1{font-size:clamp(28px,4.5vw,56px);font-weight:900;line-height:1.1;letter-spacing:.04em;text-transform:uppercase;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 .acc{color:#00b4d8;text-shadow:0 0 12px rgba(0,180,216,.4)}
.sub{font-size:11px;color:rgba(0,17,51,.5);line-height:2;margin-bottom:32px;letter-spacing:.04em}
.btn{padding:12px 36px;background:#00b4d8;color:#001133;border:2px solid rgba(0,17,51,.2);font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .15s;box-shadow:0 4px 12px rgba(0,180,216,.3),inset 0 1px 0 rgba(255,255,255,.4)}
.btn:hover{background:#0094b8;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,180,216,.4)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:60px;position:relative;z-index:1}
.stat{background:rgba(255,255,255,.5);border:1px solid rgba(0,180,216,.25);border-radius:8px;padding:32px;text-align:center;backdrop-filter:blur(4px);box-shadow:0 4px 16px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.6)}
.stat-n{font-size:36px;font-weight:900;color:#00b4d8;text-shadow:0 0 16px rgba(0,180,216,.4);line-height:1;letter-spacing:.04em}
.stat-l{font-size:8px;color:rgba(0,17,51,.45);letter-spacing:.2em;text-transform:uppercase;margin-top:10px}
.features{padding:60px;position:relative;z-index:1}
.features h2{font-size:clamp(18px,2.5vw,32px);font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px}
.features h2 .acc{color:#00b4d8}
.features-sub{font-size:9px;color:rgba(0,17,51,.4);letter-spacing:.2em;text-transform:uppercase;margin-bottom:44px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:rgba(255,255,255,.5);border:1px solid rgba(0,180,216,.2);border-radius:8px;padding:28px;transition:all .2s;backdrop-filter:blur(4px);box-shadow:0 2px 12px rgba(0,0,0,.05),inset 0 1px 0 rgba(255,255,255,.6)}
.card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,180,216,.15),inset 0 1px 0 rgba(255,255,255,.6)}
.card-ico{font-size:24px;display:block;margin-bottom:16px}
.card h3{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;color:#001133}
.card p{font-size:9px;color:rgba(0,17,51,.5);line-height:2;letter-spacing:.04em}
.quote{padding:60px;background:rgba(0,17,51,.85);color:#c8d8e8;border-top:2px solid #00b4d8;border-bottom:2px solid #00b4d8;position:relative;z-index:1}
.quote q{font-size:clamp(12px,1.8vw,20px);font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(200,216,232,.8);line-height:1.8;max-width:700px;display:block;quotes:none}
.quote q .acc{color:#00b4d8;text-shadow:0 0 12px rgba(0,180,216,.5)}
.cta-sec{padding:80px 60px;text-align:center;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(24px,4vw,48px);font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;line-height:1.1}
.cta-sec h2 .acc{color:#00b4d8;text-shadow:0 0 16px rgba(0,180,216,.4)}
.cta-sec p{font-size:10px;color:rgba(0,17,51,.45);margin-bottom:36px;letter-spacing:.15em;text-transform:uppercase}
footer{padding:24px 60px;background:rgba(0,17,51,.08);border-top:2px solid rgba(0,180,216,.2);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#001133}
.f-logo span{color:#00b4d8}
.f-copy{font-size:8px;color:rgba(0,17,51,.35);letter-spacing:.15em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:12px 24px}.hero{padding:110px 24px 60px}.stats{grid-template-columns:1fr;padding:40px 24px;gap:12px}.features{padding:40px 24px}.grid{grid-template-columns:1fr;gap:12px}.quote{padding:48px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:8px;padding:20px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.exe</span></div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Enter</a></div></nav>
<section class="hero"><div class="hero-browser"><div class="browser-bar"><div class="browser-dots"><div class="dot d1"></div><div class="dot d2"></div><div class="dot d3"></div></div><div class="address-bar">https://www.{{BRAND_NAME}}.com</div></div><div class="browser-content"><div class="hero-eyebrow">Welcome to the Future · Year 2025</div><h1>{{HEADLINE_A}} <span class="acc">{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}} ▶</button></div></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2>Core <span class="acc">Functions</span></h2><p class="features-sub">System capabilities v2.0</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} — <span class="acc">{{BRAND_NAME}}</span></q></section>
<section class="cta-sec" id="cta"><h2>Boot Up <span class="acc">{{BRAND_NAME}}</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.exe</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025 · v2.0.0</div></footer>
</body></html>`,
  },

  // ── 38. SPLIT SCREEN ──────────────────────────
  {
    name: 'Split Screen', emoji: '◑',
    keywords: ['bold','contrast','agency','design','portfolio','modern','dual'],
    examples: ['Creative agency','Product launch','Dual-mode platform'],
    theme: { bg:'#111111', text:'#ffffff', sub:'rgba(255,255,255,0.5)', acc:'#ffffff', border:'1px solid rgba(255,255,255,0.12)', cardBg:'rgba(255,255,255,0.04)', headFont:"'Inter',sans-serif", bodyFont:"'Inter',sans-serif", headWeight:'800', headCase:'none', radius:'0', btnBg:'#ffffff', btnText:'#111111' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#111;color:#fff;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;height:60px;display:flex;align-items:stretch}
.logo{background:#111;color:#fff;font-size:17px;font-weight:800;padding:0 40px;display:flex;align-items:center;border-right:1px solid rgba(255,255,255,.1);letter-spacing:-.02em;width:50%}
.nav-links{display:flex;align-items:stretch;background:#fff;width:50%}
.nav-links a{color:rgba(17,17,17,.5);text-decoration:none;font-size:13px;font-weight:600;padding:0 28px;border-left:1px solid rgba(17,17,17,.08);display:flex;align-items:center;transition:background .15s}
.nav-links a:hover{background:rgba(17,17,17,.05);color:#111}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
.hero-dark{background:#111;padding:130px 60px 80px;display:flex;flex-direction:column;justify-content:center}
.hero-light{background:#fff;padding:130px 60px 80px;display:flex;flex-direction:column;justify-content:center;border-left:2px solid #111}
.hero-tag-dark{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:24px}
.hero-tag-light{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(17,17,17,.3);margin-bottom:24px}
h1{font-size:clamp(44px,5.5vw,76px);font-weight:900;line-height:1;letter-spacing:-.04em;margin-bottom:20px;animation:fadeUp .7s ease forwards}
.h1-dark{color:#fff}
.h1-light{color:#111}
.h1-dark .acc{color:rgba(255,255,255,.3)}
.h1-light .acc{color:rgba(17,17,17,.25)}
.sub-dark{font-size:16px;color:rgba(255,255,255,.4);line-height:1.75;margin-bottom:40px;font-weight:400}
.sub-light{font-size:16px;color:rgba(17,17,17,.45);line-height:1.75;margin-bottom:40px;font-weight:400}
.btn-dark{padding:13px 36px;background:#fff;color:#111;border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .2s}
.btn-dark:hover{background:rgba(255,255,255,.85)}
.btn-light{padding:13px 36px;background:#111;color:#fff;border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:all .2s}
.btn-light:hover{background:rgba(17,17,17,.8)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.stat-dark{background:#111;padding:44px 60px;border-right:1px solid rgba(255,255,255,.06);border-top:2px solid rgba(255,255,255,.06)}
.stat-light{background:#fff;padding:44px 60px;border-right:1px solid rgba(17,17,17,.06);border-top:2px solid rgba(17,17,17,.08)}
.stat-dark:nth-child(1),.stat-dark:nth-child(2){display:block}
.stat-dark .stat-n{font-size:48px;font-weight:900;color:#fff;letter-spacing:-.04em;line-height:1}
.stat-light .stat-n{font-size:48px;font-weight:900;color:#111;letter-spacing:-.04em;line-height:1}
.stat-dark .stat-l{font-size:11px;color:rgba(255,255,255,.3);font-weight:600;margin-top:8px;letter-spacing:.08em}
.stat-light .stat-l{font-size:11px;color:rgba(17,17,17,.35);font-weight:600;margin-top:8px;letter-spacing:.08em}
.features{display:grid;grid-template-columns:1fr 1fr}
.feat-dark{background:#111;padding:80px 60px;border-top:2px solid rgba(255,255,255,.06)}
.feat-light{background:#fff;padding:80px 60px;border-top:2px solid rgba(17,17,17,.08);border-left:2px solid #111}
.feat-dark h2{font-size:clamp(28px,3.5vw,44px);font-weight:900;color:#fff;margin-bottom:40px;letter-spacing:-.03em}
.feat-light h2{font-size:clamp(28px,3.5vw,44px);font-weight:900;color:#111;margin-bottom:40px;letter-spacing:-.03em}
.card{padding:0 0 28px;border-bottom:1px solid;margin-bottom:28px}
.card:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.card-dark{border-color:rgba(255,255,255,.08)}
.card-light{border-color:rgba(17,17,17,.08)}
.card-ico{font-size:22px;display:block;margin-bottom:12px}
.card h3{font-size:16px;font-weight:700;margin-bottom:8px;letter-spacing:-.01em}
.card-dark h3{color:#fff}
.card-light h3{color:#111}
.card p{font-size:13px;line-height:1.7}
.card-dark p{color:rgba(255,255,255,.4)}
.card-light p{color:rgba(17,17,17,.45)}
.quote{background:#111;border-top:2px solid rgba(255,255,255,.06);padding:80px 60px;display:flex;align-items:center;gap:0}
.quote-left{width:50%;padding-right:60px;border-right:1px solid rgba(255,255,255,.08)}
.quote-right{width:50%;padding-left:60px;background:#fff;color:#111;margin:-80px 0;padding-top:80px;padding-bottom:80px}
.quote q{font-size:clamp(18px,2.5vw,28px);font-weight:700;line-height:1.5;quotes:none;display:block;letter-spacing:-.02em}
.q-dark{color:rgba(255,255,255,.65)}
.q-light{color:rgba(17,17,17,.65)}
.cta-row{display:grid;grid-template-columns:1fr 1fr}
.cta-dark{background:#111;padding:80px 60px;border-top:2px solid rgba(255,255,255,.06);text-align:center}
.cta-light{background:#fff;padding:80px 60px;border-top:2px solid rgba(17,17,17,.08);border-left:2px solid #111;text-align:center}
.cta-dark h2{font-size:clamp(32px,4.5vw,60px);font-weight:900;color:#fff;margin-bottom:32px;letter-spacing:-.04em;line-height:1}
.cta-light h2{font-size:clamp(32px,4.5vw,60px);font-weight:900;color:#111;margin-bottom:32px;letter-spacing:-.04em;line-height:1}
footer{display:grid;grid-template-columns:1fr 1fr}
.f-dark{background:#111;padding:24px 60px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center}
.f-light{background:#fff;padding:24px 60px;border-top:1px solid rgba(17,17,17,.08);border-left:2px solid #111;display:flex;justify-content:space-between;align-items:center}
.f-dark .f-logo{font-size:14px;font-weight:800;color:#fff}
.f-light .f-logo{font-size:14px;font-weight:800;color:#111}
.f-copy{font-size:11px}
.f-dark .f-copy{color:rgba(255,255,255,.25)}
.f-light .f-copy{color:rgba(17,17,17,.3)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{flex-direction:column;height:auto}.logo{width:100%;border-right:none;border-bottom:1px solid rgba(255,255,255,.1)}.nav-links{width:100%}.nav-links a{flex:1;justify-content:center;padding:10px}.hero{grid-template-columns:1fr}.hero-dark{padding:110px 24px 60px}.hero-light{border-left:none;border-top:2px solid #111;padding:60px 24px}.stats{grid-template-columns:1fr}.stat-dark,.stat-light{border-right:none}.features{grid-template-columns:1fr}.feat-light{border-left:none;border-top:2px solid #111}.quote{flex-direction:column}.quote-left,.quote-right{width:100%;padding:40px 24px;border:none;margin:0}.quote-right{border-top:2px solid #111}.cta-row{grid-template-columns:1fr}.cta-light{border-left:none;border-top:2px solid #111}.footer{grid-template-columns:1fr}.f-light{border-left:none;border-top:1px solid rgba(17,17,17,.08)}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Start</a></div></nav>
<section class="hero">
<div class="hero-dark"><div class="hero-tag-dark">Dark Side · {{BRAND_NAME}}</div><h1 class="h1-dark">{{HEADLINE_A}}<br><span class="acc">{{HEADLINE_B}}</span></h1><p class="sub-dark">{{SUBHEADLINE}}</p><button class="btn-dark">{{CTA_TEXT}}</button></div>
<div class="hero-light"><div class="hero-tag-light">Light Side · {{BRAND_NAME}}</div><h1 class="h1-light">{{HEADLINE_C}}<br><span class="acc">{{HEADLINE_A}}</span></h1><p class="sub-light">{{SUBHEADLINE}}</p><button class="btn-light">{{CTA_TEXT}}</button></div>
</section>
<div class="stats">
<div class="stat-dark"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div>
<div class="stat-dark" style="border-right:2px solid #fff"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div>
<div class="stat-light"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div>
</div>
<section class="features" id="features">
<div class="feat-dark"><h2>Dark Features</h2><div class="card card-dark"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card card-dark"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div></div>
<div class="feat-light"><h2>Light Features</h2><div class="card card-light"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div><div class="card card-light"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div></div>
</section>
<div class="quote"><div class="quote-left"><q class="q-dark">{{QUOTE}}</q></div><div class="quote-right"><q class="q-light">{{QUOTE}}</q></div></div>
<div class="cta-row"><div class="cta-dark"><h2>{{HEADLINE_A}}</h2><button class="btn-dark">{{CTA_TEXT}}</button></div><div class="cta-light"><h2>{{HEADLINE_B}}</h2><button class="btn-light">{{CTA_TEXT}}</button></div></div>
<div class="footer"><div class="f-dark"><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}}</div></div><div class="f-light"><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">© {{BRAND_NAME}} 2025</div></div></div>
</body></html>`,
  },

  // ── 39. CYBER PINK ────────────────────────────
  {
    name: 'Cyber Pink', emoji: '💗',
    keywords: ['cyber','pink','bold','fashion','tech','future','feminine'],
    examples: ['Bold fashion tech brand','Cyber beauty brand','Futuristic lifestyle app'],
    theme: { bg:'#0d0010', text:'#ffffff', sub:'rgba(255,255,255,0.5)', acc:'#ff0080', border:'1px solid rgba(255,0,128,0.25)', cardBg:'rgba(255,0,128,0.06)', headFont:"'Barlow Condensed',sans-serif", bodyFont:"'Barlow Condensed',sans-serif", headWeight:'800', headCase:'uppercase', radius:'0', btnBg:'#ff0080', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d0010;color:#fff;font-family:'Barlow Condensed',sans-serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,0,128,.12) 0%,transparent 60%);pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 64px;background:rgba(13,0,16,.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,0,128,.2);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:24px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#fff}
.logo span{color:#ff0080;text-shadow:0 0 20px rgba(255,0,128,.6)}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(255,255,255,.4);text-decoration:none;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;transition:color .15s}
.nav-links a:hover{color:#ff0080}
.hero{min-height:100vh;padding:120px 64px 60px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1;overflow:hidden}
.pink-glow{position:absolute;top:20%;right:15%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,0,128,.15),transparent 70%);filter:blur(40px);pointer-events:none}
.hero-tag{font-size:12px;font-weight:800;letter-spacing:.25em;text-transform:uppercase;color:#ff0080;margin-bottom:20px;display:flex;align-items:center;gap:12px}
.hero-tag::before{content:'';width:32px;height:2px;background:#ff0080;box-shadow:0 0 10px #ff0080}
h1{font-size:clamp(60px,10vw,140px);font-weight:900;line-height:.9;text-transform:uppercase;letter-spacing:-.01em;max-width:800px;margin-bottom:24px;animation:fadeUp .7s ease forwards}
h1 .pink{color:#ff0080;text-shadow:0 0 40px rgba(255,0,128,.6);display:block}
h1 .outline{-webkit-text-stroke:2px #fff;color:transparent;display:block}
.sub{font-size:20px;color:rgba(255,255,255,.45);line-height:1.6;max-width:460px;margin-bottom:48px;font-weight:400;letter-spacing:.02em}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:14px 44px;background:#ff0080;color:#fff;border:none;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:all .2s;box-shadow:0 0 30px rgba(255,0,128,.4)}
.btn:hover{box-shadow:0 0 50px rgba(255,0,128,.7);transform:translateY(-2px)}
.btn2{padding:14px 36px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.2);font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#ff0080;color:#ff0080}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(255,0,128,.15);border-bottom:1px solid rgba(255,0,128,.15);position:relative;z-index:1}
.stat{padding:44px 64px;border-right:1px solid rgba(255,0,128,.1)}
.stat:last-child{border-right:none}
.stat-n{font-size:56px;font-weight:900;line-height:1;letter-spacing:-.02em;text-transform:uppercase}
.stat-n.p{color:#ff0080;text-shadow:0 0 20px rgba(255,0,128,.5)}
.stat-n.w{color:#fff}
.stat-l{font-size:12px;color:rgba(255,255,255,.3);letter-spacing:.2em;text-transform:uppercase;margin-top:8px;font-weight:600}
.features{padding:100px 64px;position:relative;z-index:1}
.features h2{font-size:clamp(36px,5vw,72px);font-weight:900;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:52px}
.features h2 .pink{color:#ff0080;text-shadow:0 0 20px rgba(255,0,128,.5)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(255,0,128,.08)}
.card{background:#0d0010;padding:40px 32px;transition:all .2s;border-top:2px solid transparent}
.card:hover{background:rgba(255,0,128,.06);border-top-color:#ff0080}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.card p{font-size:15px;color:rgba(255,255,255,.4);line-height:1.7;font-weight:400}
.quote{padding:80px 64px;background:linear-gradient(135deg,rgba(255,0,128,.1),rgba(255,0,128,.04));border-top:1px solid rgba(255,0,128,.15);border-bottom:1px solid rgba(255,0,128,.15);position:relative;z-index:1;text-align:center}
.quote q{font-size:clamp(20px,3vw,36px);font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:rgba(255,255,255,.7);line-height:1.4;max-width:720px;display:inline-block;quotes:none}
.quote q .pink{color:#ff0080;text-shadow:0 0 16px rgba(255,0,128,.5)}
.cta-sec{padding:100px 64px;text-align:center;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(48px,8vw,110px);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.9;margin-bottom:32px}
.cta-sec h2 .pink{color:#ff0080;text-shadow:0 0 40px rgba(255,0,128,.6);display:block}
footer{padding:28px 64px;border-top:1px solid rgba(255,0,128,.12);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:#fff}
.f-logo span{color:#ff0080}
.f-copy{font-size:11px;color:rgba(255,255,255,.25);letter-spacing:.15em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:16px 24px}.hero{padding:110px 24px 60px}.pink-glow{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(255,0,128,.1)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Enter</a></div></nav>
<section class="hero"><div class="pink-glow"></div><div class="hero-tag">Cyber Future · {{BRAND_NAME}}</div><h1><span class="pink">{{HEADLINE_A}}</span><span class="outline">{{HEADLINE_B}}</span>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Explore →</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n p">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n w">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n p">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2><span class="pink">Cyber</span> Features</h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} — <span class="pink">{{BRAND_NAME}}</span></q></section>
<section class="cta-sec" id="cta"><h2>Enter the<span class="pink">Future.</span></h2><button class="btn" style="font-size:18px;padding:16px 64px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 40. LEGAL AUTHORITY ───────────────────────
  {
    name: 'Legal Authority', emoji: '⚖️',
    keywords: ['law','legal','attorney','firm','professional','authority','justice'],
    examples: ['Law firm website','Legal services brand','Corporate attorney practice'],
    theme: { bg:'#0f1c2e', text:'#f5f0e8', sub:'rgba(245,240,232,0.5)', acc:'#c9a84c', border:'1px solid rgba(201,168,76,0.2)', cardBg:'rgba(201,168,76,0.04)', headFont:"'Libre Baskerville',serif", bodyFont:"'Libre Baskerville',serif", headWeight:'700', headCase:'none', radius:'0', btnBg:'transparent', btnText:'#c9a84c' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f1c2e;color:#f5f0e8;font-family:'Libre Baskerville',serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(201,168,76,.05) 0%,transparent 50%);pointer-events:none}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 80px;height:64px;background:rgba(15,28,46,.96);backdrop-filter:blur(8px);border-bottom:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:15px;font-weight:700;color:#f5f0e8;letter-spacing:.2em;text-transform:uppercase}
.logo em{color:#c9a84c;font-style:italic}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(245,240,232,.4);text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:400;transition:color .2s}
.nav-links a:hover{color:#c9a84c}
.hero{min-height:100vh;padding:140px 80px 80px;display:grid;grid-template-columns:1.1fr 1fr;gap:80px;align-items:center}
.hero-emblem{text-align:center;font-size:80px;opacity:.08;line-height:1;margin-bottom:24px;display:block}
.hero-divider{width:60px;height:1px;background:#c9a84c;margin-bottom:28px}
.hero-eyebrow{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:rgba(245,240,232,.35);margin-bottom:20px;font-style:italic}
h1{font-size:clamp(36px,4.5vw,68px);font-weight:700;line-height:1.1;max-width:560px;margin-bottom:24px;animation:fadeUp .8s ease forwards}
h1 em{color:#c9a84c;font-style:italic;display:block}
.sub{font-size:16px;color:rgba(245,240,232,.45);line-height:1.95;max-width:420px;margin-bottom:48px;font-style:italic;font-weight:400}
.btn{display:inline-block;padding:13px 48px;background:transparent;color:#c9a84c;border:1px solid #c9a84c;font-family:'Libre Baskerville',serif;font-size:11px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.btn:hover{background:#c9a84c;color:#0f1c2e}
.hero-right{border-left:1px solid rgba(201,168,76,.15);padding-left:80px;display:flex;flex-direction:column;gap:32px}
.practice-area{border-bottom:1px solid rgba(201,168,76,.1);padding-bottom:24px}
.practice-area:last-child{border-bottom:none;padding-bottom:0}
.pa-num{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#c9a84c;margin-bottom:8px;font-style:italic}
.pa-title{font-size:18px;font-weight:700;color:#f5f0e8;margin-bottom:6px}
.pa-desc{font-size:13px;color:rgba(245,240,232,.35);line-height:1.7;font-style:italic}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(201,168,76,.15);border-bottom:1px solid rgba(201,168,76,.15)}
.stat{padding:48px 80px;border-right:1px solid rgba(201,168,76,.1)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:700;color:#c9a84c;font-style:italic;line-height:1}
.stat-l{font-size:11px;color:rgba(245,240,232,.3);letter-spacing:.2em;text-transform:uppercase;margin-top:10px}
.features{padding:100px 80px;border-bottom:1px solid rgba(201,168,76,.12)}
.feat-header{display:flex;align-items:baseline;gap:28px;border-bottom:1px solid rgba(201,168,76,.12);padding-bottom:28px;margin-bottom:56px}
.features h2{font-size:clamp(28px,3.5vw,48px);font-weight:700}
.features h2 em{color:#c9a84c;font-style:italic}
.feat-rule{flex:1;height:1px;background:rgba(201,168,76,.15)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:40px;border-right:1px solid rgba(201,168,76,.1);transition:background .2s}
.card:last-child{border-right:none}
.card:hover{background:rgba(201,168,76,.04)}
.card-ico{font-size:24px;display:block;margin-bottom:20px}
.card h3{font-size:18px;font-weight:700;margin-bottom:12px;color:#f5f0e8}
.card p{font-size:13px;color:rgba(245,240,232,.4);line-height:1.9;font-style:italic}
.quote{padding:80px;border-bottom:1px solid rgba(201,168,76,.12)}
.quote-mark{font-size:80px;color:rgba(201,168,76,.15);line-height:1;margin-bottom:16px;font-style:normal}
.quote q{font-size:clamp(18px,2.5vw,28px);font-style:italic;font-weight:400;color:rgba(245,240,232,.6);line-height:1.7;max-width:700px;display:block;quotes:none}
.quote q strong{color:#c9a84c;font-weight:700;font-style:normal}
.cta-sec{padding:100px 80px;text-align:center}
.cta-sec h2{font-size:clamp(32px,4.5vw,64px);font-weight:700;margin-bottom:20px;line-height:1.1}
.cta-sec h2 em{color:#c9a84c;font-style:italic;display:block}
.cta-sec p{font-size:16px;color:rgba(245,240,232,.35);font-style:italic;margin-bottom:44px}
footer{padding:32px 80px;border-top:1px solid rgba(201,168,76,.15);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:12px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:#f5f0e8}
.f-logo em{color:#c9a84c;font-style:italic}
.f-copy{font-size:10px;color:rgba(245,240,232,.2);letter-spacing:.15em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:18px 24px}.hero{grid-template-columns:1fr;padding:120px 24px 60px;gap:40px}.hero-right{border-left:none;padding-left:0;border-top:1px solid rgba(201,168,76,.12);padding-top:40px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(201,168,76,.1)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(201,168,76,.08)}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:12px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}} <em>&</em> Associates</div><div class="nav-links"><a href="#features">Practice</a><a href="#about">Attorneys</a><a href="#cta">Consult</a></div></nav>
<section class="hero"><div><span class="hero-emblem">⚖</span><div class="hero-divider"></div><div class="hero-eyebrow">Trusted Legal Counsel Since 1985</div><h1>{{HEADLINE_A}}<em>{{HEADLINE_B}}</em>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-right"><div class="practice-area"><div class="pa-num">01 · Practice Area</div><div class="pa-title">{{FEAT_1_TITLE}}</div><div class="pa-desc">{{FEAT_1_DESC}}</div></div><div class="practice-area"><div class="pa-num">02 · Practice Area</div><div class="pa-title">{{FEAT_2_TITLE}}</div><div class="pa-desc">{{FEAT_2_DESC}}</div></div><div class="practice-area"><div class="pa-num">03 · Practice Area</div><div class="pa-title">{{FEAT_3_TITLE}}</div><div class="pa-desc">{{FEAT_3_DESC}}</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-header"><h2>Areas of <em>Practice</em></h2><div class="feat-rule"></div></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><div class="quote-mark">❝</div><q>{{QUOTE}} <strong>— {{BRAND_NAME}}</strong></q></section>
<section class="cta-sec" id="cta"><h2>Schedule a<em>Consultation</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}} <em>&</em> Associates</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025 · All Rights Reserved</div></footer>
</body></html>`,
  },

  // ── 35. BIG TYPOGRAPHY ────────────────────────
  {
    name: 'Big Typography', emoji: '🔤',
    keywords: ['typography','design','bold','statement','brand','agency','minimalist'],
    examples: ['Type design studio','Bold brand identity','Statement design agency'],
    theme: { bg:'#ffffff', text:'#1a1a2e', sub:'rgba(26,26,46,0.45)', acc:'#1a1a2e', border:'1px solid rgba(26,26,46,0.1)', cardBg:'#f5f5f7', headFont:"'Bebas Neue',cursive", bodyFont:"'Helvetica Neue',Helvetica,Arial,sans-serif", headWeight:'400', headCase:'uppercase', radius:'0', btnBg:'#1a1a2e', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#1a1a2e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 60px;height:56px;background:#fff;border-bottom:1px solid rgba(26,26,46,.08);display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Bebas Neue',cursive;font-size:20px;letter-spacing:.06em;color:#1a1a2e}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(26,26,46,.4);text-decoration:none;font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;transition:color .15s}
.nav-links a:hover{color:#1a1a2e}
.hero{padding:100px 60px 60px;border-bottom:1px solid rgba(26,26,46,.08);overflow:hidden}
.hero-small{font-size:11px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:rgba(26,26,46,.35);margin-bottom:20px}
.type-block{overflow:hidden}
.type-line{font-family:'Bebas Neue',cursive;font-size:clamp(80px,16vw,240px);line-height:.88;letter-spacing:-.01em;display:block;animation:slideIn .7s ease forwards;opacity:0;transform:translateY(100%)}
.type-line:nth-child(1){animation-delay:0s}
.type-line:nth-child(2){animation-delay:.1s;color:rgba(26,26,46,.12)}
.type-line:nth-child(3){animation-delay:.2s}
.hero-bottom{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:48px;padding-top:48px;border-top:1px solid rgba(26,26,46,.08)}
.sub{font-size:16px;color:rgba(26,26,46,.45);line-height:1.8;max-width:400px}
.hero-right{display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;gap:24px}
.btn{padding:13px 40px;background:#1a1a2e;color:#fff;border:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:background .15s}
.btn:hover{background:#2d2d4a}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid rgba(26,26,46,.08)}
.stat{padding:40px 60px;border-right:1px solid rgba(26,26,46,.07)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Bebas Neue',cursive;font-size:60px;color:#1a1a2e;line-height:1}
.stat-l{font-size:10px;color:rgba(26,26,46,.35);letter-spacing:.2em;text-transform:uppercase;margin-top:6px}
.features{padding:80px 60px;border-bottom:1px solid rgba(26,26,46,.08)}
.features h2{font-family:'Bebas Neue',cursive;font-size:clamp(40px,6vw,88px);margin-bottom:56px;line-height:.95;letter-spacing:.01em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:40px;border-right:1px solid rgba(26,26,46,.08);transition:background .15s}
.card:last-child{border-right:none}
.card:hover{background:#f5f5f7}
.card-ico{font-size:24px;display:block;margin-bottom:18px}
.card h3{font-family:'Bebas Neue',cursive;font-size:28px;letter-spacing:.04em;margin-bottom:10px;line-height:1}
.card p{font-size:13px;color:rgba(26,26,46,.45);line-height:1.8}
.quote{padding:80px 60px;background:#1a1a2e;border-bottom:1px solid rgba(26,26,46,.08)}
.quote q{font-family:'Bebas Neue',cursive;font-size:clamp(40px,6vw,88px);color:#fff;line-height:.95;max-width:900px;display:block;quotes:none;letter-spacing:.01em}
.cta-sec{padding:80px 60px;border-bottom:1px solid rgba(26,26,46,.08);display:flex;justify-content:space-between;align-items:center}
.cta-sec h2{font-family:'Bebas Neue',cursive;font-size:clamp(60px,10vw,140px);line-height:.9;letter-spacing:-.01em}
footer{padding:24px 60px;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Bebas Neue',cursive;font-size:18px;letter-spacing:.06em;color:#1a1a2e}
.f-copy{font-size:10px;color:rgba(26,26,46,.3);letter-spacing:.15em;text-transform:uppercase}
@keyframes slideIn{0%{opacity:0;transform:translateY(100%)}100%{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:90px 24px 40px}.type-line{font-size:clamp(60px,15vw,100px)}.hero-bottom{grid-template-columns:1fr}.hero-right{align-items:flex-start}.stats{grid-template-columns:1fr}.stat{padding:24px;border-right:none;border-bottom:1px solid rgba(26,26,46,.07)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(26,26,46,.07)}.quote{padding:60px 24px}.cta-sec{flex-direction:column;gap:32px;align-items:flex-start;padding:60px 24px}footer{flex-direction:column;gap:8px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Work</a><a href="#about">Studio</a><a href="#cta">Contact</a></div></nav>
<section class="hero"><div class="hero-small">{{BRAND_NAME}} · Est. 2025</div><div class="type-block"><span class="type-line">{{HEADLINE_A}}</span><span class="type-line">{{HEADLINE_B}}</span><span class="type-line">{{HEADLINE_C}}</span></div><div class="hero-bottom"><p class="sub">{{SUBHEADLINE}}</p><div class="hero-right"><button class="btn">{{CTA_TEXT}}</button></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>What We Do</h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Let's Work.</h2><button class="btn" style="font-size:13px;padding:14px 48px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 41. GRADIENT HERO ─────────────────────────
  {
    name: 'Gradient Hero', emoji: '🌅',
    keywords: ['modern','colorful','saas','app','gradient','vibrant','tech'],
    examples: ['Creative platform launch','Colorful SaaS product','Modern app landing page'],
    theme: { bg:'#ffffff', text:'#0f0f0f', sub:'rgba(15,15,15,0.5)', acc:'#6366f1', border:'1px solid rgba(0,0,0,0.08)', cardBg:'#f8f8ff', headFont:"'Inter',sans-serif", bodyFont:"'Inter',sans-serif", headWeight:'800', headCase:'none', radius:'16px', btnBg:'#6366f1', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#0f0f0f;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 60px;height:64px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.07);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:18px;font-weight:800;letter-spacing:-.02em}
.logo-grad{background:linear-gradient(90deg,#6366f1,#ec4899,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(15,15,15,.5);text-decoration:none;font-size:14px;font-weight:500;transition:color .15s}
.nav-links a:hover{color:#6366f1}
.hero{padding:110px 60px 0;text-align:center;position:relative;overflow:hidden}
.hero-gradient{position:absolute;top:0;left:0;right:0;height:600px;background:linear-gradient(160deg,rgba(99,102,241,.12) 0%,rgba(236,72,153,.08) 40%,rgba(245,158,11,.06) 70%,transparent 100%);z-index:0}
.hero-inner{position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(236,72,153,.08));border:1px solid rgba(99,102,241,.2);border-radius:100px;padding:7px 18px;font-size:13px;font-weight:600;color:#6366f1;margin-bottom:28px}
h1{font-size:clamp(44px,7vw,88px);font-weight:900;line-height:1.05;letter-spacing:-.04em;max-width:820px;margin:0 auto 20px;animation:fadeUp .7s ease forwards}
.h1-grad{background:linear-gradient(135deg,#6366f1,#ec4899,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{font-size:18px;color:rgba(15,15,15,.5);line-height:1.7;max-width:520px;margin:0 auto 44px}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:60px}
.btn{padding:14px 36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:100px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 6px 24px rgba(99,102,241,.3)}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(99,102,241,.4)}
.btn2{padding:14px 28px;background:#fff;color:#0f0f0f;border:1px solid rgba(0,0,0,.1);border-radius:100px;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:rgba(99,102,241,.3)}
.hero-preview{background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(236,72,153,.04));border:1px solid rgba(99,102,241,.12);border-radius:20px;padding:32px;margin:0 auto;max-width:700px;position:relative;z-index:1}
.preview-bar{display:flex;gap:6px;margin-bottom:20px}
.preview-dot{width:10px;height:10px;border-radius:50%;background:rgba(0,0,0,.15)}
.preview-content{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.preview-block{border-radius:10px;padding:16px;background:rgba(255,255,255,.8);border:1px solid rgba(99,102,241,.1)}
.preview-block-h{height:8px;border-radius:4px;background:linear-gradient(90deg,#6366f1,#ec4899);margin-bottom:8px;width:60%}
.preview-block-b{height:6px;border-radius:3px;background:rgba(0,0,0,.08);width:80%}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin:80px 0;border-top:1px solid rgba(0,0,0,.07);border-bottom:1px solid rgba(0,0,0,.07)}
.stat{padding:44px 60px;border-right:1px solid rgba(0,0,0,.06);text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:48px;font-weight:900;letter-spacing:-.04em;line-height:1;background:linear-gradient(135deg,#6366f1,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-l{font-size:13px;color:rgba(15,15,15,.4);font-weight:500;margin-top:8px}
.features{padding:80px 60px;max-width:1200px;margin:0 auto}
.features h2{font-size:clamp(28px,4vw,52px);font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-.03em}
.features-sub{text-align:center;color:rgba(15,15,15,.45);font-size:16px;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#f8f8ff;border:1px solid rgba(99,102,241,.1);border-radius:20px;padding:32px;transition:all .25s}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(99,102,241,.1);border-color:rgba(99,102,241,.2)}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;letter-spacing:-.02em}
.card p{font-size:14px;color:rgba(15,15,15,.45);line-height:1.75}
.quote{padding:80px 60px;text-align:center;background:linear-gradient(135deg,rgba(99,102,241,.04),rgba(236,72,153,.03))}
.quote q{font-size:clamp(18px,2.5vw,28px);font-weight:700;color:#0f0f0f;line-height:1.6;max-width:660px;display:inline-block;quotes:none;letter-spacing:-.02em}
.cta-sec{padding:100px 60px;text-align:center}
.cta-sec h2{font-size:clamp(32px,5vw,68px);font-weight:900;letter-spacing:-.04em;margin-bottom:16px}
.cta-sec p{font-size:16px;color:rgba(15,15,15,.4);margin-bottom:40px}
footer{padding:32px 60px;border-top:1px solid rgba(0,0,0,.07);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:800}
.f-copy{font-size:13px;color:rgba(15,15,15,.3)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:90px 24px 0}.stats{grid-template-columns:1fr;margin:50px 0}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(0,0,0,.06)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo"><span class="logo-grad">{{BRAND_NAME}}</span></div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Start free</a></div></nav>
<section class="hero"><div class="hero-gradient"></div><div class="hero-inner"><div class="hero-badge">✨ Introducing {{BRAND_NAME}}</div><h1>{{HEADLINE_A}} <span class="h1-grad">{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Watch demo →</button></div><div class="hero-preview"><div class="preview-bar"><div class="preview-dot"></div><div class="preview-dot"></div><div class="preview-dot"></div></div><div class="preview-content"><div class="preview-block"><div class="preview-block-h"></div><div class="preview-block-b"></div></div><div class="preview-block"><div class="preview-block-h" style="background:linear-gradient(90deg,#ec4899,#f59e0b)"></div><div class="preview-block-b"></div></div><div class="preview-block"><div class="preview-block-h" style="background:linear-gradient(90deg,#22c55e,#06b6d4)"></div><div class="preview-block-b"></div></div></div></div></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2><span class="h1-grad">{{HEADLINE_A}}</span> Features</h2><p class="features-sub">Everything you need to build something beautiful</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2><span class="h1-grad">{{CTA_TEXT}}</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo"><span class="logo-grad">{{BRAND_NAME}}</span></div><div class="f-copy">© {{BRAND_NAME}} 2025 · {{FOOTER_TAGLINE}}</div></footer>
</body></html>`,
  },

  // ── 42. EARTH ORGANIC ─────────────────────────
  {
    name: 'Earth Organic', emoji: '🌍',
    keywords: ['organic','earth','natural','clay','craft','artisan','handmade'],
    examples: ['Artisan pottery brand','Hand-crafted goods','Earthy wellness brand'],
    theme: { bg:'#fdf6ec', text:'#3d2008', sub:'rgba(61,32,8,0.55)', acc:'#8B4513', border:'1px solid rgba(139,69,19,0.2)', cardBg:'rgba(139,69,19,0.05)', headFont:"'Merriweather',serif", bodyFont:"'Merriweather',serif", headWeight:'700', headCase:'none', radius:'12px', btnBg:'#8B4513', btnText:'#fdf6ec' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fdf6ec;color:#3d2008;font-family:'Merriweather',serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:64px;background:rgba(253,246,236,.96);backdrop-filter:blur(8px);border-bottom:1px solid rgba(139,69,19,.12);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:18px;font-weight:700;color:#3d2008;letter-spacing:.02em}
.logo em{color:#8B4513;font-style:italic}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(61,32,8,.45);text-decoration:none;font-size:13px;font-style:italic;transition:color .15s}
.nav-links a:hover{color:#8B4513}
.hero{padding:140px 64px 80px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;min-height:90vh;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-100px;right:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(139,69,19,.06),transparent 70%)}
.hero-tag{font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:rgba(61,32,8,.4);margin-bottom:20px;display:flex;align-items:center;gap:10px;font-style:normal}
.hero-tag::before{content:'🌿';font-size:14px}
h1{font-size:clamp(36px,5vw,66px);font-weight:700;line-height:1.15;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 em{color:#8B4513;font-style:italic}
.sub{font-size:16px;color:rgba(61,32,8,.5);line-height:1.9;margin-bottom:40px;font-style:italic;font-weight:300}
.btn{display:inline-block;padding:14px 44px;background:#8B4513;color:#fdf6ec;border:none;border-radius:100px;font-family:'Merriweather',serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s}
.btn:hover{background:#6b3410;transform:translateY(-2px);box-shadow:0 8px 24px rgba(139,69,19,.25)}
.hero-visual{background:linear-gradient(135deg,rgba(139,69,19,.08),rgba(139,69,19,.04));border-radius:28px;padding:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:380px;border:1px solid rgba(139,69,19,.12)}
.clay-icon{font-size:100px;animation:sway 4s ease-in-out infinite}
.clay-sub{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(61,32,8,.3);margin-top:20px;font-style:normal}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;background:rgba(139,69,19,.04);border-top:1px solid rgba(139,69,19,.1);border-bottom:1px solid rgba(139,69,19,.1)}
.stat{padding:44px 64px;border-right:1px solid rgba(139,69,19,.08);text-align:center}
.stat:last-child{border-right:none}
.stat-n{font-size:48px;font-weight:700;color:#8B4513;font-style:italic;line-height:1}
.stat-l{font-size:12px;color:rgba(61,32,8,.4);font-style:italic;margin-top:8px;font-weight:300}
.features{padding:100px 64px}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:700;text-align:center;margin-bottom:12px}
.features h2 em{color:#8B4513;font-style:italic}
.features-sub{text-align:center;color:rgba(61,32,8,.45);font-size:15px;font-style:italic;margin-bottom:52px;font-weight:300}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:rgba(139,69,19,.05);border:1px solid rgba(139,69,19,.1);border-radius:20px;padding:32px;transition:all .25s}
.card:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(139,69,19,.1);border-color:rgba(139,69,19,.2)}
.card-ico{font-size:32px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;color:#3d2008}
.card p{font-size:14px;color:rgba(61,32,8,.45);line-height:1.85;font-style:italic;font-weight:300}
.quote{padding:80px 64px;text-align:center;background:linear-gradient(135deg,rgba(139,69,19,.06),rgba(139,69,19,.02));border-top:1px solid rgba(139,69,19,.1)}
.quote q{font-size:clamp(18px,2.5vw,28px);font-style:italic;font-weight:400;color:rgba(61,32,8,.65);line-height:1.7;max-width:660px;display:inline-block;quotes:none;font-weight:300}
.cta-sec{padding:100px 64px;text-align:center}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:700;margin-bottom:16px;line-height:1.1}
.cta-sec h2 em{color:#8B4513;font-style:italic}
.cta-sec p{font-size:15px;color:rgba(61,32,8,.4);margin-bottom:40px;font-style:italic;font-weight:300}
footer{padding:32px 64px;border-top:1px solid rgba(139,69,19,.1);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:700;color:#3d2008}
.f-logo em{color:#8B4513;font-style:italic}
.f-copy{font-size:12px;color:rgba(61,32,8,.3);font-style:italic;font-weight:300}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@media(max-width:768px){nav{padding:0 24px}.hero{grid-template-columns:1fr;padding:110px 24px 60px;gap:40px}.hero-visual{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(139,69,19,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}} <em>🌿</em></div><div class="nav-links"><a href="#features">Craft</a><a href="#about">Story</a><a href="#cta">Shop</a></div></nav>
<section class="hero"><div><div class="hero-tag">Hand-crafted · Earth-first</div><h1>{{HEADLINE_A}} <em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-visual"><div class="clay-icon">🏺</div><div class="clay-sub">Handcrafted since 2018</div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Made with <em>Earth</em></h2><p class="features-sub">Every piece tells a story</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Explore <em>{{BRAND_NAME}}</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}} <em>🌿</em></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 43. DARK MAGAZINE ─────────────────────────
  {
    name: 'Dark Magazine', emoji: '📖',
    keywords: ['magazine','editorial','dark','bold','culture','media','glossy'],
    examples: ['Digital magazine brand','Bold culture publication','Dark editorial magazine'],
    theme: { bg:'#111111', text:'#ffffff', sub:'rgba(255,255,255,0.5)', acc:'#e63946', border:'1px solid rgba(255,255,255,0.1)', cardBg:'rgba(255,255,255,0.04)', headFont:"'Playfair Display',serif", bodyFont:"'Inter',sans-serif", headWeight:'900', headCase:'none', radius:'0', btnBg:'#e63946', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#111;color:#fff;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0;background:#111;border-bottom:1px solid rgba(255,255,255,.08)}
.nav-top{padding:8px 64px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center}
.nav-date{font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.1em}
.logo{font-family:'Playfair Display',serif;font-size:36px;font-weight:900;color:#fff;text-align:center;padding:8px 64px;letter-spacing:.02em}
.logo em{color:#e63946;font-style:italic}
.nav-links{display:flex;align-items:stretch;justify-content:center;border-top:1px solid rgba(255,255,255,.06)}
.nav-links a{color:rgba(255,255,255,.45);text-decoration:none;font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:8px 24px;border-right:1px solid rgba(255,255,255,.06);transition:color .15s}
.nav-links a:first-child{border-left:1px solid rgba(255,255,255,.06)}
.nav-links a:hover{color:#e63946}
.hero{padding:180px 64px 60px;display:grid;grid-template-columns:2fr 1fr;gap:48px;border-bottom:1px solid rgba(255,255,255,.08)}
.hero-main{}
.hero-label{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#e63946;margin-bottom:20px;display:flex;align-items:center;gap:10px}
.hero-label::before{content:'';width:24px;height:2px;background:#e63946}
h1{font-family:'Playfair Display',serif;font-size:clamp(44px,5.5vw,80px);font-weight:900;line-height:1.05;max-width:700px;margin-bottom:24px;animation:fadeUp .7s ease forwards}
h1 em{color:#e63946;font-style:italic}
.sub{font-size:16px;color:rgba(255,255,255,.45);line-height:1.75;max-width:480px;margin-bottom:40px}
.btn{display:inline-block;padding:13px 36px;background:#e63946;color:#fff;border:none;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.btn:hover{background:#c01f2c}
.hero-side{border-left:1px solid rgba(255,255,255,.08);padding-left:40px;display:flex;flex-direction:column;gap:24px}
.side-story{border-bottom:1px solid rgba(255,255,255,.06);padding-bottom:20px}
.side-story:last-child{border-bottom:none;padding-bottom:0}
.side-cat{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#e63946;margin-bottom:8px}
.side-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:6px}
.side-desc{font-size:12px;color:rgba(255,255,255,.35);line-height:1.6}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid rgba(255,255,255,.08)}
.stat{padding:44px 64px;border-right:1px solid rgba(255,255,255,.06)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Playfair Display',serif;font-size:52px;font-weight:900;color:#e63946;font-style:italic;line-height:1}
.stat-l{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:.15em;text-transform:uppercase;margin-top:8px;font-weight:600}
.features{padding:80px 64px;border-bottom:1px solid rgba(255,255,255,.08)}
.feat-banner{background:#e63946;color:#fff;padding:10px 24px;display:inline-block;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:44px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:36px;border-right:1px solid rgba(255,255,255,.06);transition:background .2s}
.card:last-child{border-right:none}
.card:hover{background:rgba(255,255,255,.03)}
.card-ico{font-size:24px;display:block;margin-bottom:16px}
.card h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:10px;color:#fff}
.card h3 em{color:#e63946;font-style:italic}
.card p{font-size:13px;color:rgba(255,255,255,.4);line-height:1.75}
.quote{padding:80px 64px;background:#e63946;border-bottom:1px solid rgba(255,255,255,.1)}
.quote q{font-family:'Playfair Display',serif;font-size:clamp(20px,3vw,36px);font-style:italic;font-weight:400;color:#fff;line-height:1.55;max-width:720px;display:block;quotes:none}
.cta-sec{padding:80px 64px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.08)}
.cta-sec h2{font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,72px);font-weight:900;line-height:1;max-width:600px}
.cta-sec h2 em{color:#e63946;font-style:italic;display:block}
footer{padding:28px 64px;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:#fff}
.f-logo em{color:#e63946;font-style:italic}
.f-copy{font-size:11px;color:rgba(255,255,255,.25);letter-spacing:.1em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){.nav-top{padding:8px 24px}.logo{padding:8px 24px;font-size:24px}.nav-links a{padding:8px 12px;font-size:9px}.hero{grid-template-columns:1fr;padding:180px 24px 60px;gap:40px}.hero-side{border-left:none;padding-left:0;border-top:1px solid rgba(255,255,255,.08);padding-top:24px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(255,255,255,.06)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(255,255,255,.06)}.quote{padding:60px 24px}.cta-sec{flex-direction:column;gap:32px;align-items:flex-start;padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="nav-top"><span class="nav-date">May 10, 2025</span><span class="nav-date">Vol. XII</span></div><div class="logo">{{BRAND_NAME}} <em>Magazine</em></div><div class="nav-links"><a href="#features">Culture</a><a href="#about">Features</a><a href="#cta">Subscribe</a></div></nav>
<section class="hero"><div class="hero-main"><div class="hero-label">Cover Story</div><h1>{{HEADLINE_A}} <em>{{HEADLINE_B}}</em> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-side"><div class="side-story"><div class="side-cat">Feature</div><div class="side-title">{{FEAT_1_TITLE}}</div><div class="side-desc">{{FEAT_1_DESC}}</div></div><div class="side-story"><div class="side-cat">Opinion</div><div class="side-title">{{FEAT_2_TITLE}}</div><div class="side-desc">{{FEAT_2_DESC}}</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-banner">This Issue</div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Subscribe to<em>{{BRAND_NAME}}</em></h2><button class="btn" style="font-size:14px;padding:15px 48px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}} <em>Magazine</em></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 44. BAUHAUS ───────────────────────────────
  {
    name: 'Bauhaus', emoji: '⬤',
    keywords: ['design','art','bauhaus','geometric','bold','modernist','creative'],
    examples: ['Design school brand','Modernist architecture firm','Geometric art studio'],
    theme: { bg:'#ffffff', text:'#0d0d0d', sub:'rgba(13,13,13,0.5)', acc:'#e63946', border:'2px solid #0d0d0d', cardBg:'#f5f5f5', headFont:"'Barlow',sans-serif", bodyFont:"'Barlow',sans-serif", headWeight:'900', headCase:'uppercase', radius:'0', btnBg:'#1565c0', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#0d0d0d;font-family:'Barlow',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;height:56px;background:#0d0d0d;display:flex;align-items:stretch}
.logo{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:.2em;color:#fff;padding:0 32px;border-right:2px solid rgba(255,255,255,.15);display:flex;align-items:center}
.nav-links{display:flex;align-items:stretch;margin-left:auto}
.nav-links a{color:rgba(255,255,255,.5);text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;padding:0 24px;border-left:1px solid rgba(255,255,255,.08);display:flex;align-items:center;transition:background .15s,color .15s}
.nav-links a:hover{background:#e63946;color:#fff}
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:90vh;border-bottom:4px solid #0d0d0d;margin-top:56px}
.hero-text{padding:60px;border-right:4px solid #0d0d0d;display:flex;flex-direction:column;justify-content:center;background:#fff}
.bauhaus-shapes{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.bs1{background:#e63946}
.bs2{background:#ffd600;border-left:4px solid #0d0d0d}
.bs3{background:#1565c0;border-top:4px solid #0d0d0d;display:flex;align-items:center;justify-content:center}
.circle{width:120px;height:120px;border-radius:50%;background:#fff}
.bs4{background:#0d0d0d;border-top:4px solid #0d0d0d;border-left:4px solid #0d0d0d;display:flex;align-items:center;justify-content:center}
.triangle{width:0;height:0;border-left:60px solid transparent;border-right:60px solid transparent;border-bottom:100px solid #ffd600}
.hero-eyebrow{font-size:10px;font-weight:900;letter-spacing:.25em;text-transform:uppercase;color:#e63946;margin-bottom:20px}
h1{font-size:clamp(48px,6vw,80px);font-weight:900;line-height:.95;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:28px;animation:fadeUp .7s ease forwards}
h1 .r{color:#e63946}
h1 .b{color:#1565c0}
.sub{font-size:16px;color:rgba(13,13,13,.5);line-height:1.7;max-width:380px;margin-bottom:44px;font-weight:400}
.btn{display:inline-block;padding:14px 44px;background:#1565c0;color:#fff;border:3px solid #0d0d0d;font-family:'Barlow',sans-serif;font-size:13px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .15s}
.btn:hover{background:#e63946}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:4px solid #0d0d0d}
.stat{padding:40px 60px;border-right:4px solid #0d0d0d;position:relative;overflow:hidden}
.stat:last-child{border-right:none}
.stat-bg{position:absolute;bottom:-20px;right:-20px;width:100px;height:100px;opacity:.06}
.s1 .stat-bg{background:#e63946;border-radius:50%}
.s2 .stat-bg{background:#ffd600;transform:rotate(45deg)}
.s3 .stat-bg{background:#1565c0;border-radius:50%}
.stat-n{font-size:52px;font-weight:900;color:#0d0d0d;line-height:1;text-transform:uppercase;position:relative;z-index:1}
.stat-n.r{color:#e63946}
.stat-n.b{color:#1565c0}
.stat-l{font-size:11px;font-weight:700;color:rgba(13,13,13,.4);letter-spacing:.2em;text-transform:uppercase;margin-top:8px;position:relative;z-index:1}
.features{padding:80px 60px;border-bottom:4px solid #0d0d0d}
.feat-header{display:flex;align-items:center;gap:20px;margin-bottom:52px}
.feat-shapes{display:flex;gap:8px}
.fsq{width:20px;height:20px;border:2px solid #0d0d0d}
.fsq.r{background:#e63946}
.fsq.b{background:#1565c0}
.fsq.y{background:#ffd600}
.fsq.c{border-radius:50%}
.features h2{font-size:clamp(28px,3.5vw,48px);font-weight:900;text-transform:uppercase;letter-spacing:-.01em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:4px solid #0d0d0d}
.card{padding:40px 32px;border-right:2px solid rgba(13,13,13,.15);transition:background .15s;position:relative}
.card:last-child{border-right:none}
.card:hover{background:#f5f5f5}
.card-accent{position:absolute;top:0;left:0;right:0;height:4px}
.card:nth-child(1) .card-accent{background:#e63946}
.card:nth-child(2) .card-accent{background:#ffd600}
.card:nth-child(3) .card-accent{background:#1565c0}
.card-ico{font-size:28px;display:block;margin-bottom:16px}
.card h3{font-size:18px;font-weight:900;text-transform:uppercase;margin-bottom:10px;letter-spacing:.04em}
.card p{font-size:13px;color:rgba(13,13,13,.5);line-height:1.75;font-weight:400}
.quote{padding:60px;background:#0d0d0d;border-bottom:4px solid #e63946}
.quote q{font-size:clamp(20px,3vw,36px);font-weight:900;text-transform:uppercase;letter-spacing:-.01em;color:#fff;line-height:1.2;max-width:820px;display:block;quotes:none}
.quote q .r{color:#e63946}
.quote q .y{color:#ffd600}
.cta-sec{padding:60px;display:flex;align-items:center;justify-content:space-between;border-bottom:4px solid #0d0d0d}
.cta-sec h2{font-size:clamp(36px,5.5vw,80px);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:.95}
.cta-sec h2 .r{color:#e63946}
.cta-sec h2 .b{color:#1565c0;display:block}
footer{padding:24px 60px;background:#0d0d0d;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:.2em;color:#fff}
.f-copy{font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.15em;text-transform:uppercase;font-weight:700}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{flex-wrap:wrap;height:auto}.logo{width:100%;border-right:none;border-bottom:1px solid rgba(255,255,255,.1);padding:12px 24px}.nav-links{width:100%}.nav-links a{flex:1;justify-content:center}.hero{grid-template-columns:1fr;border-top:4px solid #0d0d0d;margin-top:80px}.hero-text{padding:40px 24px}.bauhaus-shapes{min-height:200px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:4px solid #0d0d0d}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:2px solid rgba(13,13,13,.1)}.quote{padding:48px 24px}.cta-sec{flex-direction:column;gap:32px;align-items:flex-start;padding:48px 24px}footer{padding:24px;flex-direction:column;gap:8px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Werk</a><a href="#about">Über</a><a href="#cta">Kontakt</a></div></nav>
<section class="hero"><div class="hero-text"><div class="hero-eyebrow">Form Follows Function</div><h1>{{HEADLINE_A}}<br><span class="r">{{HEADLINE_B}}</span><br><span class="b">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="bauhaus-shapes"><div class="bs1"></div><div class="bs2"></div><div class="bs3"><div class="circle"></div></div><div class="bs4"><div class="triangle"></div></div></div></section>
<section class="stats"><div class="stat s1"><div class="stat-bg"></div><div class="stat-n r">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat s2"><div class="stat-bg"></div><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat s3"><div class="stat-bg"></div><div class="stat-n b">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-header"><div class="feat-shapes"><div class="fsq r"></div><div class="fsq y c"></div><div class="fsq b"></div></div><h2>Core Functions</h2></div><div class="grid"><div class="card"><div class="card-accent"></div><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><div class="card-accent"></div><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><div class="card-accent"></div><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q><span class="r">{{BRAND_NAME}}:</span> {{QUOTE}} — <span class="y">{{BRAND_NAME}}</span></q></section>
<section class="cta-sec" id="cta"><h2><span class="r">Join</span><span class="b">{{BRAND_NAME}}</span></h2><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 46. LUXURY REAL ESTATE ────────────────────
  {
    name: 'Luxury Real Estate', emoji: '🏰',
    keywords: ['real estate','property','luxury','homes','premium','architecture','realty'],
    examples: ['Luxury property agency','Premium real estate brand','High-end architecture firm'],
    theme: { bg:'#1a1a1a', text:'#f8f4ee', sub:'rgba(248,244,238,0.5)', acc:'#c9a84c', border:'1px solid rgba(201,168,76,0.22)', cardBg:'rgba(201,168,76,0.04)', headFont:"'Cormorant Garamond',serif", bodyFont:"'Cormorant Garamond',serif", headWeight:'600', headCase:'none', radius:'0', btnBg:'#c9a84c', btnText:'#1a1a1a' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a1a;color:#f8f4ee;font-family:'Cormorant Garamond',serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 60% 30%,rgba(201,168,76,.04) 0%,transparent 55%);pointer-events:none}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:24px 80px;background:rgba(26,26,26,.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(201,168,76,.18);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:16px;font-weight:600;color:#f8f4ee;letter-spacing:.25em;text-transform:uppercase}
.logo em{color:#c9a84c;font-style:italic}
.nav-links{display:flex;gap:40px}
.nav-links a{color:rgba(248,244,238,.35);text-decoration:none;font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:400;transition:color .2s}
.nav-links a:hover{color:#c9a84c}
.hero{min-height:100vh;padding:140px 80px 80px;display:grid;grid-template-columns:1.1fr 1fr;gap:80px;align-items:center}
.hero-badge{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:rgba(248,244,238,.3);margin-bottom:24px;display:flex;align-items:center;gap:14px}
.hero-badge::before{content:'';width:32px;height:1px;background:#c9a84c}
h1{font-size:clamp(40px,5vw,72px);font-weight:600;line-height:1.1;max-width:540px;margin-bottom:24px;animation:fadeUp .8s ease forwards;letter-spacing:.01em}
h1 em{color:#c9a84c;font-style:italic;display:block}
.sub{font-size:17px;color:rgba(248,244,238,.45);line-height:1.9;max-width:420px;margin-bottom:48px;font-style:italic;font-weight:300}
.btns{display:flex;gap:14px;flex-wrap:wrap}
.btn{padding:13px 44px;background:#c9a84c;color:#1a1a1a;border:none;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.btn:hover{background:#b8973b;box-shadow:0 4px 20px rgba(201,168,76,.3)}
.btn2{padding:13px 36px;background:transparent;color:#c9a84c;border:1px solid rgba(201,168,76,.4);font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.btn2:hover{border-color:#c9a84c;background:rgba(201,168,76,.06)}
.hero-right{border-left:1px solid rgba(201,168,76,.15);padding-left:80px;display:flex;flex-direction:column;gap:28px}
.property-card{border-bottom:1px solid rgba(201,168,76,.1);padding-bottom:24px}
.property-card:last-child{border-bottom:none;padding-bottom:0}
.prop-label{font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#c9a84c;margin-bottom:8px;font-style:italic}
.prop-title{font-size:20px;font-weight:600;color:#f8f4ee;margin-bottom:4px}
.prop-price{font-size:14px;color:rgba(248,244,238,.35);font-style:italic;letter-spacing:.04em}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(201,168,76,.15);border-bottom:1px solid rgba(201,168,76,.15)}
.stat{padding:48px 80px;border-right:1px solid rgba(201,168,76,.1)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:600;color:#c9a84c;font-style:italic;line-height:1;letter-spacing:.02em}
.stat-l{font-size:10px;color:rgba(248,244,238,.3);letter-spacing:.25em;text-transform:uppercase;margin-top:10px}
.features{padding:100px 80px;border-bottom:1px solid rgba(201,168,76,.1)}
.feat-head{display:flex;align-items:baseline;gap:28px;border-bottom:1px solid rgba(201,168,76,.1);padding-bottom:28px;margin-bottom:56px}
.features h2{font-size:clamp(28px,3.5vw,48px);font-weight:600;letter-spacing:.02em}
.features h2 em{color:#c9a84c;font-style:italic}
.feat-rule{flex:1;height:1px;background:rgba(201,168,76,.15)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:40px;border-right:1px solid rgba(201,168,76,.08);transition:background .2s}
.card:last-child{border-right:none}
.card:hover{background:rgba(201,168,76,.04)}
.card-ico{font-size:24px;display:block;margin-bottom:20px}
.card h3{font-size:19px;font-weight:600;margin-bottom:12px;color:#f8f4ee;letter-spacing:.02em}
.card p{font-size:14px;color:rgba(248,244,238,.35);line-height:1.9;font-style:italic;font-weight:300}
.quote{padding:80px;text-align:center;border-bottom:1px solid rgba(201,168,76,.1)}
.quote-rule{width:60px;height:1px;background:#c9a84c;margin:0 auto 24px}
.quote q{font-size:clamp(18px,2.5vw,30px);font-style:italic;font-weight:300;color:rgba(248,244,238,.6);line-height:1.7;max-width:700px;display:inline-block;quotes:none}
.cta-sec{padding:100px 80px;text-align:center}
.cta-sec h2{font-size:clamp(32px,4.5vw,64px);font-weight:600;margin-bottom:20px;line-height:1.1;letter-spacing:.01em}
.cta-sec h2 em{color:#c9a84c;font-style:italic;display:block}
.cta-sec p{font-size:16px;color:rgba(248,244,238,.35);font-style:italic;margin-bottom:44px;font-weight:300}
footer{padding:32px 80px;border-top:1px solid rgba(201,168,76,.15);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:13px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:#f8f4ee}
.f-logo em{color:#c9a84c;font-style:italic}
.f-copy{font-size:10px;color:rgba(248,244,238,.2);letter-spacing:.15em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:20px 24px}.hero{grid-template-columns:1fr;padding:120px 24px 60px;gap:40px}.hero-right{border-left:none;padding-left:0;border-top:1px solid rgba(201,168,76,.12);padding-top:36px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(201,168,76,.1)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(201,168,76,.08)}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:12px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}} <em>Estates</em></div><div class="nav-links"><a href="#features">Portfolio</a><a href="#about">Agents</a><a href="#cta">Inquire</a></div></nav>
<section class="hero"><div><div class="hero-badge">Premier Properties</div><h1>{{HEADLINE_A}}<em>{{HEADLINE_B}}</em>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">View Portfolio</button></div></div><div class="hero-right"><div class="property-card"><div class="prop-label">Featured Listing</div><div class="prop-title">{{FEAT_1_TITLE}}</div><div class="prop-price">{{FEAT_1_DESC}}</div></div><div class="property-card"><div class="prop-label">New Listing</div><div class="prop-title">{{FEAT_2_TITLE}}</div><div class="prop-price">{{FEAT_2_DESC}}</div></div><div class="property-card"><div class="prop-label">Sold</div><div class="prop-title">{{FEAT_3_TITLE}}</div><div class="prop-price">{{FEAT_3_DESC}}</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="feat-head"><h2>Our <em>Services</em></h2><div class="feat-rule"></div></div><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><div class="quote-rule"></div><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Find Your<em>Dream Home</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}} <em>Estates</em></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 47. IRIDESCENT ────────────────────────────
  {
    name: 'Iridescent', emoji: '🌈',
    keywords: ['holographic','iridescent','futuristic','fashion','beauty','tech','luxury'],
    examples: ['Holographic beauty brand','Iridescent tech company','Future fashion label'],
    theme: { bg:'#0a0a1a', text:'#f0f0ff', sub:'rgba(240,240,255,0.45)', acc:'#a78bfa', border:'1px solid rgba(167,139,250,0.2)', cardBg:'rgba(167,139,250,0.05)', headFont:"'Syne',sans-serif", bodyFont:"'Syne',sans-serif", headWeight:'800', headCase:'none', radius:'12px', btnBg:'#a78bfa', btnText:'#0a0a1a' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a1a;color:#f0f0ff;font-family:'Syne',sans-serif;overflow-x:hidden}
:root{--iri:linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#c77dff,#ff6b6b)}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 64px;background:rgba(10,10,26,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(167,139,250,.15);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:800;letter-spacing:-.02em;background:var(--iri);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 100%;animation:shiftGrad 4s linear infinite}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(240,240,255,.4);text-decoration:none;font-size:13px;font-weight:600;transition:color .15s}
.nav-links a:hover{color:#a78bfa}
.hero{min-height:100vh;padding:140px 64px 80px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.iri-blob{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;opacity:.15;animation:blobFloat 8s ease-in-out infinite}
.blob1{width:500px;height:500px;background:conic-gradient(#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#c77dff,#ff6b6b);top:-100px;right:-100px}
.blob2{width:400px;height:400px;background:conic-gradient(#4d96ff,#c77dff,#ff6b6b,#ffd93d);bottom:-80px;left:-80px;animation-delay:-4s}
h1{font-size:clamp(48px,7.5vw,108px);font-weight:800;line-height:.95;letter-spacing:-.04em;max-width:820px;margin-bottom:24px;animation:fadeUp .8s ease forwards;position:relative;z-index:1}
h1 .iri{background:var(--iri);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 100%;animation:shiftGrad 4s linear infinite;display:block}
.sub{font-size:18px;color:rgba(240,240,255,.4);line-height:1.7;max-width:480px;margin-bottom:48px;position:relative;z-index:1}
.btns{display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:1}
.btn{padding:14px 40px;background:var(--iri);background-size:200% 100%;color:#0a0a1a;border:none;border-radius:100px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;animation:shiftGrad 4s linear infinite;box-shadow:0 4px 24px rgba(167,139,250,.3)}
.btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(167,139,250,.5)}
.btn2{padding:14px 32px;background:transparent;color:#a78bfa;border:1px solid rgba(167,139,250,.3);border-radius:100px;font-family:'Syne',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#a78bfa;background:rgba(167,139,250,.08)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(167,139,250,.12);border-bottom:1px solid rgba(167,139,250,.12);position:relative;z-index:1}
.stat{padding:44px 64px;border-right:1px solid rgba(167,139,250,.08)}
.stat:last-child{border-right:none}
.stat-n{font-size:52px;font-weight:800;line-height:1;letter-spacing:-.04em;background:var(--iri);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 100%;animation:shiftGrad 4s linear infinite}
.stat-l{font-size:12px;color:rgba(240,240,255,.3);font-weight:600;margin-top:8px;letter-spacing:.06em}
.features{padding:100px 64px;position:relative;z-index:1}
.features h2{font-size:clamp(28px,4vw,52px);font-weight:800;letter-spacing:-.03em;margin-bottom:12px}
.features h2 .iri{background:var(--iri);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 100%;animation:shiftGrad 4s linear infinite}
.features-sub{color:rgba(240,240,255,.35);font-size:16px;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:rgba(167,139,250,.05);border:1px solid;border-radius:16px;padding:32px;transition:all .25s;border-image:linear-gradient(135deg,rgba(255,107,107,.3),rgba(167,139,250,.3)) 1;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--iri);background-size:200% 100%;animation:shiftGrad 4s linear infinite}
.card:hover{transform:translateY(-4px);background:rgba(167,139,250,.08)}
.card-ico{font-size:28px;display:block;margin-bottom:18px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;letter-spacing:-.01em}
.card p{font-size:14px;color:rgba(240,240,255,.35);line-height:1.75}
.quote{padding:80px 64px;text-align:center;border-top:1px solid rgba(167,139,250,.1);border-bottom:1px solid rgba(167,139,250,.1);position:relative;z-index:1}
.quote q{font-size:clamp(18px,2.5vw,28px);font-weight:700;color:rgba(240,240,255,.65);line-height:1.55;max-width:680px;display:inline-block;quotes:none;letter-spacing:-.02em}
.quote q .iri{background:var(--iri);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 100%;animation:shiftGrad 4s linear infinite}
.cta-sec{padding:100px 64px;text-align:center;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(36px,5.5vw,80px);font-weight:800;letter-spacing:-.04em;margin-bottom:16px;line-height:.95}
.cta-sec h2 .iri{background:var(--iri);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 100%;animation:shiftGrad 4s linear infinite;display:block}
.cta-sec p{font-size:16px;color:rgba(240,240,255,.35);margin-bottom:40px}
footer{padding:28px 64px;border-top:1px solid rgba(167,139,250,.1);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:16px;font-weight:800;background:var(--iri);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 100%;animation:shiftGrad 4s linear infinite}
.f-copy{font-size:12px;color:rgba(240,240,255,.2)}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes shiftGrad{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes blobFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.05)}}
@media(max-width:768px){nav{padding:16px 24px}.hero{padding:110px 24px 60px}.blob1,.blob2{display:none}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(167,139,250,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#cta">Get started</a></div></nav>
<section class="hero"><div class="iri-blob blob1"></div><div class="iri-blob blob2"></div><h1>{{HEADLINE_A}}<span class="iri">{{HEADLINE_B}}</span>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Learn more →</button></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2><span class="iri">Iridescent</span> Features</h2><p class="features-sub">Holographic-grade capabilities for the future</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q><span class="iri">{{BRAND_NAME}}:</span> {{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Enter<span class="iri">the Future</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 48. LETTERPRESS ───────────────────────────
  {
    name: 'Letterpress', emoji: '🖨️',
    keywords: ['print','letterpress','craft','artisan','stationery','paper','design'],
    examples: ['Stationery brand','Artisan print studio','Paper goods company'],
    theme: { bg:'#f4f1eb', text:'#2c1810', sub:'rgba(44,24,16,0.5)', acc:'#8b2500', border:'1px solid rgba(44,24,16,0.18)', cardBg:'rgba(44,24,16,0.04)', headFont:"'Playfair Display',serif", bodyFont:"'Courier Prime',monospace", headWeight:'700', headCase:'none', radius:'0', btnBg:'#2c1810', btnText:'#f4f1eb' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f4f1eb;color:#2c1810;font-family:'Courier Prime',monospace;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='.5' fill='rgba(44,24,16,.03)'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:#f4f1eb;border-bottom:2px solid #2c1810}
.nav-rule{height:3px;background:repeating-linear-gradient(90deg,#2c1810 0,#2c1810 20px,#f4f1eb 20px,#f4f1eb 22px)}
.nav-inner{padding:12px 64px;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:#2c1810;letter-spacing:.04em}
.logo em{color:#8b2500;font-style:italic}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(44,24,16,.4);text-decoration:none;font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:700;transition:color .15s}
.nav-links a:hover{color:#8b2500}
.hero{padding:140px 64px 80px;position:relative;z-index:1;display:grid;grid-template-columns:1.2fr 1fr;gap:60px;align-items:center;border-bottom:2px solid #2c1810;min-height:90vh}
.press-mark{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:rgba(44,24,16,.35);margin-bottom:20px;display:flex;align-items:center;gap:12px}
.press-mark::before,.press-mark::after{content:'✦';color:rgba(139,37,0,.4)}
h1{font-family:'Playfair Display',serif;font-size:clamp(40px,5.5vw,76px);font-weight:900;line-height:1.05;max-width:540px;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 em{color:#8b2500;font-style:italic}
.sub{font-size:14px;color:rgba(44,24,16,.5);line-height:2;max-width:400px;margin-bottom:40px;font-style:italic}
.btn{display:inline-block;padding:12px 44px;background:#2c1810;color:#f4f1eb;border:none;font-family:'Courier Prime',monospace;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:background .15s;position:relative}
.btn::before{content:'';position:absolute;inset:2px;border:1px solid rgba(244,241,235,.15);pointer-events:none}
.btn:hover{background:#8b2500}
.hero-right{background:rgba(44,24,16,.04);border:2px solid rgba(44,24,16,.15);padding:40px;position:relative}
.hr-ornament{text-align:center;font-size:24px;color:rgba(44,24,16,.15);line-height:1;margin-bottom:20px}
.hr-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;text-align:center;color:rgba(44,24,16,.7);margin-bottom:20px;border-bottom:1px solid rgba(44,24,16,.12);padding-bottom:16px}
.hr-item{display:flex;justify-content:space-between;align-items:baseline;padding:8px 0;border-bottom:1px solid rgba(44,24,16,.06);font-size:12px}
.hr-item:last-child{border-bottom:none}
.hr-label{color:rgba(44,24,16,.6);font-style:italic}
.hr-value{font-weight:700;color:#8b2500}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:2px solid #2c1810;position:relative;z-index:1}
.stat{padding:40px 64px;border-right:2px solid rgba(44,24,16,.2)}
.stat:last-child{border-right:none}
.stat-n{font-family:'Playfair Display',serif;font-size:52px;font-weight:900;color:#8b2500;font-style:italic;line-height:1}
.stat-l{font-size:10px;color:rgba(44,24,16,.4);letter-spacing:.2em;text-transform:uppercase;margin-top:8px}
.features{padding:80px 64px;border-bottom:2px solid #2c1810;position:relative;z-index:1}
.press-header{text-align:center;margin-bottom:56px;position:relative}
.press-header::before,.press-header::after{content:'— ✦ —';color:rgba(44,24,16,.2);font-size:14px;display:block;margin:8px 0}
.features h2{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,48px);font-weight:900}
.features h2 em{color:#8b2500;font-style:italic}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.card{padding:40px;border-right:1px solid rgba(44,24,16,.12);transition:background .15s;position:relative}
.card:last-child{border-right:none}
.card:hover{background:rgba(44,24,16,.03)}
.card::before{content:attr(data-num);position:absolute;top:20px;right:20px;font-size:36px;font-family:'Playfair Display',serif;font-style:italic;color:rgba(44,24,16,.05);font-weight:900;line-height:1}
.card-ico{font-size:24px;display:block;margin-bottom:16px}
.card h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:10px;font-style:italic;color:#2c1810}
.card p{font-size:12px;color:rgba(44,24,16,.5);line-height:2;font-style:italic}
.quote{padding:60px 64px;background:#2c1810;color:#f4f1eb;border-bottom:4px solid #8b2500;position:relative;z-index:1}
.quote q{font-family:'Playfair Display',serif;font-size:clamp(18px,2.5vw,30px);font-style:italic;font-weight:400;color:rgba(244,241,235,.75);line-height:1.65;max-width:700px;display:block;quotes:none}
.quote q em{color:#c9a84c;font-style:normal}
.cta-sec{padding:80px 64px;text-align:center;border-bottom:2px solid #2c1810;position:relative;z-index:1}
.cta-sec h2{font-family:'Playfair Display',serif;font-size:clamp(32px,4.5vw,64px);font-weight:900;margin-bottom:16px;line-height:1}
.cta-sec h2 em{color:#8b2500;font-style:italic;display:block}
.cta-sec p{font-size:13px;color:rgba(44,24,16,.4);margin-bottom:36px;font-style:italic}
footer{padding:24px 64px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:#2c1810}
.f-logo em{color:#8b2500;font-style:italic}
.f-copy{font-size:10px;color:rgba(44,24,16,.3);letter-spacing:.12em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){.nav-inner{padding:12px 24px}.hero{grid-template-columns:1fr;padding:130px 24px 60px;gap:40px}.hero-right{display:none}.stats{grid-template-columns:1fr}.stat{padding:24px;border-right:none;border-bottom:2px solid rgba(44,24,16,.15)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.card{border-right:none;border-bottom:1px solid rgba(44,24,16,.1)}.quote{padding:48px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:8px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="nav-rule"></div><div class="nav-inner"><div class="logo">{{BRAND_NAME}} <em>Press</em></div><div class="nav-links"><a href="#features">Studio</a><a href="#about">Story</a><a href="#cta">Order</a></div></div></nav>
<section class="hero"><div><div class="press-mark">Est. 2018</div><h1>{{HEADLINE_A}} <em>{{HEADLINE_B}}</em><br>{{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><button class="btn">{{CTA_TEXT}}</button></div><div class="hero-right"><div class="hr-ornament">✦ ✦ ✦</div><div class="hr-title">Current Orders</div><div class="hr-item"><span class="hr-label">Wedding Suite</span><span class="hr-value">{{STAT_1_NUM}}</span></div><div class="hr-item"><span class="hr-label">Business Cards</span><span class="hr-value">{{STAT_2_NUM}}</span></div><div class="hr-item"><span class="hr-label">Satisfaction</span><span class="hr-value">{{STAT_3_NUM}}</span></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><div class="press-header"><h2>The <em>Craft</em></h2></div><div class="grid"><div class="card" data-num="I"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card" data-num="II"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card" data-num="III"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} <em>— {{BRAND_NAME}} Press</em></q></section>
<section class="cta-sec" id="cta"><h2>Start Your<em>Project</em></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}} <em>Press</em></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 49. NORDIC MINIMAL ────────────────────────
  {
    name: 'Nordic Minimal', emoji: '❄️',
    keywords: ['nordic','scandinavian','minimal','clean','furniture','lifestyle','design'],
    examples: ['Scandinavian furniture brand','Nordic lifestyle company','Minimal design studio'],
    theme: { bg:'#ffffff', text:'#1c1c1c', sub:'rgba(28,28,28,0.5)', acc:'#2c6bed', border:'1px solid rgba(28,28,28,0.1)', cardBg:'#f0f0f0', headFont:"'Lato',sans-serif", bodyFont:"'Lato',sans-serif", headWeight:'700', headCase:'none', radius:'4px', btnBg:'#1c1c1c', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;color:#1c1c1c;font-family:'Lato',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 80px;height:60px;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);border-bottom:1px solid rgba(28,28,28,.08);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:16px;font-weight:900;color:#1c1c1c;letter-spacing:.06em;text-transform:uppercase}
.logo span{color:#2c6bed}
.nav-links{display:flex;gap:36px}
.nav-links a{color:rgba(28,28,28,.45);text-decoration:none;font-size:13px;font-weight:400;letter-spacing:.04em;transition:color .15s}
.nav-links a:hover{color:#1c1c1c}
.hero{padding:130px 80px 80px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;min-height:90vh;border-bottom:1px solid rgba(28,28,28,.08)}
.hero-tag{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(28,28,28,.3);margin-bottom:24px}
h1{font-size:clamp(38px,5vw,68px);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:20px;animation:fadeUp .7s ease forwards}
h1 .blue{color:#2c6bed}
.sub{font-size:17px;color:rgba(28,28,28,.5);line-height:1.8;margin-bottom:44px;font-weight:300}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:13px 36px;background:#1c1c1c;color:#fff;border:none;border-radius:4px;font-family:'Lato',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.04em}
.btn:hover{background:#2c6bed}
.btn2{padding:13px 28px;background:transparent;color:#1c1c1c;border:1px solid rgba(28,28,28,.2);border-radius:4px;font-family:'Lato',sans-serif;font-size:14px;font-weight:400;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#1c1c1c}
.hero-right{background:#f0f0f0;border-radius:8px;padding:56px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;gap:24px}
.hr-block{background:#fff;border-radius:6px;padding:20px 28px;width:100%;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.hr-label{font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(28,28,28,.35);margin-bottom:6px}
.hr-val{font-size:24px;font-weight:900;color:#1c1c1c}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid rgba(28,28,28,.08);background:#f0f0f0}
.stat{padding:44px 80px;border-right:1px solid rgba(28,28,28,.07)}
.stat:last-child{border-right:none}
.stat-n{font-size:48px;font-weight:900;color:#1c1c1c;letter-spacing:-.04em;line-height:1}
.stat-n.b{color:#2c6bed}
.stat-l{font-size:12px;color:rgba(28,28,28,.4);font-weight:400;margin-top:8px;letter-spacing:.04em}
.features{padding:80px;max-width:1360px;margin:0 auto}
.features h2{font-size:clamp(26px,3.5vw,44px);font-weight:900;letter-spacing:-.02em;margin-bottom:10px}
.features h2 span{color:#2c6bed}
.features-sub{color:rgba(28,28,28,.45);font-size:15px;font-weight:300;margin-bottom:48px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:#f0f0f0;border-radius:6px;padding:32px;transition:all .25s}
.card:hover{background:#e8e8e8;transform:translateY(-2px)}
.card-ico{font-size:26px;display:block;margin-bottom:16px}
.card h3{font-size:17px;font-weight:700;margin-bottom:10px;letter-spacing:-.01em}
.card p{font-size:13px;color:rgba(28,28,28,.5);line-height:1.75;font-weight:300}
.quote{padding:80px;background:#f0f0f0;border-top:1px solid rgba(28,28,28,.08);border-bottom:1px solid rgba(28,28,28,.08)}
.quote q{font-size:clamp(17px,2.5vw,26px);font-weight:300;color:#1c1c1c;line-height:1.65;max-width:680px;display:block;quotes:none;letter-spacing:.01em;font-style:italic}
.cta-sec{padding:80px;text-align:center}
.cta-sec h2{font-size:clamp(28px,4vw,52px);font-weight:900;letter-spacing:-.03em;margin-bottom:16px}
.cta-sec h2 span{color:#2c6bed}
.cta-sec p{font-size:15px;color:rgba(28,28,28,.45);margin-bottom:36px;font-weight:300}
footer{padding:28px 80px;border-top:1px solid rgba(28,28,28,.08);display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:#1c1c1c}
.f-logo span{color:#2c6bed}
.f-copy{font-size:12px;color:rgba(28,28,28,.3);font-weight:300}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px}.hero{grid-template-columns:1fr;padding:110px 24px 60px;gap:40px}.hero-right{padding:32px}.stats{grid-template-columns:1fr}.stat{padding:28px 24px;border-right:none;border-bottom:1px solid rgba(28,28,28,.07)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:8px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}<span>.</span></div><div class="nav-links"><a href="#features">Design</a><a href="#about">About</a><a href="#cta">Explore</a></div></nav>
<section class="hero"><div><div class="hero-tag">{{BRAND_NAME}} · Scandinavian Design</div><h1>{{HEADLINE_A}} <span class="blue">{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">Learn more</button></div></div><div class="hero-right"><div class="hr-block"><div class="hr-label">{{STAT_1_LABEL}}</div><div class="hr-val">{{STAT_1_NUM}}</div></div><div class="hr-block"><div class="hr-label">{{STAT_2_LABEL}}</div><div class="hr-val">{{STAT_2_NUM}}</div></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n b">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Nordic <span>Quality</span></h2><p class="features-sub">Crafted with Scandinavian precision</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Discover <span>{{BRAND_NAME}}</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}<span>.</span></div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },

  // ── 50. TACTICAL BOLD ─────────────────────────
  {
    name: 'Tactical Bold', emoji: '🎯',
    keywords: ['tactical','military','bold','security','outdoors','gear','tough'],
    examples: ['Tactical gear brand','Military apparel company','Outdoor adventure brand'],
    theme: { bg:'#1a1f0a', text:'#e8ebb8', sub:'rgba(232,235,184,0.5)', acc:'#84cc16', border:'1px solid rgba(132,204,22,0.2)', cardBg:'rgba(132,204,22,0.04)', headFont:"'Oswald',sans-serif", bodyFont:"'Oswald',sans-serif", headWeight:'700', headCase:'uppercase', radius:'0', btnBg:'#84cc16', btnText:'#1a1f0a' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1f0a;color:#e8ebb8;font-family:'Oswald',sans-serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:repeating-linear-gradient(45deg,rgba(132,204,22,.015) 0,rgba(132,204,22,.015) 1px,transparent 1px,transparent 8px),repeating-linear-gradient(-45deg,rgba(132,204,22,.015) 0,rgba(132,204,22,.015) 1px,transparent 1px,transparent 8px);pointer-events:none;z-index:0}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:56px;background:rgba(26,31,10,.95);border-bottom:2px solid rgba(132,204,22,.2);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#84cc16}
.nav-badge{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(132,204,22,.5);border:1px solid rgba(132,204,22,.2);padding:3px 10px}
.nav-links{display:flex;gap:28px}
.nav-links a{color:rgba(232,235,184,.4);text-decoration:none;font-size:12px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;transition:color .15s}
.nav-links a:hover{color:#84cc16}
.hero{min-height:100vh;padding:110px 64px 60px;position:relative;z-index:1}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(132,204,22,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(132,204,22,.04) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.hero-target{position:absolute;right:100px;top:50%;transform:translateY(-50%);width:300px;height:300px;opacity:.06;pointer-events:none}
.target-ring{position:absolute;border-radius:50%;border:2px solid #84cc16}
.t1{inset:0}
.t2{inset:40px}
.t3{inset:80px}
.t4{inset:120px;background:rgba(132,204,22,.3)}
.target-cross{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.target-cross::before{content:'';position:absolute;width:100%;height:2px;background:#84cc16}
.target-cross::after{content:'';position:absolute;width:2px;height:100%;background:#84cc16}
.hero-inner{position:relative;z-index:1;max-width:760px}
.hero-tag{font-size:11px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:#84cc16;margin-bottom:20px;display:flex;align-items:center;gap:12px}
.hero-tag::before{content:'▶';font-size:8px}
h1{font-size:clamp(56px,9vw,120px);font-weight:700;line-height:.9;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:24px;animation:fadeUp .6s ease forwards}
h1 .lime{color:#84cc16;text-shadow:0 0 20px rgba(132,204,22,.4)}
h1 .thin{font-weight:300;color:rgba(232,235,184,.4)}
.sub{font-size:17px;color:rgba(232,235,184,.45);line-height:1.7;max-width:440px;margin-bottom:48px;font-weight:300;letter-spacing:.03em}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{padding:14px 44px;background:#84cc16;color:#1a1f0a;border:none;font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .2s;clip-path:polygon(0 0,100% 0,96% 100%,0 100%)}
.btn:hover{background:#65a30d;transform:translateX(3px)}
.btn2{padding:14px 36px;background:transparent;color:#84cc16;border:1px solid rgba(132,204,22,.3);font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#84cc16;background:rgba(132,204,22,.06)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid rgba(132,204,22,.12);border-bottom:1px solid rgba(132,204,22,.12);position:relative;z-index:1}
.stat{padding:40px 64px;border-right:1px solid rgba(132,204,22,.08);position:relative}
.stat:last-child{border-right:none}
.stat::before{content:'▶';position:absolute;top:50%;left:24px;transform:translateY(-50%);font-size:8px;color:rgba(132,204,22,.3)}
.stat-n{font-size:52px;font-weight:700;color:#84cc16;text-shadow:0 0 16px rgba(132,204,22,.3);line-height:1;letter-spacing:.02em}
.stat-l{font-size:11px;color:rgba(232,235,184,.3);letter-spacing:.25em;text-transform:uppercase;margin-top:8px}
.features{padding:100px 64px;position:relative;z-index:1}
.features h2{font-size:clamp(32px,4.5vw,60px);font-weight:700;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:52px}
.features h2 .lime{color:#84cc16}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(132,204,22,.06)}
.card{background:#1a1f0a;padding:36px 28px;transition:background .2s;border-left:2px solid transparent}
.card:hover{background:rgba(132,204,22,.04);border-left-color:#84cc16}
.card-ico{font-size:26px;display:block;margin-bottom:16px}
.card h3{font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;color:#e8ebb8}
.card p{font-size:14px;color:rgba(232,235,184,.4);line-height:1.7;font-weight:300}
.quote{padding:80px 64px;background:rgba(132,204,22,.06);border-top:1px solid rgba(132,204,22,.12);border-bottom:1px solid rgba(132,204,22,.12);position:relative;z-index:1;clip-path:polygon(0 3%,100% 0,100% 97%,0 100%)}
.quote q{font-size:clamp(18px,2.5vw,30px);font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:rgba(232,235,184,.65);line-height:1.4;max-width:720px;display:block;quotes:none}
.quote q .lime{color:#84cc16;text-shadow:0 0 12px rgba(132,204,22,.4)}
.cta-sec{padding:100px 64px;text-align:center;position:relative;z-index:1}
.cta-sec h2{font-size:clamp(44px,7vw,100px);font-weight:700;text-transform:uppercase;letter-spacing:-.02em;margin-bottom:16px;line-height:.9}
.cta-sec h2 .lime{color:#84cc16;text-shadow:0 0 30px rgba(132,204,22,.5);display:block}
.cta-sec p{font-size:15px;color:rgba(232,235,184,.35);margin-bottom:40px;letter-spacing:.12em;text-transform:uppercase}
footer{padding:24px 64px;border-top:2px solid rgba(132,204,22,.12);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}
.f-logo{font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#84cc16}
.f-copy{font-size:10px;color:rgba(232,235,184,.2);letter-spacing:.2em;text-transform:uppercase}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){nav{padding:0 24px;flex-wrap:wrap;height:auto;gap:4px;padding-top:8px;padding-bottom:8px}.hero{padding:100px 24px 60px}.hero-target{display:none}.stats{grid-template-columns:1fr}.stat{padding:24px;border-right:none;border-bottom:1px solid rgba(132,204,22,.08)}.features{padding:60px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px;clip-path:none}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:8px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo">{{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Gear</a><a href="#about">Mission</a><a href="#cta">Equip</a></div><span class="nav-badge">● Operational</span></nav>
<section class="hero"><div class="hero-grid"></div><div class="hero-target"><div class="target-ring t1"></div><div class="target-ring t2"></div><div class="target-ring t3"></div><div class="target-ring t4"></div><div class="target-cross"></div></div><div class="hero-inner"><div class="hero-tag">Mission Ready</div><h1>{{HEADLINE_A}}<br><span class="lime">{{HEADLINE_B}}</span><br><span class="thin">{{HEADLINE_C}}</span></h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">View Gear →</button></div></div></section>
<section class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></section>
<section class="features" id="features"><h2>Field <span class="lime">Tested</span></h2><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}} — <span class="lime">{{BRAND_NAME}}</span></q></section>
<section class="cta-sec" id="cta"><h2>Get<span class="lime">Equipped.</span></h2><p>{{FOOTER_TAGLINE}}</p><button class="btn" style="font-size:15px;padding:15px 56px">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">{{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025 · FIELD READY</div></footer>
</body></html>`,
  },

  // ── 45. CLOUD SAAS BLUE ───────────────────────
  {
    name: 'Cloud SaaS Blue', emoji: '☁️',
    keywords: ['cloud','saas','enterprise','platform','blue','modern','tech'],
    examples: ['Cloud platform service','Enterprise SaaS product','B2B software company'],
    theme: { bg:'#eff6ff', text:'#1e3a5f', sub:'rgba(30,58,95,0.55)', acc:'#3b82f6', border:'1px solid rgba(59,130,246,0.15)', cardBg:'#ffffff', headFont:"'Inter',sans-serif", bodyFont:"'Inter',sans-serif", headWeight:'800', headCase:'none', radius:'12px', btnBg:'#3b82f6', btnText:'#fff' },
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{BRAND_NAME}}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#eff6ff;color:#1e3a5f;font-family:'Inter',sans-serif;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 64px;height:64px;background:rgba(239,246,255,.94);backdrop-filter:blur(12px);border-bottom:1px solid rgba(59,130,246,.12);display:flex;align-items:center;justify-content:space-between}
.logo{font-size:19px;font-weight:800;color:#1e3a5f;letter-spacing:-.02em}
.logo-cloud{font-size:22px}
.nav-links{display:flex;gap:32px}
.nav-links a{color:rgba(30,58,95,.5);text-decoration:none;font-size:14px;font-weight:600;transition:color .15s}
.nav-links a:hover{color:#3b82f6}
.hero{padding:130px 64px 0;text-align:center;position:relative;overflow:hidden}
.hero-clouds{position:absolute;top:80px;left:0;right:0;height:120px;overflow:hidden;pointer-events:none}
.cloud{position:absolute;opacity:.25;font-size:80px;animation:drift var(--dur,20s) linear infinite}
.cloud:nth-child(1){left:-10%;--dur:18s;top:0;animation-delay:-5s}
.cloud:nth-child(2){left:20%;--dur:24s;top:20px;animation-delay:-12s;font-size:50px;opacity:.15}
.cloud:nth-child(3){left:60%;--dur:20s;top:5px;animation-delay:-8s;font-size:60px}
.cloud:nth-child(4){left:85%;--dur:16s;top:25px;animation-delay:-3s;font-size:40px;opacity:.2}
.hero-inner{position:relative;z-index:1;padding-bottom:60px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:#dbeafe;border:1px solid #bfdbfe;border-radius:100px;padding:6px 18px;font-size:12px;font-weight:700;color:#1d4ed8;margin-bottom:28px}
h1{font-size:clamp(40px,6vw,76px);font-weight:900;line-height:1.05;letter-spacing:-.04em;max-width:780px;margin:0 auto 20px;animation:fadeUp .7s ease forwards}
h1 span{color:#3b82f6}
.sub{font-size:18px;color:rgba(30,58,95,.55);line-height:1.7;max-width:520px;margin:0 auto 44px}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{padding:14px 36px;background:#3b82f6;color:#fff;border:none;border-radius:10px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 20px rgba(59,130,246,.3)}
.btn:hover{background:#2563eb;transform:translateY(-1px);box-shadow:0 8px 28px rgba(59,130,246,.4)}
.btn2{padding:14px 28px;background:#fff;color:#1e3a5f;border:1px solid rgba(30,58,95,.12);border-radius:10px;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s}
.btn2:hover{border-color:#3b82f6;color:#3b82f6}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:60px;background:transparent}
.stat{background:#fff;border-radius:16px;padding:36px;text-align:center;box-shadow:0 4px 20px rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.1);border-top:3px solid #3b82f6}
.stat-n{font-size:44px;font-weight:900;color:#3b82f6;letter-spacing:-.04em;line-height:1}
.stat-l{font-size:13px;color:rgba(30,58,95,.45);font-weight:600;margin-top:8px}
.features{padding:60px;max-width:1200px;margin:0 auto}
.features h2{font-size:clamp(28px,4vw,48px);font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-.03em}
.features h2 span{color:#3b82f6}
.features-sub{text-align:center;color:rgba(30,58,95,.45);font-size:16px;margin-bottom:52px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:1px solid rgba(59,130,246,.1);border-radius:16px;padding:32px;transition:all .25s;box-shadow:0 2px 10px rgba(59,130,246,.06)}
.card:hover{box-shadow:0 12px 36px rgba(59,130,246,.12);transform:translateY(-4px);border-color:rgba(59,130,246,.2)}
.card-ico{font-size:28px;display:block;margin-bottom:16px}
.card h3{font-size:18px;font-weight:700;margin-bottom:10px;letter-spacing:-.01em;color:#1e3a5f}
.card p{font-size:14px;color:rgba(30,58,95,.45);line-height:1.75}
.quote{padding:80px 60px;text-align:center;background:#fff;border-top:1px solid rgba(59,130,246,.1);border-bottom:1px solid rgba(59,130,246,.1)}
.quote q{font-size:clamp(18px,2.5vw,26px);font-weight:700;color:#1e3a5f;line-height:1.6;max-width:660px;display:inline-block;quotes:none;letter-spacing:-.01em}
.cta-sec{padding:100px 60px;text-align:center;background:linear-gradient(135deg,#1e3a5f,#3b82f6);color:#fff}
.cta-sec h2{font-size:clamp(32px,5vw,60px);font-weight:900;letter-spacing:-.04em;margin-bottom:16px;color:#fff}
.cta-sec p{font-size:16px;color:rgba(255,255,255,.7);margin-bottom:40px}
.cta-sec .btn{background:#fff;color:#1e3a5f;box-shadow:0 8px 24px rgba(0,0,0,.15)}
.cta-sec .btn:hover{background:#eff6ff}
footer{padding:32px 64px;background:#1e3a5f;display:flex;justify-content:space-between;align-items:center}
.f-logo{font-size:16px;font-weight:800;color:#fff}
.f-logo span{color:#93c5fd}
.f-copy{font-size:13px;color:rgba(255,255,255,.35)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(120vw)}}
@media(max-width:768px){nav{padding:0 24px}.hero{padding:110px 24px 0}.stats{grid-template-columns:1fr;padding:40px 24px;gap:16px}.features{padding:40px 24px}.grid{grid-template-columns:1fr}.quote{padding:60px 24px}.cta-sec{padding:60px 24px}footer{flex-direction:column;gap:10px;padding:24px;text-align:center}}
</style></head><body>
<nav><div class="logo"><span class="logo-cloud">☁️</span> {{BRAND_NAME}}</div><div class="nav-links"><a href="#features">Platform</a><a href="#about">Pricing</a><a href="#cta">Start free</a></div></nav>
<section class="hero"><div class="hero-clouds"><div class="cloud">☁</div><div class="cloud">☁</div><div class="cloud">☁</div><div class="cloud">☁</div></div><div class="hero-inner"><div class="hero-badge">☁️ Cloud-Native Platform</div><h1>{{HEADLINE_A}} <span>{{HEADLINE_B}}</span> {{HEADLINE_C}}</h1><p class="sub">{{SUBHEADLINE}}</p><div class="btns"><button class="btn">{{CTA_TEXT}}</button><button class="btn2">View demo →</button></div></div></section>
<div class="stats"><div class="stat"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div><div class="stat"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div></div>
<section class="features" id="features"><h2>Built for <span>Scale</span></h2><p class="features-sub">Enterprise-grade cloud infrastructure for every team</p><div class="grid"><div class="card"><span class="card-ico">{{FEAT_1_ICON}}</span><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_2_ICON}}</span><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div><div class="card"><span class="card-ico">{{FEAT_3_ICON}}</span><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div></div></section>
<section class="quote"><q>{{QUOTE}}</q></section>
<section class="cta-sec" id="cta"><h2>Launch in the cloud today</h2><p>{{FOOTER_TAGLINE}}</p><button class="btn">{{CTA_TEXT}}</button></section>
<footer><div class="f-logo">☁️ {{BRAND_NAME}}</div><div class="f-copy">{{FOOTER_TAGLINE}} · © {{BRAND_NAME}} 2025</div></footer>
</body></html>`,
  },
]

const CONTENT_PROMPT = (brand, pages = 1) => {
  const page2Fields = pages >= 2 ? `,
  "ABOUT_HEADLINE": "compelling about/story heading (4-8 words)",
  "ABOUT_BODY": "2-3 sentences about brand origin and mission, 30-40 words total",
  "VALUE_1_TITLE": "core value or pillar name (2-4 words)",
  "VALUE_1_DESC": "one sentence, 12-18 words, specific belief or benefit",
  "VALUE_2_TITLE": "second value (2-4 words)",
  "VALUE_2_DESC": "one sentence, 12-18 words",
  "VALUE_3_TITLE": "third value (2-4 words)",
  "VALUE_3_DESC": "one sentence, 12-18 words"` : ''

  const page3Fields = pages >= 3 ? `,
  "PRICING_HEADLINE": "pricing section headline (4-8 words)",
  "PLAN_1_NAME": "starter plan name (1-2 words)",
  "PLAN_1_PRICE": "e.g. Free or $9/mo",
  "PLAN_1_DESC": "one line — who this plan is for",
  "PLAN_1_F1": "feature (5-8 words)", "PLAN_1_F2": "feature (5-8 words)", "PLAN_1_F3": "feature (5-8 words)",
  "PLAN_2_NAME": "popular/pro plan name (1-2 words)",
  "PLAN_2_PRICE": "e.g. $49/mo",
  "PLAN_2_DESC": "one line — who this plan is for",
  "PLAN_2_F1": "feature", "PLAN_2_F2": "feature", "PLAN_2_F3": "feature",
  "PLAN_3_NAME": "enterprise/top plan name (1-2 words)",
  "PLAN_3_PRICE": "e.g. $199/mo or Custom",
  "PLAN_3_DESC": "one line — who this plan is for",
  "PLAN_3_F1": "feature", "PLAN_3_F2": "feature", "PLAN_3_F3": "feature"` : ''

  return `Generate website content for: "${brand}"

Return ONLY this exact JSON (no markdown, no explanation):
{
  "BRAND_NAME": "short brand name (2-3 words max)",
  "HEADLINE_A": "first line of hero headline (1-3 strong words, all caps style)",
  "HEADLINE_B": "second line — the most impactful phrase (2-4 words)",
  "HEADLINE_C": "third line (1-3 words, completes the thought)",
  "SUBHEADLINE": "one compelling sentence, 15-20 words, specific to this brand",
  "CTA_TEXT": "2-3 word action (e.g. Get Started, Book Now, Join Free)",
  "STAT_1_NUM": "impressive number (e.g. 2.4K, 98, 500)",
  "STAT_1_LABEL": "what that number means (3-5 words)",
  "STAT_2_NUM": "impressive number",
  "STAT_2_LABEL": "what that number means",
  "STAT_3_NUM": "impressive number",
  "STAT_3_LABEL": "what that number means",
  "FEAT_1_ICON": "single relevant emoji",
  "FEAT_1_TITLE": "feature name (2-4 words)",
  "FEAT_1_DESC": "one sentence description, 15-20 words, specific benefit",
  "FEAT_2_ICON": "single relevant emoji",
  "FEAT_2_TITLE": "feature name (2-4 words)",
  "FEAT_2_DESC": "one sentence description, 15-20 words, specific benefit",
  "FEAT_3_ICON": "single relevant emoji",
  "FEAT_3_TITLE": "feature name (2-4 words)",
  "FEAT_3_DESC": "one sentence description, 15-20 words, specific benefit",
  "QUOTE": "a punchy brand mission statement, 10-15 words, no clichés",
  "FOOTER_TAGLINE": "3-6 word brand tagline"${page2Fields}${page3Fields}
}`
}

// ─────────────────────────────────────────────
// Multi-page section generator
// Injects About (page 2) and Pricing (page 3) sections styled to match the template theme
// ─────────────────────────────────────────────
function makeExtendedSections(template, content, pages) {
  const t = template.theme || {}
  const DEFAULTS = {
    ABOUT_HEADLINE: `Built on purpose, driven by passion`,
    ABOUT_BODY: `We started with a simple belief: that great work deserves great tools. Since day one, we've been obsessed with building something that actually makes a difference — for our customers, our community, and the world we share.`,
    VALUE_1_TITLE: 'Quality First', VALUE_1_DESC: 'Every detail is crafted with intention — we never ship anything we wouldn\'t proudly use ourselves.',
    VALUE_2_TITLE: 'People Driven', VALUE_2_DESC: 'Our customers are at the heart of every decision we make, from product to support.',
    VALUE_3_TITLE: 'Always Evolving', VALUE_3_DESC: 'We treat every release as a starting point, not a finish line — always learning, always improving.',
    PRICING_HEADLINE: 'Simple, transparent pricing',
    PLAN_1_NAME: 'Starter', PLAN_1_PRICE: 'Free', PLAN_1_DESC: 'Perfect for individuals and small projects',
    PLAN_1_F1: 'Up to 3 projects', PLAN_1_F2: 'Core features included', PLAN_1_F3: 'Community support',
    PLAN_2_NAME: 'Pro', PLAN_2_PRICE: '$49/mo', PLAN_2_DESC: 'For growing teams who need more power',
    PLAN_2_F1: 'Unlimited projects', PLAN_2_F2: 'Advanced analytics', PLAN_2_F3: 'Priority support',
    PLAN_3_NAME: 'Enterprise', PLAN_3_PRICE: 'Custom', PLAN_3_DESC: 'Tailored solutions for large organizations',
    PLAN_3_F1: 'Custom integrations', PLAN_3_F2: 'Dedicated account manager', PLAN_3_F3: 'SLA guarantee',
  }
  const get = (key, fallback) => {
    if (content[key] != null && String(content[key]).trim() !== '') return String(content[key])
    if (DEFAULTS[key] != null) return DEFAULTS[key]
    return fallback ?? ''
  }

  const labelSt  = `font-size:11px;color:${t.acc};letter-spacing:.2em;text-transform:uppercase;font-family:${t.bodyFont};margin-bottom:16px;display:block`
  const h2St     = `font-family:${t.headFont};font-size:clamp(36px,5vw,64px);font-weight:${t.headWeight};color:${t.text};text-transform:${t.headCase};line-height:1.02`
  const bodySt   = `font-size:15px;color:${t.sub};line-height:1.8;font-family:${t.bodyFont};font-weight:300`
  const h3St     = `font-family:${t.headFont};font-size:19px;font-weight:${t.headWeight};color:${t.text};margin-bottom:8px;text-transform:${t.headCase};line-height:1.2`
  const secSt    = `padding:100px 60px;background:${t.bg};border-top:${t.border};position:relative;z-index:1;overflow:hidden`
  const cardBase = `padding:36px 28px;background:${t.cardBg};border:${t.border};border-radius:${t.radius}`
  const featCard = `padding:36px 28px;background:transparent;border:2px solid ${t.acc};border-radius:${t.radius};position:relative`

  let html = ''

  // ── Page 2: About ──────────────────────────
  if (pages >= 2) {
    html += `
<section id="about-page" style="${secSt}">
  <div style="display:grid;grid-template-columns:1fr auto;align-items:start;gap:40px;margin-bottom:48px">
    <div>
      <span style="${labelSt}">About Us</span>
      <h2 style="${h2St};max-width:640px;margin-bottom:24px">${get('ABOUT_HEADLINE', 'Our Story')}</h2>
      <p style="${bodySt};max-width:560px">${get('ABOUT_BODY')}</p>
    </div>
    <div aria-hidden="true" style="font-family:${t.headFont};font-size:clamp(100px,14vw,200px);font-weight:${t.headWeight};color:${t.acc};opacity:.08;line-height:1;user-select:none;flex-shrink:0">02</div>
  </div>
  <hr style="border:none;border-top:${t.border};margin-bottom:48px"/>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:${t.border};border-radius:${t.radius};overflow:hidden;margin-bottom:64px">
    ${[1,2,3].map(n=>`<div style="padding:36px 28px;border-right:${n<3?t.border:'none'};text-align:center">
      <div style="font-family:${t.headFont};font-size:44px;font-weight:${t.headWeight};color:${t.acc};line-height:1;margin-bottom:8px">${get(`STAT_${n}_NUM`)}</div>
      <div style="font-size:12px;color:${t.sub};letter-spacing:.15em;text-transform:uppercase;font-family:${t.bodyFont}">${get(`STAT_${n}_LABEL`)}</div>
    </div>`).join('')}
  </div>
  <span style="${labelSt}">What We Stand For</span>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:28px">
    ${[1,2,3].map(n=>`<div style="${cardBase}">
      <div style="font-family:${t.headFont};font-size:36px;font-weight:${t.headWeight};color:${t.acc};opacity:.25;line-height:1;margin-bottom:16px;text-transform:${t.headCase}">0${n}</div>
      <h3 style="${h3St}">${get(`VALUE_${n}_TITLE`)}</h3>
      <p style="${bodySt};font-size:14px">${get(`VALUE_${n}_DESC`)}</p>
    </div>`).join('')}
  </div>
</section>`
  }

  // ── Page 3: Pricing ────────────────────────
  if (pages >= 3) {
    html += `
<section id="pricing-page" style="${secSt}">
  <div style="text-align:center;margin-bottom:64px">
    <span style="${labelSt};display:inline-block">Pricing</span>
    <h2 style="${h2St};margin-bottom:14px">${get('PRICING_HEADLINE', 'Simple Pricing')}</h2>
    <p style="${bodySt};max-width:440px;margin:0 auto">Transparent pricing. No hidden fees. Cancel anytime.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;max-width:1040px;margin:0 auto 32px">
    ${[1,2,3].map(n=>{
      const feat = n===2
      return `<div style="${feat?featCard:cardBase};text-align:center">
      ${feat?`<div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:${t.acc};color:${t.btnText||'#fff'};font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 20px;border-radius:100px;font-family:${t.bodyFont};white-space:nowrap">★ Most Popular</div>`:''}
      <div style="padding:24px 0 16px;border-bottom:${t.border};margin-bottom:20px">
        <h3 style="${h3St};margin-bottom:0">${get(`PLAN_${n}_NAME`)}</h3>
      </div>
      <div style="font-family:${t.headFont};font-size:52px;font-weight:${t.headWeight==='300'?'300':'700'};color:${feat?t.acc:t.text};line-height:1;margin-bottom:10px">${get(`PLAN_${n}_PRICE`)}</div>
      <p style="${bodySt};font-size:13px;margin-bottom:20px">${get(`PLAN_${n}_DESC`)}</p>
      <hr style="border:none;border-top:${t.border};margin-bottom:20px"/>
      <ul style="list-style:none;margin-bottom:28px;text-align:left">
        ${[1,2,3].map(f=>`<li style="padding:9px 0;border-bottom:${t.border};font-size:13px;color:${t.sub};font-family:${t.bodyFont};display:flex;gap:10px;align-items:flex-start"><span style="color:${t.acc};flex-shrink:0;font-weight:700">✓</span>${get(`PLAN_${n}_F${f}`)}</li>`).join('')}
      </ul>
      <button style="width:100%;padding:13px 0;background:${feat?t.btnBg:'transparent'};color:${feat?t.btnText:t.acc};border:2px solid ${feat?'transparent':t.acc};border-radius:${t.radius};font-family:${t.bodyFont};font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer">${feat?'→ ':''}Get ${get(`PLAN_${n}_NAME`,'Started')}</button>
    </div>`}).join('')}
  </div>
  <p style="text-align:center;font-size:13px;color:${t.sub};font-family:${t.bodyFont}">All plans include a 14-day free trial.</p>
</section>`
  }

  // ── Inject nav links via inline script ─────
  if (pages >= 2) {
    html += `
<script>(function(){
  var nl=document.querySelector('.nav-links');
  if(!nl)return;
  ${pages >= 2 ? `var a1=document.createElement('a');a1.href='#about-page';a1.textContent='About';nl.appendChild(a1);` : ''}
  ${pages >= 3 ? `var a2=document.createElement('a');a2.href='#pricing-page';a2.textContent='Pricing';nl.appendChild(a2);` : ''}
})()+"";<\/script>`
  }

  return html
}
