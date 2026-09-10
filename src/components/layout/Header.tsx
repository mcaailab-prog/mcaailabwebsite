'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import MobileMenu from './MobileMenu';
import { FaHome, FaHandshake, FaProjectDiagram, FaBook, FaInfoCircle, FaUsers, FaFlask } from 'react-icons/fa';
import { MdDataset } from 'react-icons/md';
import UniversalFormModal from '@/components/ui/UniversalFormModal';
import MCAAIApplicationForm from '@/components/forms/MCAAIApplicationForm';
import PartnershipForm from '@/components/forms/PartnershipForm';

interface NavItem {
  label: string;
  href: string;
  submenu?: NavItem[];
}

const navigationItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    submenu: [
      { label: 'About MCAAI', href: '/about' },
      { label: 'Team', href: '/team' },
    ],
  },
  {
    label: 'Research',
    href: '/research',
    submenu: [
      { label: 'Our research areas', href: '/research' },
      { label: 'Projects', href: '/projects' },
      { label: 'Publications', href: '/research/publications' },
      { label: 'Collaborations', href: '/research/collaborations' },
      { label: 'Datasets', href: '/datasets' },
    ],
  },
  { label: 'Innovations', href: '/innovations' },
  { label: 'News & Events', href: '/news' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const NavItem = ({
  item,
  openDropdown,
  setOpenDropdown,
  handleNavClick,
  isHeaderDark,
}: {
  item: NavItem;
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  isHeaderDark: boolean;
}) => {
  const isOpen = openDropdown === item.label;
  const baseTextClass = isHeaderDark
    ? 'text-white hover:text-white/95 hover:bg-white/10'
    : 'text-white hover:text-white/95 hover:bg-white/10';

  return (
    <div className="relative group">
      <Link
        href={item.href}
        onClick={(e) => {
          if (item.submenu) { e.preventDefault(); return; }
          handleNavClick(e, item.href);
        }}
        replace
        scroll={false}
        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 whitespace-nowrap ${
            openDropdown === item.label
              ? 'text-white bg-gradient-to-r from-primary-container to-primary-fixed-dim'
              : baseTextClass
          }`}
      >
        {item.label === 'Home' && <FaHome className="w-4 h-4" />}
        {item.label}
        {item.submenu && (
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>

      {item.submenu && (
        <div className="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-lg border border-outline-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
          {item.submenu.map((subitem, index) => (
            <Link
              key={subitem.label}
              href={subitem.href}
              onClick={(e) => handleNavClick(e, subitem.href)}
              replace
              scroll={false}
              className={`flex items-center gap-2 px-4 py-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors text-sm font-medium ${
                index !== item.submenu!.length - 1 ? 'border-b border-outline-variant/50' : ''
              }`}
            >
              {subitem.label === 'Our research areas' && <FaFlask className="w-4 h-4" />}
              {subitem.label === 'Projects' && <FaProjectDiagram className="w-4 h-4" />}
              {subitem.label === 'Publications' && <FaBook className="w-4 h-4" />}
              {subitem.label === 'Collaborations' && <FaHandshake className="w-4 h-4" />}
              {subitem.label === 'About MCAAI' && <FaInfoCircle className="w-4 h-4" />}
              {subitem.label === 'Team' && <FaUsers className="w-4 h-4" />}
              {subitem.label === 'Datasets' && <MdDataset className="w-4 h-4" />}
              {subitem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'apply' | 'partner' | null>(null);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const lastScrollY = useRef(0);

  const isApplyModalOpen = modalType !== null;
  const isHeaderDark = true;

  // Only called for actual navigation (no submenus), so safe to close drawer
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);

    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateHeaderState = () => {
      const heroSection = document.getElementById('home');

      if (!heroSection) {
        setIsScrolledPastHero(false);
        return;
      }

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const threshold = heroBottom - 96;
      setIsScrolledPastHero(window.scrollY >= threshold);
    };

    lastScrollY.current = window.scrollY;
    updateHeaderState();

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);

    return () => {
      window.removeEventListener('scroll', updateHeaderState);
      window.removeEventListener('resize', updateHeaderState);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-on-primary/10 bg-university-deep-blue shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">

            {/* LOGO */}
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              replace
              scroll={false}
              className="flex items-center"
            >
              <div className="md:hidden flex flex-row items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src="/MCAAI.png"
                    alt="MCAAI Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                    MCAAI
                  </span>
                  <span className="text-xs text-on-primary/80">Maseno University</span>
                </div>
              </div>

              <div className="hidden md:flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12">
                  
                  <Image
                    src="/MCAAI.png"
                    alt="MCAAI Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navigationItems.map((item) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    handleNavClick={handleNavClick}
                    isHeaderDark={isScrolledPastHero}
                  />
                ))}
            </nav>

            {/* DESKTOP CTA BUTTONS */}
            <div className="hidden md:flex gap-3 ml-6 flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalType('apply')}
                className="px-5 py-2.5 border-2 rounded-lg border-white bg-transparent font-semibold text-sm text-white transition-all hover:shadow-md hover:bg-white/10"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setModalType('partner')}
                className="px-5 py-2.5 rounded-lg bg-[#65C1CF] font-semibold text-sm text-white transition-all hover:shadow-md hover:opacity-90"
              >
                Partner
              </button>
            </div>

            {/* MOBILE MENU TOGGLE — matches md breakpoint of nav */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}" />
              <span className="block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}" />
              <span className="block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-university-deep-blue/60 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-16 md:top-20 right-0 w-80 max-w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white shadow-xl z-40 md:hidden overflow-y-auto">
            <MobileMenu
              items={navigationItems}
              onClose={() => setMobileMenuOpen(false)}
              onNavClick={handleNavClick}
            />
          </div>
        </>
      )}

      <UniversalFormModal
        open={isApplyModalOpen}
        title={modalType === 'partner' ? 'Partnership Inquiry' : 'Apply to MCAAI'}
        description={
          modalType === 'partner'
            ? 'Tell us about your partnership goals and how MCAAI can support your AI initiative.'
            : 'Submit a short application to tell us about your interest in MCAAI and how you want to get involved.'
        }
        onClose={() => setModalType(null)}
      >
        {modalType === 'partner' ? <PartnershipForm /> : <MCAAIApplicationForm />}
      </UniversalFormModal>
    </>
  );
}