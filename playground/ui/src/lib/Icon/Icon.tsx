import { clsx } from 'clsx';

import { ICON_NAME, type IconName } from './IconName';
import { SVGBambooHr } from './SVGBambooHr';
import { SvgBreezyHr } from './SVGBreezyHR';
import { SVGChevronDown } from './SVGChevronDown';
import { SVGGoogleGLetter } from './SVGGoogleGLetter';
import { SVGMapPin } from './SVGMapPin';

export type IconProps = {
  iconName: IconName;
  className?: string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

function RenderIcon({ iconName }: { iconName: IconName }) {
  switch (iconName) {
    case ICON_NAME.CHEVRON_DOWN:
      return <SVGChevronDown />;
    case ICON_NAME.GOOGLE_G_LETTER:
      return <SVGGoogleGLetter />;
    case ICON_NAME.BAMBOO_HR:
      return <SVGBambooHr />;
    case ICON_NAME.MAP_PIN:
      return <SVGMapPin />;
    case ICON_NAME.BREEZY:
      return <SvgBreezyHr />;
    default:
      return <div>no icon</div>;
  }
}

export function Icon(props: IconProps) {
  const { iconName, size, className = null } = props;

  return (
    <div
      className={clsx(
        {
          'h-4 w-4': size === 'xxs',
          'h-6 w-6': size === 'xs',
          'h-8 w-8': size === 'sm',
          'h-10 w-10': size === 'md',
          'h-12 w-12': size === 'lg',
          'h-16 w-16': size === 'xl',
        },
        'flex items-center justify-center',
        className,
      )}
    >
      <RenderIcon iconName={iconName} />
    </div>
  );
}
