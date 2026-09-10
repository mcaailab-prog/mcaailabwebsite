import * as Md from 'react-icons/md';
import type { ComponentType, SVGProps } from 'react';

// Mapping from material-symbols-outlined names to react-icons Md equivalents
const iconMap: Record<string, keyof typeof Md> = {
  // Social & Communication
  'public': 'MdPublic',
  'share': 'MdShare',
  'mail': 'MdMail',
  'alternate_email': 'MdAlternateEmail',

  // Navigation & Arrows
  'arrow_forward': 'MdArrowForward',
  'keyboard_arrow_down': 'MdKeyboardArrowDown',
  'open_in_new': 'MdOpenInNew',

  // Common Icons
  'check_circle': 'MdCheckCircle',
  'close': 'MdClose',
  'description': 'MdDescription',
  'link': 'MdLink',

  // Research & Education
  'biotech': 'MdBiotech',
  'school': 'MdSchool',
  'groups': 'MdGroups',
  'record_voice_over': 'MdRecordVoiceOver',
  'sign_language': 'MdSignLanguage',
  'translate': 'MdTranslate',
  'science': 'MdScience',
  'attach_money': 'MdAttachMoney',
  'person': 'MdPerson',

  // Agriculture & Environment
  'agriculture': 'MdAgriculture',
  'sensors': 'MdSensors',

  // Content & Media
  'article': 'MdArticle',
  'calendar_today': 'MdCalendarToday',
  'emoji_events': 'MdEmojiEvents',
  'lightbulb': 'MdLightbulb',
  'handshake': 'MdHandshake',
  'rocket_launch': 'MdRocketLaunch',

  // Business & Finance
  'dataset': 'MdDataset',
  'progress_activity': 'MdRefresh',
  'send': 'MdSend',

  // Add more mappings as needed
};

const FALLBACK_ICON: keyof typeof Md = 'MdHelpOutline';

// Helper function to get the react-icons component name for a given icon name
export const getIcon = (iconName: string): keyof typeof Md => {
  return iconMap[iconName] || FALLBACK_ICON;
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  name: string;
  size?: number | string;
  color?: string;
}

// Component wrapper for easy usage
export const Icon = ({ name, size = 24, color = 'currentColor', style, ...props }: IconProps) => {
  const iconKey = iconMap[name] || FALLBACK_ICON;
  const IconComponent = Md[iconKey] as ComponentType<SVGProps<SVGSVGElement>>;

  return (
    <IconComponent
      {...props}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color,
        ...style,
      }}
    />
  );
};

export default Icon;