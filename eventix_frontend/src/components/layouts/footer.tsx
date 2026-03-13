import { Link } from "react-router-dom";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Calendar,
    Music,
    Users,
    Ticket,

    ShieldCheck,
    Globe
} from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        events: [
            { name: "Concerts", href: "/events/concerts", icon: Music },
            { name: "Festivals", href: "/events/festivals", icon: Calendar },
            { name: "Sports", href: "/events/sports", icon: Ticket },
            { name: "Theater", href: "/events/theater", icon: Users },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Careers", href: "/careers" },
            { name: "Press", href: "/press" },
        ],
        support: [
            { name: "Help Center", href: "/help" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Refund Policy", href: "/refund" },
        ],
    };

    return (
        <footer className="relative bg-[#0A0000] border-t border-white/5 pt-20 pb-10 overflow-hidden">
            {/* Subtle Radial Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#FF3333]/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#FF3333]/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF3333] to-[#990000] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF3333]/20">
                                <Ticket className="h-5 w-5 text-white rotate-12" />
                            </div>
                            <span className="text-2xl font-bold tracking-tighter text-white font-heading">
                                EVENT<span className="text-[#FF3333]">IX</span>
                            </span>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed max-w-sm font-light italic">
                            Redefining the standard of premium event management. From executive summits to global festivals, we deliver unparalleled sophistication.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <Link key={i} to="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#FF3333] hover:border-[#FF3333]/50 transition-all">
                                    <Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF3333]">Categories</h4>
                        <ul className="space-y-4">
                            {footerLinks.events.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-px bg-[#FF3333] transition-all mr-0 group-hover:mr-2"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF3333]">Company</h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-px bg-[#FF3333] transition-all mr-0 group-hover:mr-2"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter/Contact Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF3333]">Newsletter</h4>
                        <p className="text-sm text-white/60 font-light">Get early access to premium event releases.</p>
                        <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl focus-within:border-[#FF3333]/50 transition-all">
                            <input
                                type="email"
                                placeholder="Your email..."
                                className="bg-transparent border-none focus:ring-0 text-sm px-3 w-full text-white placeholder:text-white/20"
                            />
                            <button className="bg-[#FF3333] hover:bg-[#CC0000] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors">
                                Join
                            </button>
                        </div>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-[#FF3333]" />
                                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-[#FF3333]" />
                                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Global</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] text-white/30 uppercase tracking-widest">
                        © {currentYear} EVENTIX INC. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-8">
                        {['Privacy', 'Terms', 'Cookies'].map((text) => (
                            <Link key={text} to="#" className="text-[11px] uppercase tracking-widest text-white/30 hover:text-[#FF3333] transition-colors">
                                {text}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}