const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

    :root {
      --blue:    #38a7fb;
      --green:   #48c378;
      --yellow:  #fdbe2d;
      --red:     #e94542;
      --pink:    #e9589a;
      --dark:    #1a1a2e;
      --bg:      #f0f6ff;
      --white:   #ffffff;
      --border:  #e0e8f0;
      --text-muted: #888;
      --input-bg: #f8fafd;
      --shadow-card: 0 4px 20px rgba(0,0,0,.08);
      --radius-card: 22px;
      --radius-input: 12px;
      --radius-btn: 14px;
      --gradient-top: linear-gradient(90deg, #38a7fb 0%, #48c378 33%, #fdbe2d 66%, #e94542 100%);
      --transition: .18s ease;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { width: 100%; min-height: 100vh; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Nunito', sans-serif; background: var(--bg); min-height: 100vh; color: var(--dark); overflow-x: hidden; }

    .accent-bar { height: 5px; background: var(--gradient-top); position: fixed; top: 0; left: 0; right: 0; width: 100%; z-index: 1000; }

    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 13px; font-weight: 700; color: #555; }
    .field input, .field select { width: 100%; padding: 13px 16px; border: 1.5px solid var(--border); border-radius: var(--radius-input); font-family: 'Nunito', sans-serif; font-size: 14px; color: var(--dark); background: var(--input-bg); outline: none; transition: border-color var(--transition), box-shadow var(--transition); }
    .field input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(56,167,251,.12); background: var(--white); }
    .field input::placeholder { color: #b0bec5; }

    .btn { width: 100%; padding: 15px; border: none; border-radius: var(--radius-btn); font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer; transition: transform var(--transition), box-shadow var(--transition), opacity var(--transition); display: block; text-align: center; text-decoration: none; }
    .btn:hover { opacity: .9; transform: translateY(-1px); }
    .btn:active { transform: scale(.97); }
    .btn-blue  { background: linear-gradient(135deg, #38a7fb 0%, #1a7ecc 100%); color: #fff; box-shadow: 0 6px 20px rgba(56,167,251,.38); }
    .btn-green { background: linear-gradient(135deg, #48c378 0%, #2ea05e 100%); color: #fff; box-shadow: 0 6px 20px rgba(72,195,120,.38); }
    .btn-outline-blue { background: transparent; color: var(--blue); border: 2px solid var(--blue); }
    .btn-outline-red  { background: transparent; color: var(--red);  border: 2px solid var(--red); }

    .card { background: var(--white); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }

    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: var(--white); border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 8px; z-index: 900; }
    .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 8px 4px; border-radius: 12px; transition: opacity var(--transition); text-decoration: none; }
    .nav-icon { width: 30px; height: 30px; border-radius: 50%; background: #e0eaf2; display: flex; align-items: center; justify-content: center; position: relative; }
    .nav-icon.active { background: var(--dark); }
    .nav-icon svg { width: 16px; height: 16px; fill: #aaa; }
    .nav-icon.active svg { fill: #fff; }
    .nav-label { font-size: 9px; font-weight: 800; color: #bbb; text-transform: uppercase; letter-spacing: .5px; }
    .nav-item.active .nav-label { color: var(--dark); }

    .avatar-upload { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 4px; }
    .avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: #f0f6ff; border: 2px dashed var(--blue); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 28px; transition: background var(--transition); }
    .avatar-circle:hover { background: #e0f0ff; }
    .avatar-label { font-size: 12px; font-weight: 700; color: var(--blue); }

    .steps { display: flex; align-items: center; justify-content: center; gap: 6px; }
    .step-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); }
    .step-dot.done   { background: var(--green); }
    .step-dot.active { background: var(--blue); }
    .step-line { width: 28px; height: 3px; border-radius: 99px; background: var(--border); }

    .divider-row { display: flex; align-items: center; gap: 10px; }
    .divider-row::before, .divider-row::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .divider-row span { font-size: 12px; color: #aaa; font-weight: 600; white-space: nowrap; }

    .btn-social { width: 100%; padding: 12px 16px; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; border: none; transition: transform var(--transition), opacity var(--transition), box-shadow var(--transition); }
    .btn-social:hover { opacity: .9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
    .btn-social:active { transform: scale(.97); }
    .btn-social svg { width: 20px; height: 20px; flex-shrink: 0; }
    .btn-facebook { background: #1877F2; color: #fff; }
    .btn-google   { background: #fff; color: #444; border: 1.5px solid var(--border); }
    .btn-apple    { background: var(--dark); color: #fff; }

    .profile-tabs { display: flex; background: #e0eaf0; border-radius: 16px; padding: 4px; }
    .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; transition: all var(--transition); background: transparent; color: #888; letter-spacing: .5px; }
    .tab-btn.active { background: var(--white); color: var(--dark); box-shadow: 0 2px 8px rgba(0,0,0,.1); }

    .module-card { background: var(--white); border-radius: var(--radius-card); padding: 20px 12px 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: transform var(--transition), box-shadow var(--transition); box-shadow: var(--shadow-card); border: 2px solid transparent; position: relative; overflow: hidden; text-decoration: none; }
    .module-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 4px; border-radius: 0 0 20px 20px; }
    .module-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,.12); }
    .module-card:active { transform: scale(.97); }
    .card-blue::after   { background: var(--blue);   } .card-blue  .icon-bg { background: #e8f4ff; }
    .card-green::after  { background: var(--green);  } .card-green .icon-bg { background: #e8f9ef; }
    .card-pink::after   { background: var(--pink);   } .card-pink  .icon-bg { background: #fff0f7; }
    .card-red::after    { background: var(--red);    } .card-red   .icon-bg { background: #ffecec; }
    .card-yellow::after { background: var(--yellow); } .card-yellow .icon-bg { background: #fff8e1; }
    .card-dark::after   { background: var(--dark);   } .card-dark  .icon-bg { background: #eef0f5; }
    .icon-bg { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
    .card-label { font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: var(--dark); text-align: center; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #dde; border-radius: 99px; }

    .text-center { text-align: center; }
    .mt-4  { margin-top: 4px; }
    .mt-8  { margin-top: 8px; }
    .mt-12 { margin-top: 12px; }
    .mt-16 { margin-top: 16px; }
    .footer-link { text-align: center; font-size: 13px; color: #aaa; font-weight: 600; }
    .footer-link a, .footer-link span.link { color: var(--blue); font-weight: 800; cursor: pointer; text-decoration: none; }
    .footer-link a:hover, .footer-link span.link:hover { text-decoration: underline; }

    @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes float4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
    @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(56,167,251,.4)} 50%{box-shadow:0 0 0 12px rgba(56,167,251,0)} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }

    /* ══ DESKTOP ══ */
    @media (min-width: 768px) {
      .bottom-nav { display: none; }
      .desktop-sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 240px; background: var(--white); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 0 16px; z-index: 100; }
      .sidebar-logo { display: flex; align-items: center; gap: 12px; padding: 0 20px 24px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
      .sidebar-logo-name { font-size: 22px; font-weight: 900; letter-spacing: 3px; color: var(--dark); text-transform: uppercase; }
      .sidebar-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; font-size: 14px; font-weight: 800; color: #777; text-decoration: none; transition: background var(--transition), color var(--transition); border-left: 3px solid transparent; }
      .sidebar-nav-item:hover { background: #f4f8ff; color: var(--dark); }
      .sidebar-nav-item.active { background: #e8f4ff; color: var(--blue); border-left-color: var(--blue); }
      .sidebar-nav-item svg { width: 20px; height: 20px; fill: currentColor; flex-shrink: 0; }
      .sidebar-spacer { flex: 1; }
      .sidebar-user { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
      .sidebar-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #fff; font-weight: 900; flex-shrink: 0; }
      .sidebar-user-name { font-size: 13px; font-weight: 800; color: var(--dark); }
      .sidebar-user-role { font-size: 11px; color: #aaa; font-weight: 600; }
      .main-content { margin-left: 240px; min-height: 100vh; }
      .page-wrapper { max-width: 980px; margin: 0 auto; padding: 40px 32px 40px; }
      .page-header { margin-bottom: 28px; }
      .page-title { font-size: 28px; font-weight: 900; color: var(--dark); letter-spacing: -.5px; }
      .page-subtitle { font-size: 14px; color: #888; font-weight: 600; margin-top: 4px; }
      .form-card { background: var(--white); border-radius: 28px; padding: 36px; box-shadow: var(--shadow-card); max-width: 560px; margin: 0 auto; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .col-span-2 { grid-column: span 2; }
      .auth-desktop { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
      .auth-left { background: linear-gradient(135deg, #0e2d52 0%, #1a4a8a 50%, #38a7fb 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 48px; color: #fff; position: relative; overflow: hidden; }
      .auth-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 70%, rgba(72,195,120,.25) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(253,190,45,.15) 0%, transparent 50%); }
      .auth-left-content { position: relative; z-index: 1; text-align: center; }
      .auth-brand { font-size: 52px; font-weight: 900; letter-spacing: 8px; margin-bottom: 8px; }
      .auth-tagline { font-size: 16px; font-weight: 600; opacity: .8; max-width: 280px; line-height: 1.6; }
      .auth-right { display: flex; align-items: center; justify-content: center; padding: 40px 48px; background: #f6faff; }
      .auth-right-inner { width: 100%; max-width: 420px; }
      .auth-title { font-size: 28px; font-weight: 900; color: var(--dark); margin-bottom: 6px; }
      .auth-sub { font-size: 14px; color: #888; font-weight: 600; margin-bottom: 28px; }
    }

    /* ══ MOBILE ONLY ══ */
    @media (max-width: 767px) {
      .desktop-sidebar { display: none; }
      .desktop-only { display: none !important; }
      .main-content { margin-left: 0; }
      .page-wrapper { padding: 16px 16px 88px; }
      .auth-left { display: none; }
      .auth-right { padding: 0; background: transparent; display: block; }
      .auth-right-inner { max-width: 100%; }
      .auth-desktop { display: block; }
      .form-card { padding: 0; box-shadow: none; border-radius: 0; }
      .grid-2 { grid-template-columns: 1fr; gap: 14px; }
      .col-span-2 { grid-column: span 1; }
    }

    /* ── Full-screen layout fix ── */
    .fullscreen-page { width: 100vw; min-height: 100vh; overflow-x: hidden; }
    .fullscreen-split { display: flex; width: 100vw; min-height: 100vh; }
    .split-left { flex: 1; min-width: 0; }
    .split-right { width: 480px; flex-shrink: 0; }
    @media (max-width: 767px) { .split-right { width: 100%; } }
  `}</style>
);

export default GlobalStyle;