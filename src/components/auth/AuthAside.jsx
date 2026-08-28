function AuthAside() {
  return (
    <div className="hidden flex-col justify-center gap-10 bg-base-100 px-12 py-12 lg:flex">
      <h1 className="text-4xl font-black leading-tight">
        กลับเข้าสู่ <span className="text-accent">SPECHUB</span>
      </h1>

      <div className="matte hardware-shadow relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-box">
        <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-field bg-accent px-4 py-2 text-accent-content shadow-lg">
          <div className="leading-tight">
            <p className="text-sm font-bold">SPEC CHECK</p>
            <p className="text-[11px] opacity-90">ตรวจสอบแล้ว</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthAside;
