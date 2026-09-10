'use client';

import { useState } from 'react';
import {
  FaTimes,
  FaChevronDown,
  FaHome,
  FaInfoCircle,
  FaFlask,
  FaUsers,
  FaNewspaper,
  FaEnvelope,
  FaProjectDiagram,
  FaBook,
  FaHandshake,
  FaDatabase,
  FaRocket
} from 'react-icons/fa';

interface NavItem {
  label: string;
  href: string;
  submenu?: NavItem[];
}

interface MobileMenuProps {
  items: NavItem[];
  onClose: () => void;
  onNavClick: (e: React.MouseEvent<HTMLElement>, href: string) => void;
}

const getNavIcon = (label: string) => {
  switch (label) {
    case 'Home':
      return <FaHome className="w-5 h-5" />;
    case 'About':
      return <FaInfoCircle className="w-5 h-5" />;
    case 'About MCAAI':
      return <FaInfoCircle className="w-5 h-5" />;
    case 'Research':
      return <FaFlask className="w-5 h-5" />;
    case 'Team':
      return <FaUsers className="w-5 h-5" />;
    case 'News & Events':
      return <FaNewspaper className="w-5 h-5" />;
    case 'Careers':
      return <FaUsers className="w-5 h-5" />;
    case 'Contact':
      return <FaEnvelope className="w-5 h-5" />;
    case 'Projects':
      return <FaProjectDiagram className="w-5 h-5" />;
    case 'Our research areas':
      return <FaFlask className="w-5 h-5" />;
    case 'Publications':
      return <FaBook className="w-5 h-5" />;
    case 'Collaborations':
      return <FaHandshake className="w-5 h-5" />;
    case 'Datasets':
      return <FaDatabase className="w-5 h-5" />;
    case 'Innovations':
      return <FaRocket className="w-5 h-5" />;
    default:
      return null;
  }
};

export default function MobileMenu({
  items,
  onClose,
  onNavClick,
}: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleSubmenu = (itemLabel: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemLabel)) {
      newExpanded.delete(itemLabel);
    } else {
      newExpanded.add(itemLabel);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string, item?: NavItem) => {
    if (item?.submenu) {
      e.preventDefault();
      toggleSubmenu(item.label);
      return;
    }

    onNavClick(e, href);
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Menu Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
        <h2 className="font-headline-lg text-[24px] text-university-deep-blue">
          Menu
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-container-low/50 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <FaTimes className="w-6 h-6 text-on-surface-variant" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2 space-y-0">
          {items.map((item) => (
            <li key={item.label}>
              <div className="flex items-center px-4 py-2">
                <span className="mr-3 text-primary">{getNavIcon(item.label)}</span>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item)}
                  className="flex-1 font-label-sm text-label-sm transition-all hover:bg-gray-50"
                >
                  {item.label}
                </a>

                {item.submenu && (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="p-2 text-label-sm hover:bg-surface-container-low/50 rounded-full transition-colors"
                    aria-label={`Toggle ${item.label} submenu`}
                  >
                    <FaChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${expandedItems.has(item.label) ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>

              {/* Submenu Items */}
              {item.submenu && expandedItems.has(item.label) && (
                <ul className="bg-surface-container-low/50 border-l-2 border-mcaai-teal/20">
                  {item.submenu.map((subitem) => (
                    <li key={subitem.label}>
                      <a
                        href={subitem.href}
                        onClick={(e) => handleNavClick(e, subitem.href)}
                        className="flex items-center gap-3 px-8 py-2 font-label-sm text-label-sm transition-all hover:bg-surface-container-low/50 hover:text-mcaai-teal"
                      >
                        <span>{getNavIcon(subitem.label)}</span>
                        {subitem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* CTA Buttons for Mobile */}
      <div className="border-t border-outline-variant/30 p-4 space-y-3 shrink-0">
        {/* Apply button - Secondary (teal outline) */}
        <button
          onClick={(e) => {
            onNavClick(e, '/');
            onClose();
          }}
          className="w-full border-2 border-mcaai-teal text-primary px-6 py-3 rounded-lg font-label-sm text-label-sm hover:bg-mcaai-teal/5 transition-all"
        >
          Apply
        </button>
        {/* Partner button - Green CTA */}
        <button
          onClick={(e) => {
            onNavClick(e, '/partners');
            onClose();
          }}
          className="w-full bg-mcaai-green text-on-secondary px-6 py-3 rounded-lg font-label-sm text-label-sm flex items-center gap-2 transition-all hover:bg-mcaai-green/90"
        >
          <span>Partner With Us</span>
          <FaChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}