import logo from './easybread_logo.png';
import Image from 'next/image';

export type LogoEasyBreadProps = {
  size?: 'sm' | 'md' | 'lg';
};

export function LogoEasyBread(props: LogoEasyBreadProps) {
  const { size = 'md' } = props;
  const width = size === 'sm' ? 28 : size === 'lg' ? 52 : 40;
  const height = size === 'sm' ? 28 : size === 'lg' ? 52 : 40;

  return (
    <Image
      src={logo}
      alt="logo"
      width={width}
      height={height}
      className={'mr-4'}
    />
  );
}
