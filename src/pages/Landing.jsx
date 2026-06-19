import useIsMobile from '../hooks/useIsMobile';
import LandingDesktop from './desktop/LandingDesktop';
import LandingMobile from './mobile/LandingMobile';

export default function Landing() {
  const isMobile = useIsMobile();
  return isMobile ? <LandingMobile /> : <LandingDesktop />;
}
