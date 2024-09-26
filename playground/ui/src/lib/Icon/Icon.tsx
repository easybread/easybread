import { clsx } from 'clsx';
import { ICON_NAME, type IconName } from './IconName';
import { SVGGoogleGLetter } from './SVGGoogleGLetter';
import { SVGChevronDown } from './SVGChevronDown';
import { SVGBambooHr } from './SVGBambooHr';

export type IconProps = {
  iconName: IconName;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

function RenderIcon({ iconName }: { iconName: IconName }) {
  switch (iconName) {
    case ICON_NAME.CHEVRON_DOWN:
      return <SVGChevronDown />;
    case ICON_NAME.GOOGLE_G_LETTER:
      return <SVGGoogleGLetter />;
    case ICON_NAME.BAMBOO_HR:
      return <SVGBambooHr />;
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
          'w-6 h-6': size === 'xs',
          'w-8 h-8': size === 'sm',
          'w-10 h-10': size === 'md',
          'w-12 h-12': size === 'lg',
          'w-16 h-16': size === 'xl',
        },
        'flex items-center justify-center',
        className
      )}
    >
      <RenderIcon iconName={iconName} />
    </div>
  );
}
