import { ShieldCheck, Wallet, Users, CheckCircle2, Layers } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Products Checked Before Shipping",
    subtitle: "Confidence in the quality of every item",
  },
  {
    icon: Wallet,
    title: "Secure Payment Holding",
    subtitle: "Your payment is transferred once you receive the product",
  },
  {
    icon: Users,
    title: "Buy and Sell with Real Users",
    subtitle: "A trusted community for tech enthusiasts",
  },
];

export default function AuthAside() {
  return (
    <div className="hidden flex-col justify-center px-10 py-12 lg:flex">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
        <h1 className="text-5xl font-black leading-tight">
          กลับเข้าสู่ <span className="">SPEC</span>
          <span className="text-[#f97316]">HUB</span>
        </h1>

        <div className="grid grid-cols-3 divide-x divide-[#525252] gap-6">
          {FEATURES.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex flex-col items-start gap-2 pl-4 first:pl-0"
            >
              <Icon className="h-9 w-9 text-[#f97316]" strokeWidth={1.75} />
              <p className="text-sm font-bold leading-snug">{title}</p>
              <p className="hardware-label normal-case text-secondary">
                {subtitle}
              </p>
            </div>
          ))}
        </div>

        <div className="hardware-shadow relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-box">
          <img
            src="https://dlcdnwebimgs.asus.com/files/media/f39b732e-8739-4a6d-b1ce-c826273832d3/v2/img/kv/pd.png"
            alt="RTX 4070 Super"
            className="absolute z-0 w-5/6 drop-shadow-[0_25px_10px_rgba(0,0,0,0.5)]"
          />

          <div className="absolute bottom-6 right-5 flex items-center gap-2 rounded-field px-5 py-5 text-[#ffffff] bg-[#f97316] shadow-lg/50 z-10">
            <ShieldCheck className="h-12 w-12" />
            <div className="leading-tight">
              <p className="text-xl font-bold">SPEC CHECK</p>
              <p className="text-[11px] opacity-90">Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
