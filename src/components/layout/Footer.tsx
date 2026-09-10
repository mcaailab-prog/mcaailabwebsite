import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaEnvelope} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <Image
                                  src="/maseno.png"
                                  alt="MCAAI Logo"
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-contain"
                                  priority
                                />
                                <Image
                src="/MCAAI.png"
                alt="MCAAI Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-headline-lg text-[22px] font-bold text-white">
                MCAAI
              </span>
            </Link>

            <p className="font-body-md text-[14px] text-inverse-on-surface/70 max-w-xs leading-relaxed">
              Harnessing AI for community-driven innovations. Positioning Maseno University at the forefront of AI research in Africa.
            </p>

            <div className="flex gap-3 ">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-inverse-on-surface/60 hover:text-mcaai-teal hover:border-mcaai-teal transition-colors">
                <FaTwitter size={16} />
              </a>
              <a href="https://www.linkedin.com/company/maseno-centre-for-applied-artificial-intelligence/posts/?feedView=all" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-inverse-on-surface/60 hover:text-mcaai-teal hover:border-mcaai-teal transition-colors">
                <FaLinkedin size={16} />
              </a>
              <a href="mailto:mcaai@maseno.ac.ke" aria-label="Email" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-inverse-on-surface/60 hover:text-mcaai-teal hover:border-mcaai-teal transition-colors">
                <FaEnvelope size={16} />
              </a>
             
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h5 className="font-label-sm text-label-sm text-white/50 uppercase tracking-widest mb-5">
              Explore
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Research', href: '/research' },
                { label: 'Projects', href: '/projects' },
                { label: 'Publications', href: '/publications' },
                { label: 'Datasets', href: '/datasets' },
                { label: 'Team', href: '/team' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body-md text-[14px] text-inverse-on-surface/60 hover:text-mcaai-teal transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h5 className="font-label-sm text-label-sm text-white/50 uppercase tracking-widest mb-5">
              Contact
            </h5>
            <div className="space-y-2 font-body-md text-[14px] text-inverse-on-surface/60">
              <p>Maseno University, Main Campus</p>
              <p>Kisumu-Busia Road, Kenya</p>
              <a
                href="mailto:mcaai@maseno.ac.ke"
                className="block hover:text-mcaai-teal transition-colors"
              >
                mcaai@maseno.ac.ke
              </a>
            </div>

            <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="font-label-sm text-label-sm text-mcaai-teal mb-1">
                Center Director
              </p>
              <p className="font-body-md text-[14px] text-white">
                Dr. Lilian Wanzare
              </p>
              <a
                href="mailto:mcaai@maseno.ac.ke"
                className="flex gap-2 font-body-md text-[14px] text-white text-decoration-underline hover:text-mcaai-teal transition-colors"
              >
                mcaai@maseno.ac.ke
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-label-sm text-label-sm text-inverse-on-surface/40 text-center md:text-left">
            © 2026 Maseno Centre for Applied Artificial Intelligence. A Maseno University Centre of Excellence.
          </p>
          
        </div>

      </div>
    </footer>
  );
}